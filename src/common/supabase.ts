import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { createClient, User } from '@supabase/supabase-js';

export interface SupabasePrice {
	currency: string;
	description?: string;
	interval: number;
	products: SupabaseProduct;
	unit_amount: number;
}
export interface SupabaseProduct {
	name: string;
}

export interface SupabaseSubscription {
	prices: SupabasePrice;
	status?: string;
}

export interface SupabaseUser {
	full_name?: string;
}

export const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL as string,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function getActiveProductsWithPrices() {
	const { data, error } = await supabase
		.from('products')
		.select('*, prices(*)')
		.eq('active', true)
		.eq('prices.active', true)
		.order('metadata->index')
		.order('unit_amount', { foreignTable: 'prices' });

	if (error) {
		throw error;
	}

	// eslint-disable-next-line
	return data || [];
}

export function updateUserName(
	user: User,
	name: string
): PostgrestFilterBuilder<any> {
	return supabase
		.from('users')
		.update({
			full_name: name,
		})
		.eq('id', user.id);
}

export const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL as string,
	process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const getUser = async (jwt: string): Promise<User | null> => {
	const { data, error } = await supabaseAdmin.auth.api.getUser(jwt);

	if (error) {
		throw error;
	}

	return data;
};
