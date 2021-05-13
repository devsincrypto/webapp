import { GetStaticProps } from 'next';
import React from 'react';

import { Pricing } from '../components/pricing';
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
		revalidate: 60,
	};
};

interface PricingProps {
	products: SupabaseProduct[];
}

export default function PricingPage({
	products,
}: PricingProps): React.ReactElement {
	return <Pricing products={products} />;
}
