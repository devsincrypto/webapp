import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Head, Nav } from '../components';
import { postData } from '../util/helpers';
import { useUser } from '../util/useUser';

function Card({ title, description, footer, children }: any) {
	return (
		<div>
			<div>
				<h3>{title}</h3>
				<p>{description}</p>
				{children}
			</div>
			<div>{footer}</div>
		</div>
	);
}
export default function Account(): React.ReactElement {
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
			<Head />
			<Nav />
			<div className="thin-container">
				<section>
					<div>
						<h1>My Account</h1>
						<p>
							We partnered with Stripe for a simplified billing.
						</p>
					</div>
					<div className="p-4">
						<Card
							title="Your Plan"
							description={
								subscriptionName &&
								`You are currently on the ${subscriptionName} plan.`
							}
							footer={
								<div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
									<p className="pb-4 sm:pb-0">
										Manage your subscription on Stripe.
									</p>
									<button
										disabled={loading || !subscription}
										onClick={redirectToCustomerPortal}
									>
										Open customer portal
									</button>
								</div>
							}
						>
							<div className="text-xl mt-8 mb-4 font-semibold">
								{!userLoaded ? (
									<div className="h-12 mb-6">Loading...</div>
								) : subscriptionPrice && subscription ? (
									`${subscriptionPrice}/${
										subscription?.prices?.interval ||
										'no interval'
									}`
								) : (
									<Link href="/">
										<a>Choose your plan</a>
									</Link>
								)}
							</div>
						</Card>
						<Card
							title="Your Name"
							description="Please enter your full name, or a display name you are comfortable with."
							footer={<p>Please use 64 characters at maximum.</p>}
						>
							<div className="text-xl mt-8 mb-4 font-semibold">
								{userDetails ? (
									`${userDetails?.full_name ?? ''}`
								) : (
									<div className="h-8 mb-6">Loading...</div>
								)}
							</div>
						</Card>
						<Card
							title="Your Email"
							description="Please enter the email address you want to use to login."
							footer={
								<p>We will email you to verify the change.</p>
							}
						>
							<p className="text-xl mt-8 mb-4 font-semibold">
								{user ? user.email : undefined}
							</p>
						</Card>
					</div>
				</section>
			</div>
		</>
	);
}
