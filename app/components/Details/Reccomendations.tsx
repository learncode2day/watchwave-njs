import React from 'react';
import Slider from '../Slider';

const Reccomendations = ({ recommendations }: { recommendations: any }) => {
	return (
		<div>
			{recommendations && recommendations.results && recommendations.results.length !== 0 && (
				<div className="fc w-full justify-start my-14 light">
					<h3 className="mb-5 text-3xl font-bold">More Like This</h3>
					<Slider
						section={{
							collection: recommendations.results,
							url: '', // Add the missing url property
							page: 1, // Add the missing page property
							heading: '', // Add the missing heading property
						}}
						more={false}
					/>
				</div>
			)}
		</div>
	);
};

export default Reccomendations;
