'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { cloneElement, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { MovieDetails, ShowDetails } from '../types';

import { IoStar, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';

import { UserAuth } from './context/AuthContext';
import getDocData from './lib/firebase/getDocData';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase/firebase';
import { format } from 'date-fns';

import WatchlistButton from './components/WatchlistButton';
import PlayButton from './components/PlayButton';
import { getImagePath } from './lib/tmdb';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

interface Props {
	result: MovieDetails | ShowDetails;
	vid: Video;
}

interface Video {
	video: {
		url: '';
	};
	audio: {
		url: '';
	};
}
const Showcase = ({ result, vid }: Props) => {
	const imageURL = getImagePath(result.backdrop_path, 'original');

	const { user } = UserAuth();
	const [isInWatchlist, setIsInWatchlist] = useState(false);
	const [data, setData] = useState<any>(null);
	const [video, setVideo] = useState<boolean>(false);
	const [audio, setAudio] = useState<boolean>(false);
	const [muted, setMuted] = useState(true);

	useEffect(() => {
		if (vid.video.url && vid.audio.url) setVideo(true);
	}, []);

	const generateDetails = () => {
		// const details = {
		// 	vote_average: (
		// 		<li className="fr gap-1 whitespace-nowrap">
		// 			<IoStar />
		// 			<span>{result.vote_average.toFixed(1)}</span>
		// 		</li>
		// 	),
		// 	release_date: new Date(result.release_date).getFullYear(),
		// 	content_rating: result.content_rating && (
		// 		<li className="whitespace-nowrap rounded-lg border-1 border-[#a1a1a1] px-1.5">{result.content_rating}</li>
		// 	),
		// 	runtime: result.runtime && format(new Date(0, 0, 0, 0, result.runtime), "h 'hr' m 'min'").toString(),
		// 	first_air_date: new Date(result.first_air_date).getFullYear(),
		// 	number_of_episodes: result.number_of_episodes && `${result.number_of_episodes} episodes`,
		// };

		// new details structure: array of objects
		const detailsMovie = [
			{
				key: 'vote_average',
				value: (
					<li className="fr gap-1 whitespace-nowrap">
						<IoStar />
						<span>{result.vote_average.toFixed(1)}</span>
					</li>
				),
			},
			{
				key: 'release_date',
				value: <li>{new Date(result.release_date).getFullYear()}</li>,
			},
			{
				key: 'content_rating',
				value: result.content_rating && (
					<li className="whitespace-nowrap rounded-lg border-1 border-[#a1a1a1] px-1.5">{result.content_rating}</li>
				),
			},
			{
				key: 'runtime',
				value: result.runtime && <li>{format(new Date(0, 0, 0, 0, result.runtime), "h 'hr' m 'min'").toString()}</li>,
			},
		];

		const detailsShow = [
			{
				key: 'vote_average',
				value: (
					<li className="fr gap-1 whitespace-nowrap">
						<IoStar />
						<span>{result.vote_average.toFixed(1)}</span>
					</li>
				),
			},
			{
				key: 'first_air_date',
				value: <li>{new Date(result.first_air_date).getFullYear()}</li>,
			},
			{
				key: 'content_rating',
				value: result.content_rating && (
					<li className="whitespace-nowrap rounded-lg border-1 border-[#a1a1a1] px-1.5">{result.content_rating}</li>
				),
			},
			{
				key: 'number_of_episodes',
				value: result.number_of_episodes && <li>{`${result.number_of_episodes} episodes`}</li>,
			},
		];

		const details = result.media_type === 'movie' ? detailsMovie : detailsShow;
		// details = [vote_average, release_date, content_rating, runtime] or [vote_average, first_air_date, content_rating, number_of_episodes

		// remove undefined or NaN or null values
		const newDetails = details.filter((detail) => detail.value);

		// create an <li> for each value
		// in between, add a bullet point wrapped in a <li>
		let detailsArray = Object.values(newDetails).map((detail, i) => {
			// if the value is already an <li>, return it
			const clone = cloneElement(detail.value, {
				key: `detail-${result.id}-${i}`,
			});
			return clone;
		});

		// add a bullet point between each <li>
		detailsArray = detailsArray.reduce((acc, curr) => {
			acc.push(<li key={`bullet-${result.id}-${acc.length}`}>&bull;</li>);
			acc.push(curr);
			return acc;
		}, []);

		// if the first element is a bullet, remove it
		if (detailsArray[0].key?.includes('bullet')) detailsArray.shift();

		console.log(detailsArray);
		return detailsArray;
	};

	const logUser = () => {
		if (!user) return;
		const docRef = doc(db, 'users', user.uid);
		getDoc(docRef)
			.then(async (docSnap) => {
				if (!docSnap.exists()) {
					console.log('doc does not exist');
					return;
				}
				await setDoc(
					docRef,
					{
						userInfo: {
							name: user.displayName,
							email: user.email,
							photoURL: user.photoURL,
							phoneNumber: user.phoneNumber,
							uid: user.uid,
							emailVerified: user.emailVerified,
						},
					},
					{ merge: true }
				);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		if (!user) return;
		logUser();
	}, [user]);

	// run getDocData only once
	useEffect(() => {
		if (!user) return;
		getDocData(user)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.log(err));
	}, [user]);

	useEffect(() => {
		if (!user) setData(null);
	}, [user]);

	useEffect(() => {
		if (!data) return;
		if (data.movie) {
			if (data.movie.includes(result.id)) {
				setIsInWatchlist(true);
			} else {
				setIsInWatchlist(false);
			}
		}
	}, [data, user]);

	console.log(vid);
	const vidref = useRef<HTMLVideoElement>(null);
	const audioref = useRef<HTMLAudioElement>(null);
	useEffect(() => {
		vidref.current?.play();
		audioref.current?.play();
		// bind audio to video

		audioref.current?.addEventListener('play', () => {
			vidref.current?.play();
		});

		audioref.current?.addEventListener('pause', () => {
			vidref.current?.pause();
		});

		return () => {
			audioref.current?.removeEventListener('play', () => {
				vidref.current?.play();
			});

			audioref.current?.removeEventListener('pause', () => {
				vidref.current?.pause();
			});
		};
	}, []);

	return (
		<>
			{/* <iframe className="w-screen h-screen" src="https://d.daddylivehd.sx/embed/stream-1.php">
				Your Browser Do not Support Iframe
			</iframe> */}
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="h-full w-full leading-none">
				<AnimatePresence>
					{!video ||
						(!audio && (
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
								<Image src={imageURL} priority alt="movie poster" width={1920} height={1080} className="absolute w-full" />
							</motion.div>
						))}
					<motion.video
						playsInline
						ref={vidref}
						// if video is loaded, show it
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onLoadedData={() => setVideo(true)}
						src={vid.video.url}
						className="absolute h-full w-full object-cover object-center"
						autoPlay
						onPlay={() => {
							audioref.current?.play();
						}}
						onPause={() => {
							audioref.current?.pause();
						}}
						loop
					>
						<audio onLoadedData={() => setAudio(true)} ref={audioref} src={vid.audio.url} className="hidden" muted={muted} />
					</motion.video>
				</AnimatePresence>
				<motion.div
					initial={{
						background: 'radial-gradient(ellipse 100% 80% at 80% -50%, rgba(0, 0, 0) 0%, rgb(0, 0, 0) 100%)',
					}}
					animate={{
						background: 'radial-gradient(ellipse 100% 80% at 80% 20%, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%)',
					}}
					transition={{ duration: 1 }}
					className={`mask absolute h-full w-full`}
				/>
			</motion.div>
			<div className={`fc z-10 w-full items-start justify-start pt-60 sm:pl-24 ${video && audio ? '!pt-[32rem]' : ''}`}>
				<div className="fc w-full items-start justify-start px-5 pr-10">
					{result.logo ? (
						<div className="w-full max-w-[calc(50%)] px-3">
							<Image src={result.logo} alt="movie logo" width={300} height={200} className="mb-5 max-h-[250px] w-full max-w-[250px]" />
						</div>
					) : (
						<h1 className="mb-3 pr-10 text-5xl font-bold text-white md:mb-5 md:text-8xl">
							{'title' in result ? result.title : 'name' in result ? result.name : 'No title available'}
						</h1>
					)}

					{/* details */}
					<ul className="showcase_detail fr gap-3 font-medium text-white/80 sm:text-sm md:mt-1">{generateDetails()}</ul>
					<p className="mt-4 max-w-[50ch] text-base font-medium leading-normal text-white/80">{result.overview}</p>
					<div className="fr mt-4 gap-3 light">
						<Link href={`/watch/${result.media_type}/${result.id}`}>
							<PlayButton />
						</Link>
						<WatchlistButton isInWatchlist={isInWatchlist} content={result} setData={setData} />
						{/* mute/unmute */}
						<Button
							variant="ghost"
							className="text-white hover:text-black sm:text-base"
							radius="full"
							isIconOnly
							onClick={() => setMuted(!muted)}
						>
							{muted ? <IoVolumeMute /> : <IoVolumeHigh />}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Showcase;
