import { createClient, User } from '@supabase/supabase-js';

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
