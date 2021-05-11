import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';
import Stripe from 'stripe';

export const stripe = new Stripe(
	(process.env.STRIPE_SECRET_KEY_LIVE ??
		process.env.STRIPE_SECRET_KEY) as string,
	{
		// https://github.com/stripe/stripe-node#configuration
		apiVersion: '2020-08-27',
		// Register this as an official Stripe plugin.
		// https://stripe.com/docs/building-plugins#setappinfo
		appInfo: {
			name: 'Next.js Subscription Starter',
			version: '0.1.0',
		},
	}
);

let stripePromise: Promise<StripeJS | null> | undefined;

export const getStripe = (): Promise<StripeJS | null> | undefined => {
	if (!stripePromise) {
		stripePromise = loadStripe(
			(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
				process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) as string
		);
	}

	return stripePromise;
};
