import type { ChartData, ChartOptions } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import type { DevsByMonthResult } from '../../db/users';

const buildData = (devsByMonth: DevsByMonthResult[]): ChartData => ({
	labels: devsByMonth.map(({ monthYear }) => monthYear),
	datasets: [
		{
			label: '# of monthly active crypto devs',
			data: devsByMonth.map(({ userCount }) => userCount),
			backgroundColor: 'rgb(0, 112, 243)',
			borderColor: 'rgba(0, 112, 243, 0.2)',
		},
	],
});

const options: ChartOptions = {
	scales: {
		// eslint-disable-next-line
		// @ts-ignore FIXME How to fix this typing error?
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
				},
			},
		],
	},
};

export interface DevsByMonthProps {
	devsByMonth: DevsByMonthResult[];
}

export function DevsByMonth({
	devsByMonth,
}: DevsByMonthProps): React.ReactElement {
	return (
		<>
			<h3>Monthly active developers</h3>
			<p>
				There seems to be a slight downwards pattern in monthly active
				developers since 2018.
			</p>
			<Line data={buildData(devsByMonth)} options={options} />
		</>
	);
}
