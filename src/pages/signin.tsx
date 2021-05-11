import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useUser } from '../common';
import { Head, Nav } from '../components';

export default function Signin(): React.ReactElement {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPasswordInput, setShowPasswordInput] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type?: string; content?: string }>(
		{}
	);
	const router = useRouter();
	const { user, signIn } = useUser();

	const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);
		setMessage({});

		const { error } = await signIn({ email, password });
		if (error) {
			setMessage({ type: 'error', content: error.message });
		}
		if (!password) {
			setMessage({
				type: 'note',
				content: 'Check your email for the magic link.',
			});
		}
		setLoading(false);
	};

	useEffect(() => {
		if (user) {
			router.replace('/account').catch(console.error);
		}
	}, [router, user]);

	if (!user)
		return (
			<>
				<Head />
				<Nav />

				{message.content && (
					<div
						className={`${
							message.type === 'error'
								? 'text-pink'
								: 'text-green'
						} border ${
							message.type === 'error'
								? 'border-pink'
								: 'border-green'
						} p-3`}
					>
						{message.content}
					</div>
				)}

				{showPasswordInput ? (
					<form onSubmit={handleSignin}>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.currentTarget.value)}
							required
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
							required
						/>
						<button
							type="submit"
							disabled={!password.length || !email.length}
						>
							Sign in
						</button>
					</form>
				) : (
					<form onSubmit={handleSignin}>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.currentTarget.value)}
							required
						/>
						<button type="submit" disabled={!email.length}>
							Send magic link
						</button>
					</form>
				)}

				<button
					onClick={() => {
						if (showPasswordInput) setPassword('');
						setShowPasswordInput(!showPasswordInput);
						setMessage({});
					}}
				>
					{`Or sign in with ${
						showPasswordInput ? 'magic link' : 'password'
					}.`}
				</button>

				<span className="pt-1 text-center text-sm">
					Don&apos;t have an account?
					<Link href="/signup">Sign up.</Link>
				</span>
			</>
		);

	return <div className="m-6">Loading...</div>;
}
