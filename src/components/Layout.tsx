import React from 'react';

import { Footer } from './Footer';

export const Layout: React.FunctionComponent = ({ children }) => {
	return (
		<div className="p-2">
			{children}
			<Footer />
		</div>
	);
};
