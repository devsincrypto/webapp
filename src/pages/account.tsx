import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { postData, useUser } from '../util';

function Card({ title, description, footer, children }: any) {
	return (
		<div className="border border-accents-1	max-w-3xl w-full p rounded-md m-auto my-8">
			<div className="px-5 py-4">
				<h3 className="text-2xl mb-1 font-medium">{title}</h3>
				<p className="text-accents-5">{description}</p>
				{children}
			</div>
			<div className="border-t border-accents-1 bg-primary-2 p-4 text-accents-3 rounded-b-md">
				{footer}
			</div>
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
		// eslint-disable-next-line
		const { url } = await postData({
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
			currency: subscription.prices.currency,
			minimumFractionDigits: 0,
		}).format(subscription.prices.unit_amount / 100);

	return (
		<section className="bg-black mb-32">
			<div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
				<div className="sm:flex sm:flex-col sm:align-center">
					<h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
						Account
					</h1>
					<p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
						We partnered with Stripe for a simplified billing.
					</p>
				</div>
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
							`${subscriptionPrice}/${subscription.prices.interval}`
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
					footer={<p>We will email you to verify the change.</p>}
				>
					<p className="text-xl mt-8 mb-4 font-semibold">
						{user ? user.email : undefined}
					</p>
				</Card>
			</div>
		</section>
	);
}
