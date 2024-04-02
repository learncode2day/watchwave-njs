'use client';

import { useEffect, useState } from 'react';
import options from './lib/options';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MovieDetails } from '@/types';

const StreamingServices = () => {
	const services = [
		{
			name: 'Netflix',
			id: [8],
			results: [],
		},
		{
			name: 'Amazon Prime',
			id: [9, 119],
			results: [],
		},
		{
			name: 'Disney+',
			id: [337],
			results: [],
		},
		{
			name: 'Apple TV',
			id: [2, 350],
			results: [],
		},
		{
			name: 'HBO Max',
			id: [384],
			results: [],
		},
	];

	const tabs = [
		{
			id: 'netflix',
			label: 'Netflix',
			color: '#E50914',
		},
		{
			id: 'amazon',
			label: 'Amazon Prime',
			color: '#00A8E1',
		},
		{
			id: 'disney',
			label: 'Disney+',
			color: '#0083C3',
		},
		{
			id: 'apple',
			label: 'Apple TV',
			color: '#000000',
		},
		{
			id: 'hbo',
			label: 'HBO Max',
			color: '#000000',
		},
	];

	const [streamingServices, setStreamingServices] = useState(services);
	const [navbarHidden, setNavbarHidden] = useState(false);
	const [activeTab, setActiveTab] = useState(tabs[0]);
	// fetch streaming specific content: Netflix, Amazon Prime, Disney+, Apple TV, HBO Max, Hulu, Peacock, Paramount

	// array of ids for each streaming service

	const fetchStreamingServicesContent = async () => {
		// fetch content from each streaming service
		// use https://developers.themoviedb.org/3/discover/tv-discover

		// loop through services array
		// fetch content for each service
		// store content in a service array

		const res = await Promise.all(
			services.map(async (service) => {
				// map through ids for each service
				const content = await Promise.all(
					service.id.map(async (id) => {
						const res = await fetchContent(id);
						return res;
					})
				);

				// if multiple ids, flatten the array, and remove duplicates
				const res = content.flat().filter((v, i, a) => a.indexOf(v) === i);
				console.log(res);

				// set the results in the service object
				service.results = res;
				return service;
			})
		);
		console.log(res);
		setStreamingServices(res);
	};

	const fetchContent = async (id: number) => {
		const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_networks=${id}`, options);
		const data = await response.json();

		console.log(data.results);
		return data.results;
	};

	useEffect(() => {
		fetchStreamingServicesContent();
	}, []);

	return (
		<section className="fc w-full items-start gap-3 overflow-hidden">
			<h2 className="px-5 text-2xl font-bold text-white sm:text-4xl">{activeTab.label}</h2>
			<div className="rounded-full w-full sm:w-[initial] sm:px-6 py-3 bg-zinc-800/40 backdrop-blur-2xl">
				<ul className="fr w-full overflow-hidden">
					{tabs.map(({ id, label, color }) => (
						<button
							key={id}
							onClick={() => {
								setActiveTab({ id, label, color });
							}}
							className={`${
								activeTab.id === id ? '' : 'hover:text-white/60'
							} relative rounded-full px-3 py-1.5 text-sm font-medium text-white transition focus-visible:outline-2`}
							style={{
								WebkitTapHighlightColor: 'transparent',
							}}
						>
							{activeTab.id === id && (
								<motion.span
									data-cursor="fill"
									layoutId="bubble"
									className="absolute inset-0 z-10 bg-white mix-blend-difference"
									style={{ borderRadius: 9999 }}
									transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
								/>
							)}
							{label}
						</button>
					))}
				</ul>
			</div>

			{/* grid of images, no swiper */}
			<div className="grid grid-cols-8 mt-3 w-full">
				{streamingServices &&
					streamingServices
						.find((service) => service.name.toLowerCase().includes(activeTab.id))
						?.results.map((content: MovieDetails) => (
							<div key={content.id} className="w-full">
								<Image
									src={`https://image.tmdb.org/t/p/original${content.poster_path}`}
									alt={content.title}
									width={200 / 1.5}
									height={300 / 1.5}
									className="object-cover"
								/>
							</div>
						))}
			</div>
		</section>
	);
};

export default StreamingServices;
