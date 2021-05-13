import { GetStaticProps } from 'next';
import React from 'react';

import { Head, Nav, Pricing } from '../components';
import {
	getActiveProductsWithPrices,
	SupabaseProduct,
} from '../util/supabaseClient';

export const getStaticProps: GetStaticProps = async () => {
	const products = await getActiveProductsWithPrices();

	return {
		props: {
			products,
		},
	};
};

interface PricingProps {
	products: SupabaseProduct[];
}

export default function PricingPage({
	products,
}: PricingProps): React.ReactElement {
	return (
		<>
			<Head />
			<Nav />
			<div className="thin-container">
				<Pricing products={products} />
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
