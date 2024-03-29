'use client';
import { UserAuth } from '@/app/context/AuthContext';
import useAddToContinueWatching from '@/app/lib/firebase/useContinueWatching';
import Details from '@/app/components/Details/Details';
import { MovieDetails, ShowDetails, recommendationProps } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { DetectAdblock } from '@scthakuri/adblock-detector';
import useSetTracker from '@/app/lib/firebase/useSetTracker';
import { doc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { fetchDMCA } from '@/app/lib/fetchDMCA';
import Player from './Player/Player';
import Fallbacks from './Fallbacks';
import { getImagePath } from '@/app/lib/tmdb';
import { useMainStore } from '@/app/store/main-state-provider';
import Vibrant from 'node-vibrant';
import { Palette } from 'node-vibrant/lib/color';
export interface DetailsData {
	recommendations: { results: recommendationProps[] };
	credits: any;
	keywords: any;
	videos: any;
	// reviews: any;
	external: any;
}
interface MainProps {
	params: { type: string; id: number };
	sources: any;
	result: MovieDetails | ShowDetails | null;
	sections: DetailsData;
}

const Main = ({ params, result, sections }: MainProps) => {
	const { id, type } = params;
	const { user } = UserAuth();

	const {
		season,
		setSeason,
		episode,
		setEpisode,
		playerVisibility,
		setIsInDMCA,
		isinDMCA,
		isInFuture,
		setSections,
		setIsInFuture,
		setResult,
		setAdBlocker,
	} = useMainStore((state) => state);

	const [palette, setPalette] = useState<Palette | null>(null);

	useEffect(() => {
		setSections(sections);
		setResult(result);
	}, []);

	useEffect(() => {
		if (!result) return;
		if ('poster_path' in result) {
			getColorPalette().then((data) => {
				setPalette(data);
			});
		}
	}, [result]);

	const getColorPalette = (): Promise<Palette> => {
		return new Promise((resolve): void => {
			const img = document.createElement('img');
			img.crossOrigin = 'Anonymous';
			img.src = getImagePath(result?.poster_path, 'original');
			img.addEventListener('load', async (): Promise<void> => {
				const vibrant = new Vibrant(img);
				const palette = await vibrant.getPalette();
				// console.log(palette);

				resolve(palette);
			});
		});
	};

	// memoize the string for palette gradient and change it when palette changes
	// const gradient = React.useMemo(() => {
	// 	if (!palette) return '';
	// 	return `radial-gradient(at 20% 40%, ${palette.Vibrant?.hex} 0px, transparent 50%), radial-gradient(at 60% 80%, ${palette.LightVibrant?.hex} 0px, transparent 50%), radial-gradient(at 10% 20%, ${palette.DarkVibrant?.hex} 0px, transparent 50%), radial-gradient(at 80% 100%, ${palette.Muted?.hex} 0px, transparent 50%), radial-gradient(at 50% 50%, ${palette.LightMuted?.hex} 0px, transparent 50%), radial-gradient(at 50% 50%, ${palette.DarkMuted?.hex} 0px, transparent 50%)`;
	// }, [palette]);
	const gradient = React.useMemo(() => {
		if (!palette) return '';
		return `radial-gradient(at 40% 20%, ${palette.Vibrant?.hex} 0px, transparent 50%), radial-gradient(at 80% 0%, ${palette.DarkVibrant?.hex} 0px, transparent 50%), radial-gradient(at 0% 50%, ${palette.Muted?.hex} 0px, transparent 50%), radial-gradient(at 80% 50%, ${palette.Muted?.hex} 0px, transparent 50%), radial-gradient(at 0% 100%, ${palette.LightMuted?.hex} 0px, transparent 50%), radial-gradient(at 0% 0%, ${palette.DarkMuted?.hex} 0px, transparent 50%), radial-gradient(at 80% 100%, ${palette.LightMuted?.hex} 0px, transparent 50%)`;
	}, [palette]);

	`radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%),
radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%);`;

	const [value] = useDocumentData(doc(db, 'users/' + user?.uid));

	const ca = useAddToContinueWatching(result?.media_type, result?.id);
	const { set } = useSetTracker();

	// if release date of the content is in the future, show a countdown timer
	useEffect(() => {
		if (!result) return;
		if ('release_date' in result) {
			if (result.release_date) {
				const releaseDate = new Date(result.release_date);
				const currentDate = new Date();
				if (releaseDate > currentDate) {
					setIsInFuture(true);
				}
			}
		}

		fetchDMCA().then((data) => {
			if (data.includes(result.id)) {
				setIsInDMCA(true);
			}
		});
	}, [result]);

	useEffect(() => {
		DetectAdblock((detected) => {
			// console.log('Adblock detected:', detected);
			if (detected) {
				setAdBlocker(true);
			}
		});
	}, []);
	useEffect(() => {
		// console.log(`%c ${season} ${episode}`, 'background: #222; color: #bada55; font-size: 25px; font-weight: bold;');
	}, [season, episode]);

	// start a 30 second timer, after which the content will be added to firestore continue watching
	// if the user is logged in
	useEffect(() => {
		if (!user) return;
		if (result?.media_type === 'tv') {
			if (!value) return;
			if (value && value.tracker && !value.tracker[id]) {
				set(season, episode, id);
			}
		}

		const timer = setTimeout(
			() => {
				if (result) {
					ca.add();
				}
			},
			1000 * 60 * 5
		); // 5 minutes
		return () => clearTimeout(timer);
	}, [user, result, value]);

	useEffect(() => {
		if (type === 'tv') {
			// from the tracker data that fetch tracker returns, check if there's a tracker for the current id, if not, check if the first season's name is Specials, if it is, setSeason to 1, else setSeason to 0
			// if there is a tracker for the current id, setSeason to the season number and setEpisode to the episode number
			if (result.seasons[0].name === 'Specials') {
				setSeason(1);
			} else {
				setSeason(0);
			}

			if (!value) return;
			if (!value.tracker) return;
			if (!value.tracker[id]) return;

			// console.log('setting season and episode');
			// console.log(value);
			// console.log(value.tracker[id].episodeNumber, value.tracker[id].seasonNumber);
			setEpisode(value.tracker[id].episodeNumber);
			setSeason(value.tracker[id].seasonNumber);
		}
	}, [user, value]);

	useEffect(() => {
		// console.log(result);
	}, [result]);

	useEffect(() => {
		// set html overflow to hidden when player is visible
		if (playerVisibility) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}, [playerVisibility]);

	if (isInFuture || isinDMCA) {
		return <Fallbacks isInFuture={isInFuture} isinDMCA={isinDMCA} result={result} />;
	}

	return (
		<>
			<div className="min-h-screen w-full bg-background text-foreground dark">
				<AnimatePresence mode="wait">
					{result && playerVisibility && (
						<motion.div
							initial={{ opacity: 0, filter: 'blur(10px)' }}
							className="fixed z-40 aspect-video h-screen w-full overflow-hidden bg-black"
							animate={{ opacity: 1, filter: 'blur(0px)' }}
							exit={{ opacity: 0, filter: 'blur(10px)' }}
							transition={{ duration: 0.2 }}
						>
							{result?.media_type === 'tv' && <Player />}
							{result?.media_type === 'movie' && <Player />}
						</motion.div>
					)}
				</AnimatePresence>

				<div className="absolute h-screen w-full overflow-hidden">
					{result?.backdrop_path ? (
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 0.4 }}
							viewport={{ once: true }}
							className="fc pointer-events-none absolute w-full justify-start overflow-hidden"
						>
							<div className="absolute bottom-0 z-10 aspect-[2/3] w-full bg-gradient-to-b from-transparent via-transparent via-60% to-black sm:aspect-[2/1]"></div>
							<Image
								width={1920}
								height={540}
								className="aspect-[2/3] w-full object-cover object-center sm:aspect-[2/1]"
								src={getImagePath(result.backdrop_path, 'original')}
								alt={'title' in result && result.title ? result.title : result.original_title}
							/>
						</motion.div>
					) : palette ? (
						<>
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								className="fc pointer-events-none absolute w-full justify-start overflow-hidden"
							>
								<div className="absolute bottom-0 z-10 aspect-[2/1] w-full bg-gradient-to-b from-transparent to-black"></div>
								<div
									className="aspect-[2/1] w-full object-cover object-center blur-2xl"
									style={{
										// backgroundColor: 'hsla(0,100%,50%,1)',
										// random radial gradients with all the colors from the palette, each has own radial gradient
										background: gradient,
									}}
								></div>
							</motion.div>
						</>
					) : null}
				</div>
				<div className="w-full overflow-hidden pt-16 sm:pl-10 sm:pt-8 md:pl-20">
					{/* show all palette colors  in a grid */}

					{type === 'movie' && result && 'title' in result ? (
						<Details />
					) : type === 'tv' && result && 'seasons' in result ? (
						<>
							<div className="relative z-10 h-full w-full sm:px-5">
								{/* <div className="fc z-10 aspect-video w-full bg-background sm:rounded-2xl">
									<div className="fr w-full flex-wrap gap-3 pt-2 sm:justify-between">
										<SeasonButton
											id={id}
											result={result}
											setSeason={setSeason}
											setEpisode={setEpisode}
											set={set}
											season={season}
										/>
										<div className="fr flex-wrap gap-3">
											<SourcesButton setSource={setSource} sourceCollection={sourceCollectionTV} source={source} />
										</div>
									</div>
									<EpisodeSlider
										setSeason={setSeason}
										setEpisode={setEpisode}
										episode={episode}
										season={season}
										id={id}
										result={result}
									/>
								</div> */}
							</div>

							<Details />
						</>
					) : null}
				</div>
			</div>
		</>
	);
};

export default Main;
