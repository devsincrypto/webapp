export const toDateTime = (secs: number): Date => {
	const t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
	t.setSeconds(secs);

	return t;
};

/**
 * Like Promise.all, but with max concurrency.
 *
 * @see https://gist.github.com/jcouyang/632709f30e12a7879a73e9e132c0d56b#gistcomment-3253738
 */
export async function promiseAllLimit<T>(
	n: number,
	list: (() => Promise<T>)[]
): Promise<T[]> {
	const head = list.slice(0, n);
	const tail = list.slice(n);
	const result: T[] = [];
	const execute = async (
		promise: () => Promise<T>,
		i: number,
		runNext: () => Promise<void>
	) => {
		result[i] = await promise();
		await runNext();
	};
	const runNext = async () => {
		const i = list.length - tail.length;
		const promise = tail.shift();
		if (promise !== undefined) {
			await execute(promise, i, runNext);
		}
	};
	await Promise.all(head.map((promise, i) => execute(promise, i, runNext)));

	return result;
}
