import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { getImagePath } from '@/app/lib/tmdb';
const Fallbacks = ({ result, isInFuture, isinDMCA }: { result: any; isInFuture: boolean; isinDMCA: boolean }) => {
	return (
		<div className="fc min-h-screen w-full overflow-hidden bg-background text-foreground dark">
			{result && (
				<div className="fc relative h-full w-full">
					<Image
						src={getImagePath(result.backdrop_path, 'original')}
						alt="backdrop"
						width={1920}
						height={1080}
						className="absolute h-screen w-full object-cover object-center"
					/>
					<div className="fc absolute rounded-2xl border border-foreground/30 bg-background/50 p-5 backdrop-blur-2xl">
						{isInFuture && (
							<>
								<h3 className="text-center text-2xl font-bold">
									{result && 'title' in result && result.title ? result.title : 'name' in result ? result.name : ''} has not been
									released yet
								</h3>
								{'release_date' in result && result.release_date ? (
									<h4 className="text-center text-lg">
										{/* May 5, 2024 format with date-fns */}
										Set to release on {format(new Date(result.release_date), 'MMMM d, yyyy')}
									</h4>
								) : null}
							</>
						)}
						{isinDMCA && (
							<h3 className="text-center text-2xl font-bold">
								{result && 'title' in result && result.title ? result.title : 'name' in result ? result.name : ''} has been removed
								due to DMCA
							</h3>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Fallbacks;
