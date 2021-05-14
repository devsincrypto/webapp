import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Head, Nav } from '../components';
import { PricingCard } from '../components/PricingCard';
import { postData } from '../util/helpers';
import {
	getActiveProductsWithPrices,
	SupabaseProductWithPrice,
} from '../util/supabaseClient';
import { useUser } from '../util/useUser';

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

interface AccountProps {
	product: SupabaseProductWithPrice;
}

export default function Account({ product }: AccountProps): React.ReactElement {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { userLoaded, user, session, userDetails, subscription } = useUser();

	useEffect(() => {
		if (!user) router.replace('/signin').catch(console.error);
	}, [router, user]);

	const redirectToCustomerPortal = async () => {
		setLoading(true);
		await postData({
			url: '/api/create-portal-link',
			token: session?.access_token,
		});

		setLoading(false);
	};

	const subscriptionName = subscription?.prices?.products?.name;
	const subscriptionPrice =
		subscription &&
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: subscription.prices?.currency,
			minimumFractionDigits: 0,
		}).format((subscription?.prices?.unit_amount || 0) / 100);

	return (
		<>
			<Nav />
			<div className="thin-container">
				<h1>Account Dashboard</h1>

				{userLoaded ? (
					<>
						<section className="section">
							<h3>
								{subscriptionName
									? `You are currently on the ${subscriptionName} plan.`
									: "You currently don't have any subscriptions."}
							</h3>

							<div>
								{subscriptionPrice ? (
									`${subscriptionPrice}/${
										subscription?.prices?.interval ||
										'no interval'
									}`
								) : (
									<PricingCard product={product} />
								)}
							</div>
							{subscription && (
								<>
									<p>Manage your subscription on Stripe.</p>
									<button onClick={redirectToCustomerPortal}>
										Open customer portal
									</button>
								</>
							)}
						</section>

						<section className="section">
							<h3>Your Details</h3>
							<div className="columns">
								<form className="column col-8 col-mx-auto">
									<div className="form-group">
										<label
											className="form-label"
											htmlFor="input-name"
										>
											Please enter your full name, or a
											display name you are comfortable
											with.
										</label>
										<input
											className="form-input"
											id="input-name"
											placeholder="Name"
										/>
									</div>
									<div className="form-group">
										<label
											className="form-label"
											htmlFor="input-email"
										>
											Please enter the email address you
											want to use to login.
											<br /> We will email you to verify
											the change.
										</label>
										<input
											className="form-input"
											id="input-email"
											placeholder="Email"
											value={user?.email}
										/>
									</div>
								</form>
							</div>
						</section>
					</>
				) : (
					<p>Loading...</p>
				)}
			</div>
		</>
	);
}
