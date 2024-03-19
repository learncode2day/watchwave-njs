import { genresProps } from '@/types';
import { Chip } from '@nextui-org/react';
import React from 'react';

const Genres = ({ result }: { result: any }) => {
	return (
		<>
			<li className="fr items-start justify-start gap-3 w-full">
				<div className="font-bold">Genres</div>
				<div className="fr flex-wrap justify-start gap-2">
					{result.genres && result.genres.map((genre: genresProps, i: number) => <Chip key={i}>{genre.name}</Chip>)}
				</div>
			</li>
		</>
	);
};

export default Genres;
