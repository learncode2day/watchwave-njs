'use client';
import { useMainStore } from '@/app/store/main-state-provider';
import { useTVStore } from '@/app/store/tv-state-provider';
import { ScrollShadow } from '@nextui-org/react';
import { motion } from 'framer-motion';
import React from 'react';
import Separator from '../Separator';
import PButton from './PButton';
import { Episode, Season } from '@/types';
import { IoArrowBack } from 'react-icons/io5';
import { usePlayerStore } from '@/app/store/player-state-provider';
import useSetTracker from '@/app/lib/firebase/useSetTracker';

export const EpisodePanel = () => {
	const { setEpisodePanelVisible, isDeep, setIsDeep, episode, season, setEpisode, setSeason, displaySeason, setDisplaySeason } = useTVStore(
		(state) => state
	);
	const { result } = useMainStore((state) => state);
	const { loaderO, setLoaderO } = usePlayerStore((state) => state);
	const { set } = useSetTracker();
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.1 }}
			className="absolute inset-0 z-20"
		>
			<div className="h-full w-full px-10 py-10" onClick={() => setEpisodePanelVisible(false)} />

			<div className="absolute py-20 pt-10 fc justify-end h-full bottom-0 right-5 z-20 w-full max-w-[350px] pointer-events-none">
				<div className="fc w-full h-full justify-start gap-2 rounded-2xl bg-black/70 px-5 py-6 text-white/70 shadow-xl backdrop-blur-2xl overflow-hidden pointer-events-auto">
					<ScrollShadow
						hideScrollBar
						className="fc absolute h-full w-full transform-gpu justify-start px-8 py-5"
						style={{
							transform: `translateX(${isDeep ? '-100%' : '0%'})`,
							transition: 'transform 0.3s ease-in-out',
						}}
					>
						<div className="fr w-full items-end justify-between">
							<h2 className="text-sm font-bold uppercase text-white/50">Seasons</h2>
						</div>
						<Separator />
						<ul className="fc w-full items-start gap-2">
							{result.seasons.map((s: Season, i) => {
								if (s.name === 'Specials') return null;
								return (
									<PButton
										action={() => {
											setDisplaySeason(i);
											setIsDeep(true);
										}}
										primary={i === season}
										key={s.name}
										end="arrow"
									>
										<div className="fr gap-3">
											<div className="fc size-7 rounded-lg bg-foreground-100 text-white/60">
												{s.name === 'Specials' ? 'S' : `S${i + 1}`}
											</div>
											<span>{s.name}</span>
										</div>
									</PButton>
								);
							})}
						</ul>
					</ScrollShadow>
					<ScrollShadow
						hideScrollBar
						className="fc absolute h-full w-full transform-gpu justify-start px-8 py-5"
						style={{
							transform: `translateX(${isDeep ? '0%' : '100%'})`,
							transition: 'transform 0.3s ease-in-out',
						}}
					>
						{result && (
							<div className="fc w-full items-start">
								<div className="fr w-full justify-start gap-2">
									<button onClick={() => setIsDeep(false)} className="rounded-lg bg-transparent p-2 text-xl hover:bg-white/10">
										<IoArrowBack />
									</button>
									<h2 className="font-bold text-white/50">{result.seasons[displaySeason].name}</h2>
								</div>
								<Separator />
								<ul className="fc my-2 w-full items-start gap-2">
									{/* take current language and match with 2 letter code in sources */}
									{result.seasons[displaySeason].episodes.map((e: Episode, i) => (
										<PButton
											action={() => {
												// set season index
												console.log({
													season: displaySeason + 1,
													episode: i + 1,
												});
												setSeason(displaySeason);
												setEpisode(i + 1);
												set(displaySeason, i + 1, result.id);
												// set firebase tracker

												// // set every object's completed key in loaderO array back to false
												// setLoaderO(
												//   loaderO.map((l) => {
												//     return { ...l, completed: false };
												//   }),
												// );
												// setEpisodePanelVisible(false);
											}}
											key={e.name}
											// if belongs to season and i is the current episode
											primary={i + 1 === episode && e.season_number === season + 1}
										>
											<div className="fr gap-3">
												<div className="fc size-7 rounded-lg bg-foreground-100 text-white/60">E{i + 1}</div>
												<span>{e.name}</span>
											</div>
										</PButton>
									))}
									{/* map thru fetchedsubs */}
								</ul>
							</div>
						)}
					</ScrollShadow>
				</div>
			</div>
		</motion.div>
	);
};
