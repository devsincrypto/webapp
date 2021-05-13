import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { postData } from '../util/helpers';
import { getStripe } from '../util/stripeClient';
import type { SupabasePrice, SupabaseProduct } from '../util/supabaseClient';
import { useUser } from '../util/useUser';

export interface PricingProps {
	products: SupabaseProduct[];
}

export function Pricing({ products }: PricingProps): React.ReactElement {
	const router = useRouter();
	const [priceIdLoading, setPriceIdLoading] = useState<string | false>();
	const { session, userLoaded, subscription } = useUser();

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

	if (!products.length)
		return <p>Error: No subscription pricing plans found.</p>;

	return (
		<div className="section">
			<h1 className="text-center">Pricing Plan</h1>
			<p className="text-center">
				One unique plan, same for everyone. No yearly discount, no
				pay-as-you-go.
				<br />
				Just <mark>one simple plan</mark>.
			</p>
			<div className="columns">
				{products.map((product) => {
					const price = product.prices && product.prices[0];
					if (!price || !price.unit_amount) {
						return (
							<p>
								Error: No price found for product {product.id}.
							</p>
						);
					}

					const priceString = new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: price.currency,
						minimumFractionDigits: 0,
					}).format(price.unit_amount / 100);

					return (
						<div
							className="column col-8 col-mx-auto card"
							key={product.id}
						>
							<div className="card-header">
								<div className="card-title">
									<h5 className="text-center">
										{priceString}/month
									</h5>
								</div>
								<div className="card-subtitle text-center">
									Monthly Subscription
								</div>
							</div>
							<div className="card-body">
								<ul>
									<li>Reveal Github logins for all users.</li>
									<li>Download tables as CSV.</li>
									<li>
										<span className="chip">
											Coming Soon
										</span>
										Email and LinkedIn profile for users.
									</li>
									<li>Cancel anytime.</li>
								</ul>
							</div>
							<div className="card-footer p-centered">
								<button
									className="btn btn-primary btn-lg"
									onClick={() => handleCheckout(price)}
								>
									Pay by Credit Card
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
