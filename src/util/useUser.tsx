import type {
	Provider,
	Session,
	User,
	UserCredentials,
} from '@supabase/gotrue-js';
import React, {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react';

import { supabase, SupabaseSubscription, SupabaseUser } from './supabase';

interface UserContext {
	session: Session | null;
	signIn: (
		options: UserCredentials
	) => Promise<{
		session: Session | null;
		user: User | null;
		provider?: Provider;
		url?: string | null;
		error: Error | null;
	}>;
	signUp: (
		options: UserCredentials
	) => Promise<{
		session: Session | null;
		user: User | null;
		provider?: Provider;
		url?: string | null;
		error: Error | null;
	}>;
	subscription: SupabaseSubscription | null;
	user: User | null;
	userDetails: SupabaseUser | null;
	userLoaded: boolean;
}

export const UserContext = createContext({} as UserContext);

export const UserContextProvider: FunctionComponent = (
	props
): React.ReactElement => {
	const [userLoaded, setUserLoaded] = useState(false);
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [userDetails, setUserDetails] = useState(null);
	const [subscription, setSubscription] = useState(null);

	useEffect(() => {
		const session = supabase.auth.session();
		setSession(session);
		setUser(session?.user ?? null);
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				setUser(session?.user ?? null);
			}
		);

		return () => {
			authListener?.unsubscribe();
		};
	}, []);

	const getUserDetails = () => supabase.from('users').select('*').single();
	const getSubscription = () =>
		supabase
			.from('subscriptions')
			.select('*, prices(*, products(*))')
			.in('status', ['trialing', 'active'])
			.single();

	useEffect(() => {
		if (user) {
			Promise.allSettled([getUserDetails(), getSubscription()])
				.then((results) => {
					// eslint-disable-next-line
					// @ts-ignore
					setUserDetails(results[0].value.data); // eslint-disable-line
					// eslint-disable-next-line
					// @ts-ignore
					setSubscription(results[1].value.data); // eslint-disable-line
					setUserLoaded(true);
				})
				.catch(console.error);
		}
	}, [user]);

	const value = {
		session,
		user,
		userDetails,
		userLoaded,
		subscription,
		signIn: (options: UserCredentials) => supabase.auth.signIn(options),
		signUp: (options: UserCredentials) => supabase.auth.signUp(options),
		signOut: () => {
			setUserDetails(null);
			setSubscription(null);
			return supabase.auth.signOut();
		},
	};
	return <UserContext.Provider value={value} {...props} />;
};

export function useUser(): UserContext {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error(`useUser must be used within a UserContextProvider.`);
	}

	return context;
}
