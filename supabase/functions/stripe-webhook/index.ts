import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'AdresseParcelle Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (!('customer' in stripeData)) {
    return;
  }

  // for one time payments, we only listen for the checkout.session.completed event
  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
  } else {
    let isSubscription = true;

    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData as Stripe.Checkout.Session;

      isSubscription = mode === 'subscription';

      console.info(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    if (isSubscription) {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    } else if (mode === 'payment' && payment_status === 'paid') {
      try {
        // Extract the necessary information from the session
        const {
          id: checkout_session_id,
          payment_intent,
          amount_subtotal,
          amount_total,
          currency,
        } = stripeData as Stripe.Checkout.Session;

        // Insert the order into the stripe_orders table
        const { error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id,
          payment_intent_id: payment_intent,
          customer_id: customerId,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status: 'completed', // assuming we want to mark it as completed since payment is successful
        });

        if (orderError) {
          console.error('Error inserting order:', orderError);
          return;
        }
        console.info(`Successfully processed one-time payment for session: ${checkout_session_id}`);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }

    // Gérer les événements d'expiration et d'annulation d'abonnement
    if (event.type === 'customer.subscription.deleted' || 
        event.type === 'customer.subscription.updated') {
      console.info(`Handling subscription change event: ${event.type} for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    }

    // Gérer les échecs de paiement qui peuvent mener à l'expiration
    if (event.type === 'invoice.payment_failed') {
      console.info(`Handling payment failure for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    }
  }
}

// Helper function to determine if subscription status means user is Pro
function isProSubscriptionStatus(status: string): boolean {
  return ['active', 'trialing'].includes(status);
}

// Helper function to update user's Pro status and subscription dates in profiles table
async function updateUserProStatus(customerId: string, isPro: boolean, subscriptionData?: any) {
  try {
    // First, get the user_id from the stripe_customers table
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .is('deleted_at', null)
      .single();

    if (customerError || !customerData) {
      console.error(`Failed to find user for customer ${customerId}:`, customerError);
      return;
    }

    // Prepare update data
    const updateData: any = { 
      is_pro: isPro,
      updated_at: new Date().toISOString()
    };

    // If user becomes Pro and we have subscription data, set subscription_start_date
    if (isPro && subscriptionData) {
      // Convert Unix timestamp to ISO string
      const startDate = new Date(subscriptionData.current_period_start * 1000).toISOString();
      const endDate = new Date(subscriptionData.current_period_end * 1000).toISOString();
      
      updateData.subscription_start_date = startDate;
      updateData.subscription_end_date = endDate;
      updateData.subscription_status = subscriptionData.status;
      
      console.info(`Setting subscription dates: start=${startDate}, end=${endDate}, status=${subscriptionData.status}`);
    } else if (!isPro) {
      // If user is no longer Pro, clear subscription dates and set status to expired/canceled
      updateData.subscription_start_date = null;
      updateData.subscription_end_date = null;
      updateData.subscription_status = subscriptionData ? subscriptionData.status : 'canceled';
      
      console.info(`User is no longer Pro, clearing subscription dates and setting status to: ${updateData.subscription_status}`);
    }

    // Update the user's Pro status and subscription info in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', customerData.user_id);

    if (profileError) {
      console.error(`Failed to update Pro status for user ${customerData.user_id}:`, profileError);
      return;
    }

    console.info(`Successfully updated Pro status to ${isPro} for user ${customerData.user_id} (customer ${customerId})`);
    if (isPro && subscriptionData) {
      console.info(`Subscription dates updated: ${updateData.subscription_start_date} to ${updateData.subscription_end_date}`);
    }
  } catch (error) {
    console.error(`Error updating Pro status for customer ${customerId}:`, error);
  }
}

// based on the excellent https://github.com/t3dotgg/stripe-recommendations
async function syncCustomerFromStripe(customerId: string) {
  try {
    // fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    let subscriptionStatus = 'not_started';
    let isPro = false;
    let subscriptionData = null;

    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      
      // Update subscription status to not_started
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }

      // User has no subscription, so they're not Pro
      isPro = false;
    } else {
      // assumes that a customer can only have a single subscription
      const subscription = subscriptions.data[0];
      subscriptionStatus = subscription.status;
      isPro = isProSubscriptionStatus(subscription.status);
      subscriptionData = subscription;

      // store subscription state
      const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          subscription_id: subscription.id,
          price_id: subscription.items.data[0].price.id,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
            ? {
                payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
                payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
              }
            : {}),
          status: subscription.status,
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (subError) {
        console.error('Error syncing subscription:', subError);
        throw new Error('Failed to sync subscription in database');
      }
    }

    // Update the user's Pro status and subscription dates in the profiles table
    await updateUserProStatus(customerId, isPro, subscriptionData);

    console.info(`Successfully synced subscription for customer: ${customerId} (Pro: ${isPro}, Status: ${subscriptionStatus})`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}