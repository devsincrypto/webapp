import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { postData } from '../util/helpers';
import { getStripe } from '../util/stripeClient';
import type {
	SupabasePrice,
	SupabaseProductWithPrice,
} from '../util/supabaseClient';
import { useUser } from '../util/useUser';

export interface PricingCardProps {
	product: SupabaseProductWithPrice;
}

export function PricingCard({ product }: PricingCardProps): React.ReactElement {
	const router = useRouter();
	const [priceIdLoading, setPriceIdLoading] = useState<string | false>();
	const { session, subscription } = useUser();

	const price = product.prices[0];
	if (!price || !price.unit_amount) {
		return <p>Error: No price found for product {product.id}.</p>;
	}

	const handleCheckout = async (price: SupabasePrice) => {
		setPriceIdLoading(price.id);

		if (!session) {
			return router.push('/signin');
		}
		if (subscription) {
			return router.push('/account');
		}

		try {
			const { sessionId } = await postData<{ sessionId: string }>({
				url: '/api/create-checkout-session',
				data: { price },
				token: session.access_token,
			});

			const stripe = await getStripe();
			if (!stripe) {
				throw new Error('Empty stripe object at checkout');
			}
			stripe.redirectToCheckout({ sessionId }).catch(console.error);
		} catch (error) {
			alert(error);
		} finally {
			setPriceIdLoading(false);
		}
	};

	const priceString = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: price.currency,
		minimumFractionDigits: 0,
	}).format(price.unit_amount / 100);

	return (
		<div className="column col-8 col-mx-auto card" key={price.product_id}>
			<div className="card-header">
				<div className="card-title">
					<h5 className="text-center">{priceString}/month</h5>
				</div>
				<div className="card-subtitle text-center">
					Monthly Subscription
				</div>
			</div>
			<div className="card-body">
				<ul>
					<li>Reveal Github logins for all developers.</li>
					<li>Download tables as CSV.</li>
					<li>
						<span className="chip">Coming Soon</span>
						Email and LinkedIn profile for developers.
					</li>
					<li>Cancel anytime.</li>
				</ul>
			</div>
			<div className="card-footer p-centered">
				<button
					className="btn btn-primary btn-lg"
					disabled={!!priceIdLoading}
					onClick={() => handleCheckout(price)}
				>
					{priceIdLoading
						? 'Redirecting to Stripe...'
						: 'Pay by Credit Card'}
				</button>
			</div>
		</div>
	);
}
