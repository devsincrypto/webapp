import { GetStaticProps } from 'next';
import React from 'react';

import { Nav, PricingCard } from '../components';
import {
	getActiveProductsWithPrices,
	SupabaseProductWithPrice,
} from '../util/supabaseClient';

export const getStaticProps: GetStaticProps = async () => {
	const products = await getActiveProductsWithPrices();

	// We just have one product for now.
	if (products.length !== 1) {
		throw new Error(`Expected 1 product, found ${products.length}.`);
	}

	return {
		props: {
			product: products[0],
		},
	};
};

interface PricingProps {
	product: SupabaseProductWithPrice;
}

export default function PricingPage({
	product,
}: PricingProps): React.ReactElement {
	return (
		<>
			<Nav />
			<div className="thin-container">
				<div className="section">
					<h1 className="text-center">Pricing Plan</h1>
					<p className="text-center">
						One unique plan, same for everyone. No yearly discount,
						no pay-as-you-go.
						<br />
						Just <mark>one simple plan</mark>.
					</p>
					<PricingCard product={product} />
				</div>
				<section className="section">
					<h2 className="text-center">FAQ</h2>
					<h4>How can I pay?</h4>
					<p>
						We partnered with{' '}
						<a
							href="https://stripe.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							Stripe
						</a>{' '}
						for simplified billing. You can pay by credit or debit
						card.
					</p>
					<h4>In what currencies can I pay?</h4>
					<p>You can pay in USD or in EUR.</p>
				</section>
				<section className="section">
					<h2 className="text-center">Still have some questions?</h2>
					<p className="text-center">
						Send an email to{' '}
						<div className="chip">
							<figure
								className="avatar avatar-sm"
								data-initial="AM"
							></figure>
							amaury@devsincrypto.com
						</div>
						,
						<br />I reply pretty fast.
					</p>
				</section>
			</div>
		</>
	);
}
