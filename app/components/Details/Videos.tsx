import { videoProps } from '@/types';
import React from 'react';
import Video from '../Video';

const Videos = ({ videos }: { videos: any }) => {
	return (
		<div>
			{videos && videos.results && videos.results.length !== 0 && (
				<div className="fc my-14 w-full">
					<h3 className="mb-5 text-3xl font-bold">Trailers</h3>
					<div className="fr w-full flex-wrap gap-5">
						{videos.results
							.filter((video: videoProps) => video.site === 'YouTube' && video.type === 'Trailer')
							.sort((a: videoProps, b: videoProps) => b.size - a.size)
							.map((video: videoProps) => (
								<Video key={video.id} video={video} />
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Videos;
