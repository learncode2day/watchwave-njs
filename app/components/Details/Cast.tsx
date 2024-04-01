import { getImagePath } from '@/app/lib/tmdb';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoPerson } from 'react-icons/io5';
interface Props {
	credits: any;
	imdbId: string;
}
const Cast = ({ credits, imdbId }: Props) => {
	return (
		<div className="fc my-10 w-full">
			<h3 className="mb-5 text-3xl font-bold">Cast</h3>
			<div className="my-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{credits && credits && credits.length !== 0 && (
					<>
						{credits.slice(0, 12).map((cast: any) => (
							<Link href={`/cast/${cast.id}`} key={cast.id} className="fr gap-3 bg-foreground-100 rounded-xl px-3 py-2">
								{cast.profile_path ? (
									<Image
										src={getImagePath(cast.profile_path, 'w185')}
										alt={cast.name}
										className="rounded-xl aspect-[2/3] object-cover"
										width={64}
										height={64}
									/>
								) : (
									<div className="rounded-xl w-16 aspect-[2/3] bg-foreground-200 fc p-2">
										<IoPerson className="text-4xl text-foreground-500" />
									</div>
								)}
								<div className="fc w-full gap-1 justify-start items-start">
									<span className="font-bold text-xl">{cast.name}</span>
									<span>{cast.character}</span>
								</div>
							</Link>
						))}
					</>
				)}
			</div>
			{credits.length > 12 && (
				<div className="w-full fc py-1 text-xl font-bold">
					<Link href={`https://www.imdb.com/title/${imdbId}/fullcredits`} target="blank">
						+ {credits.length - 12} more
					</Link>
				</div>
			)}
		</div>
	);
};

export default Cast;
