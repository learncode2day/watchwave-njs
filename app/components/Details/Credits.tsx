import { castProps } from '@/types';
import { Tooltip } from '@nextui-org/react';
import React from 'react';

const Credits = ({ credits }: { credits: any }) => {
	return (
		<div>
			{credits && (
				<>
					<li className="fr items-start justify-start gap-3 w-full">
						<div className="font-bold">Cast:</div>
						<p>
							{credits.slice(0, 5).map((cast: castProps, i: number, arr: typeof credits) => (
								<Tooltip key={cast.name} content={cast.character}>
									<span className="underline-offset-2 hover:underline">
										<a
											target="_blank"
											href={`https://www.imdb.com/name/${cast.imdb_id}`}
											aria-label={`View details for ${cast.name}`}
										>
											{cast.name + (i !== arr.length - 1 ? ', ' : '')}
										</a>
									</span>
								</Tooltip>
							))}
						</p>
					</li>
				</>
			)}
		</div>
	);
};

export default Credits;
