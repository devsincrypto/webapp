export const getURL = (): string => {
	const url =
		process?.env?.URL && process.env.URL !== ''
			? process.env.URL
			: process?.env?.VERCEL_URL && process.env.VERCEL_URL !== ''
			? process.env.VERCEL_URL
			: 'http://localhost:3000';

	return url.includes('http') ? url : `https://${url}`;
};

export const postData = async <T = any>({
	url,
	token,
	data,
}: {
	url: string;
	token?: string;
	data?: any;
}): Promise<T> => {
	const res = await fetch(url, {
		method: 'POST',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		headers: new Headers({ 'Content-Type': 'application/json', token }),
		credentials: 'same-origin',
		body: JSON.stringify(data),
	});

	return res.json() as Promise<T>;
};

export const toDateTime = (secs: number): Date => {
	const t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
	t.setSeconds(secs);

	return t;
};
