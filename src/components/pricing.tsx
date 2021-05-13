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
			console.error(error);
		} finally {
			setPriceIdLoading(false);
		}
	};

	if (!products.length)
		return (
			<section>
				<div>
					<div></div>
					<p>
						No subscription pricing plans found. Create them in your{' '}
						<a
							href="https://dashboard.stripe.com/products"
							rel="noopener noreferrer"
							target="_blank"
						>
							\ Stripe Dashboard
						</a>
						.
					</p>
				</div>
			</section>
		);

	return (
		<section>
			<div>
				<div>
					<h1>Pricing Plans</h1>
					<p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
						Start building for free, then add a site plan to go
						live. Account plans unlock additional features.
					</p>
				</div>
				<div>
					{products.map((product) => {
						const price = product.prices && product.prices[0];
						if (!price) {
							throw new Error('No price for product in Pricing.');
						}

						const priceString = new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: price.currency,
							minimumFractionDigits: 0,
						}).format((price.unit_amount || 0) / 100);

						return (
							<div key={product.id}>
								<div className="p-6">
									<h2>{product.name}</h2>
									<p>{product.description}</p>
									<p className="mt-8">
										<span>{priceString}</span>
										<span>/month</span>
									</p>
									<button
										disabled={!!session && !userLoaded}
										onClick={() => handleCheckout(price)}
									>
										{product.name ===
										subscription?.prices?.products?.name
											? 'Manage'
											: 'Subscribe'}
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
