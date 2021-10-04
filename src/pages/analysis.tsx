import { GetStaticProps } from 'next';
import React from 'react';

import { DevsByMonth } from '../components';
import devsByMonth from '../db/json/charts/devsByMonth.json';
import { DevsByMonthResult } from '../db/users';

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {
			devsByMonth,
		},
	};
};

interface AnalysisProps {
	devsByMonth: DevsByMonthResult[];
}

export default function Analysis({
	devsByMonth,
}: AnalysisProps): React.ReactElement {
	return (
		<>
			<div className="thin-container">
				<div className="section">
					<h1>Analysis</h1>

					<DevsByMonth devsByMonth={devsByMonth} />
				</div>

				<div className="section">
					<p className="text-italic">
						More analyses are coming soon. You can also{' '}
						<a
							href="https://github.com/devsincrypto/webapp/issues?q=is%3Aissue+is%3Aopen+label%3Acharts"
							target="_blank"
							rel="noopener noreferrer"
						>
							head to Github
						</a>{' '}
						to propose new charts you think could be relevant for
						Devs in Crypto.
					</p>
				</div>
			</div>
		</>
	);
}
