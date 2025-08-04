import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key (pk_test_...)
const stripePublishableKey = 'pk_test_51RWMvlC4qsJR1P9l44VhGBck76BW2TlXE9vS30suLkTxINjWsGS6wXwxyCtvkqZFnBdEcjS6EY4z9OuW8cVedqEc00tz8e44vm';

export const stripePromise = loadStripe(stripePublishableKey);