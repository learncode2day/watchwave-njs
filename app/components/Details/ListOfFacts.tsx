import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { addMinutes, format } from 'date-fns';
const ListOfFacts = ({ result, external }: { result: any; external: any }) => {
	const timeConvert = (n: number): string => {
		const num = n;
		const hours = num / 60;
		const rhours = Math.floor(hours);
		const minutes = (hours - rhours) * 60;
		const rminutes = Math.round(parseFloat(minutes.toString()));
		return rhours + ' h ' + rminutes + 'm';
	};
	const renderContentRating = () => {
		if (result.content_rating) {
			return (
				<div className="inline-detail">
					<li key="content-rating" className="rounded-lg border-1 border-[#a1a1a1] px-1.5">
						{result.content_rating}
					</li>
				</div>
			);
		}
		return null;
	};

	const renderRuntime = () => {
		if (result.runtime) {
			return (
				<li key="runtime" className="inline-detail">
					{timeConvert(result.runtime)}
				</li>
			);
		}
		return null;
	};

	const renderSeasons = () => {
		if (result.number_of_seasons) {
			return (
				<li key="seasons" className="inline-detail">
					{result.number_of_seasons} Seasons
				</li>
			);
		}
		return null;
	};

	const renderEpisodes = () => {
		if (result.number_of_episodes) {
			return (
				<li key="episodes" className="inline-detail">
					{result.number_of_episodes} Episodes
				</li>
			);
		}
		return null;
	};

	const renderIMDBLink = () => {
		if (external.imdb_id) {
			return (
				<div className="inline-detail">
					<Link key="imdb-link" target="_blank" href={`https://imdb.com/title/${external.imdb_id}`}>
						<Image src="/imdb.svg" className="h-6 w-auto" width={50} height={25.1} alt={'Imdb logo'} />
					</Link>
				</div>
			);
		}
		return null;
	};

	let detailsArray = [];

	if (result.release_date)
		detailsArray.push(
			<li key="release-date" className="inline-detail">
				{result.release_date}
			</li>
		);
	detailsArray.push(renderContentRating());
	detailsArray.push(renderRuntime());
	detailsArray.push(renderIMDBLink());

	// remove null values
	detailsArray = detailsArray.filter((item) => item);

	if (result.first_air_date) {
		detailsArray.push(
			<li key="first-air-date" className="inline-detail">
				{result.first_air_date}
			</li>
		);
		detailsArray.push(renderSeasons());
		detailsArray.push(renderEpisodes());

		// remove null values
		detailsArray = detailsArray.filter((item) => item);
	}

	return (
		<ul className="inline-flex flex-wrap pb-3 font-bold tracking-tight divide-x-[1px] gap-y-2 divide-zinc-400">
			{detailsArray.map((item) => item)}
		</ul>
	);
};

export default ListOfFacts;
