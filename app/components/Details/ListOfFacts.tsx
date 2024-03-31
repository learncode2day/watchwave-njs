import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
const ListOfFacts = ({ result, external }: { result: any; external: any }) => {
	const timeConvert = (n: number): string => {
		const num = n;
		const hours = num / 60;
		const rhours = Math.floor(hours);
		const minutes = (hours - rhours) * 60;
		const rminutes = Math.round(parseFloat(minutes.toString()));
		return rhours + ' h ' + rminutes + 'm';
	};
	return (
		<>
			{external && (
				<>
					{'release_date' in result ? (
						<ul className="inline-flex flex-wrap gap-2 pb-3 font-bold tracking-tight">
							{/* year, content rating, runtime, imdb */}
							<li className="inline-detail">{result.release_date.split('-')[0]}</li>
							{(result.content_rating || result.runtime || external.imdb_id) && <span>•</span>}
							{result.content_rating && (
								<>
									<li className="inline-detail rounded-lg border-1 border-[#a1a1a1] px-1.5">{result.content_rating}</li>
									{(result.runtime || external.imdb_id) && <span>•</span>}
								</>
							)}
							{result.runtime && (
								<>
									<li className="inline-detail">{timeConvert(result.runtime)}</li>
									{external.imdb_id && <span>•</span>}
								</>
							)}
							{external.imdb_id && (
								<Link target="_blank" href={`https://imdb.com/title/${external.imdb_id}`}>
									<Image src="/imdb.svg" className="h-6 w-auto" width={50} height={25.1} alt={'Imdb logo'} />
								</Link>
							)}
						</ul>
					) : (
						<ul className="inline-flex flex-wrap gap-2 pb-3 font-bold tracking-tight">
							{result.first_air_date && result.last_air_date && (
								<li className="inline-detail">
									{result.first_air_date.split('-')[0]} - {result.last_air_date.split('-')[0]}
								</li>
							)}
							{result.first_air_date &&
								result.last_air_date &&
								result.content_rating &&
								result.number_of_seasons &&
								result.number_of_episodes &&
								external.imdb_id && <span>•</span>}
							{result.content_rating && (
								<>
									<li className="inline-detail rounded-lg border-1 border-[#a1a1a1] px-1.5">{result.content_rating}</li>
									{(result.number_of_seasons || result.number_of_episodes || external.imdb_id) && <span>•</span>}
								</>
							)}
							{result.number_of_seasons && (
								<>
									<li className="inline-detail">{result.number_of_seasons} Seasons</li>
									{(result.number_of_episodes || external.imdb_id) && <span>•</span>}
								</>
							)}
							{result.number_of_episodes && (
								<>
									<li className="inline-detail">{result.number_of_episodes} Episodes</li>
									{external.imdb_id && <span>•</span>}
								</>
							)}
							{external.imdb_id && (
								<Link target="_blank" href={`https://imdb.com/title/${external.imdb_id}`}>
									<Image src="/imdb.svg" className="h-6 w-auto" width={50} height={25.1} alt={'Imdb logo'} />
								</Link>
							)}
						</ul>
					)}
				</>
			)}
		</>
	);
};

export default ListOfFacts;
