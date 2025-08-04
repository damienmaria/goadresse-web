import { STRIPE_PRODUCTS } from '../stripe-config';
import { supabase } from '../lib/supabase';

interface CreateCheckoutSessionParams {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  customerId?: string | null;
}

export const createCheckoutSession = async ({
  priceId,
  mode,
  successUrl,
  cancelUrl,
  customerId
}: CreateCheckoutSessionParams) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('No active session');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL environment variable is not set');
    }

    // Ensure the URL doesn't have a trailing slash
    const baseUrl = supabaseUrl.replace(/\/$/, '');
    const functionUrl = `${baseUrl}/functions/v1/stripe-checkout`;
    
    console.log('Calling Stripe checkout function at:', functionUrl);
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        price_id: priceId,
        mode,
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      let errorMessage = 'Failed to create checkout session';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);

    const { url } = responseData;

    if (!url) {
      throw new Error('No checkout URL returned');
    }

    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to payment service. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};

export const handleStripePortal = async (customerId: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('No active session');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL environment variable is not set');
    }

    // Ensure the URL doesn't have a trailing slash
    const baseUrl = supabaseUrl.replace(/\/$/, '');
    const functionUrl = `${baseUrl}/functions/v1/stripe-portal`;

    console.log('Calling Stripe portal function at:', functionUrl);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        return_url: `${window.location.origin}/profile`,
      }),
    });

    console.log('Portal response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Portal error response:', errorText);
      
      let errorMessage = 'Failed to create portal session';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    const { url } = responseData;

    if (!url) {
      throw new Error('No portal URL returned');
    }

    // Redirect to Stripe Customer Portal
    window.location.href = url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to payment service. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};