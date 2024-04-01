'use client';
import NewCard from '@/app/components/NewCard';
import options from '@/app/lib/options';
import { getImagePath } from '@/app/lib/tmdb';
import { PersonDetails, castProps } from '@/types';
import { Button, Chip, ScrollShadow } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useMeasure } from '@uidotdev/usehooks';

type Props = {
	actor: PersonDetails;
};

const formatDate = (date: string) => {
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const d = new Date(date);
	const day = d.getDate();
	const month = monthNames[d.getMonth()];
	const year = d.getFullYear();
	return `${month} ${day}, ${year}`;
};

const Actor = ({ actor }: Props) => {
	console.log('actor', actor);
	const [showMore, setShowMore] = useState<boolean>(false);
	const [actorCredits, setActorCredits] = useState(null);
	const [ref, { width, height }] = useMeasure();
	useEffect(() => {
		console.log('width', width);
		console.log('height', height);
	}, [width, height]);

	useEffect(() => {
		fetch(`https://api.themoviedb.org/3/person/${actor.id}/combined_credits?language=en-US`, options)
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
				setActorCredits(response);
			})
			.catch((err) => console.error(err));
	}, []);

	const handleLoadMore = () => {
		setIndex([index[0], index[1] + 20]);
	};

	const [index, setIndex] = useState<number[]>([0, 20]);

	return (
		<div className="min-h-screen w-full bg-background text-foreground dark pt-28 sm:pl-20 md:pl-36">
			<div className="w-full fc">
				<div className="fc md:fr md:justify-start md:items-start w-full  px-10 gap-5">
					<motion.div
						// blur in
						initial={{ opacity: 0, filter: 'blur(10px)' }}
						// blur out
						animate={{ opacity: 1, filter: 'blur(0px)' }}
						className="relative"
					>
						<Image
							alt={actor.name}
							src={getImagePath(actor.profile_path, 'original')}
							width={300}
							height={450}
							className="max-w-[200px] md:max-w-[200px] lg:max-w-[300px] w-full md:w-[initial] rounded-2xl z-30 relative"
						/>
						<div className="scale-125 absolute inset-0 blur-2xl z-20 opacity-50 pointer-events-none">
							<Image
								src={getImagePath(actor.profile_path, 'w300')}
								className="w-full h-full"
								width={300}
								height={450}
								alt="actor profile image"
							/>
						</div>
					</motion.div>

					<main className="fc items-start gap-3 z-10">
						<motion.h1
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="text-5xl font-semibold mb-3"
						>
							{actor?.name}
						</motion.h1>
						<motion.ul initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="fr gap-3">
							{actor?.homepage && (
								<>
									<li>
										<a className="sm:hover:underline underline-offset-2" href={actor?.homepage}>
											Website
										</a>
									</li>
									<li>•</li>
								</>
							)}
							<li>
								<Chip>{actor?.known_for_department}</Chip>
							</li>
							<li>•</li>
							<li className="fr justify-start gap-3">
								<Link href={`https://imdb.com/title/${actor.imdb_id}`}>
									<Image src="/imdb.svg" className="h-6 w-auto" width={50} height={25.1} alt={'Imdb logo'} />
								</Link>
							</li>
						</motion.ul>

						<motion.ul
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="fc gap-2 items-start"
						>
							{actor?.birthday && (
								<li className="text-2xl">
									<p className="text-xl">
										<span className="font-semibold">Birthday: </span>
										{formatDate(actor?.birthday)}
									</p>
								</li>
							)}
							{actor?.place_of_birth && (
								<li className="text-2xl">
									<p className="text-xl">
										<span className="font-semibold">Place of Birth: </span>
										{actor?.place_of_birth}
									</p>
								</li>
							)}
							{actor?.deathday && (
								<li className="text-2xl">
									<p className="text-xl">
										<span className="font-semibold">Deathday: </span>
										{formatDate(actor?.deathday)}
									</p>
								</li>
							)}
						</motion.ul>
						{actor?.biography && (
							<>
								<motion.div
									className="overflow-hidden relative"
									initial={{ height: 'auto' }}
									animate={{ height: showMore ? 'auto' : height && height < 250 ? 'auto' : 250 }}
								>
									<motion.p
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
										ref={ref}
										className="text-base text-foreground-500"
									>
										{actor?.biography}
									</motion.p>
									<ScrollShadow>
										<AnimatePresence>
											{!showMore && height && height > 250 && (
												<motion.div
													initial={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className="w-full h-2/3 absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-background"
												/>
											)}
										</AnimatePresence>
									</ScrollShadow>
								</motion.div>
								{height && height >= 250 && (
									<div className="w-full fr justify-end">
										<Button variant="bordered" onClick={() => setShowMore(!showMore)}>
											Show {showMore ? 'Less' : 'More'}
										</Button>
									</div>
								)}
							</>
						)}
					</main>
				</div>
				<section className="w-full px-3 sm:px-10 my-20">
					<motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-4xl font-semibold mb-5">
						Known For
					</motion.h2>
					<motion.div
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						transition={{
							staggerChildren: 0.1,
						}}
						className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 md:gap-5 gap-3 place-items-start"
					>
						{actorCredits?.cast &&
							actorCredits?.cast
								.slice(index[0], index[1])
								// sort by release date
								// .sort((a: castProps, b: castProps) => {
								// 	if (a.release_date && b.release_date) {
								// 		return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
								// 	}
								// 	return 0;
								// })
								// .filter((movie: castProps) => movie.poster_path)
								.map((movie, i) => (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										// subtract previous length of the array to make sure delay isn't too long when loading more
										transition={{ delay: i * 0.1 - (index[1] - 20) * 0.1 }}
										key={movie.id + movie.media_type}
										className="w-full fc light justify-start"
									>
										<NewCard content={movie} />
									</motion.div>
								))}
					</motion.div>

					{/* dont show if total movies are 10 */}
					{actorCredits?.cast?.length !== 10 && (
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="w-full fr">
							<Button className="mt-10" variant="bordered" onClick={handleLoadMore}>
								Load More
							</Button>
						</motion.div>
					)}
				</section>
			</div>
		</div>
	);
};

export default Actor;
