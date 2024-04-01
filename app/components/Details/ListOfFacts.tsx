import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { addMinutes, format } from 'date-fns';
const ListOfFacts = ({ result, external }: { result: any; external: any }) => {
	const timeConvert = (n: number): string => {
		const date = addMinutes(new Date(0), n);
		return format(date, "H 'h' m 'm'");
	};
	const renderContentRating = () => {
		if (result.content_rating) {
			return [
				<li key="content-rating" className="inline-detail rounded-lg border-1 border-[#a1a1a1] px-1.5">
					{result.content_rating}
				</li>,
				'•',
			];
		}
		return [];
	};

	const renderRuntime = () => {
		if (result.runtime) {
			return [
				<li key="runtime" className="inline-detail">
					{timeConvert(result.runtime)}
				</li>,
				'•',
			];
		}
		return [];
	};

	const renderSeasons = () => {
		if (result.number_of_seasons) {
			return [
				<li key="seasons" className="inline-detail">
					{result.number_of_seasons} Seasons
				</li>,
				'•',
			];
		}
		return [];
	};

	const renderEpisodes = () => {
		if (result.number_of_episodes) {
			return [
				<li key="episodes" className="inline-detail">
					{result.number_of_episodes} Episodes
				</li>,
				'•',
			];
		}
		return [];
	};

	const renderIMDBLink = () => {
		if (external.imdb_id) {
			return [
				<Link key="imdb-link" target="_blank" href={`https://imdb.com/title/${external.imdb_id}`}>
					<Image src="/imdb.svg" className="h-6 w-auto" width={50} height={25.1} alt={'Imdb logo'} />
				</Link>,
			];
		}
		return [];
	};

	const detailsArray = [
		result.release_date && [
			<li key="release-date" className="inline-detail">
				{result.release_date.split('-')[0]}
			</li>,
			'•',
			...renderContentRating(),
			...renderRuntime(),
			...renderIMDBLink(),
		],
		result.first_air_date &&
			result.last_air_date && [
				<li key="air-date" className="inline-detail">
					{result.first_air_date.split('-')[0]} - {result.last_air_date.split('-')[0]}
				</li>,
				'•',
				...renderContentRating(),
				...renderSeasons(),
				...renderEpisodes(),
				...renderIMDBLink(),
			],
	];

	return <ul className="inline-flex flex-wrap gap-2 pb-3 font-bold tracking-tight">{detailsArray.flat().slice(0, -1)}</ul>;
};

export default ListOfFacts;
