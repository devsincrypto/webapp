import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { createClient, User } from '@supabase/supabase-js';

export interface SupabasePrice {
	active: boolean;
	currency: string;
	description: string | null;
	id: string;
	interval: string | null;
	interval_count: number | null;
	metadata: Record<string, string>;
	product_id: string;
	products?: SupabaseProduct; // Populated on join.
	trial_period_days?: number | null;
	type: string;
	unit_amount: number | null;
}

export interface SupabaseProduct {
	active: boolean;
	description: string | null;
	id: string;
	image?: string | null;
	metadata: Record<string, string>;
	name: string;
	prices?: SupabasePrice[]; // Populated on join.
}

export interface SupabaseSubscription {
	id: string;
	cancel_at: Date | null;
	cancel_at_period_end: boolean;
	canceled_at: Date | null;
	created: Date;
	current_period_end: Date;
	current_period_start: Date;
	ended_at: Date | null;
	metadata: Record<string, string>;
	price_id: string;
	prices?: SupabasePrice; // Populated on join.
	quantity: string;
	status?: string;
	trial_end: Date | null;
	trial_start: Date | null;
	user_id: string;
}

export interface SupabaseCustomer {
	id: string;
	stripe_customer_id: string;
}

export interface SupabaseUser {
	full_name?: string;
	uuid: string;
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
