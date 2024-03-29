'use client';
/* eslint-disable no-unused-vars */
import { Slider } from '@nextui-org/react';
import { PiSubtitles } from 'react-icons/pi';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import {
	IoAlbums,
	IoAlbumsOutline,
	IoCog,
	IoExpand,
	IoPause,
	IoPlay,
	IoVolumeHigh,
	IoVolumeLow,
	IoVolumeMedium,
	IoVolumeMute,
} from 'react-icons/io5';
import { MdPictureInPicture } from 'react-icons/md';
import { TbRewindBackward15, TbRewindForward15 } from 'react-icons/tb';
import { usePlayerStore } from '@/app/store/player-state-provider';
import { useSubtitlesStore } from '@/app/store/subtitles-state-provider';
import { useTVStore } from '@/app/store/tv-state-provider';

export const Rewind = ({ seek15s }: { seek15s: (direction: 'forward' | 'backward') => void }) => {
	return (
		<div className="atom" onClick={() => seek15s('backward')}>
			<TbRewindBackward15 />
		</div>
	);
};
export const FastForward = ({ seek15s }: { seek15s: (direction: 'forward' | 'backward') => void }) => {
	return (
		<div className="atom" onClick={() => seek15s('forward')}>
			<TbRewindForward15 />
		</div>
	);
};
export function PlayPause({ playPause }: { playPause: () => void }) {
	const { playing } = usePlayerStore((state) => state);
	return (
		<div className="atom" onClick={playPause}>
			{playing ? <IoPause /> : <IoPlay />}
		</div>
	);
}
export const Volume = ({ changeVolume }: { changeVolume: (value: number | number[]) => void }) => {
	const { volume, setVolumeVisible, volumeVisible, muted, setMuted } = usePlayerStore((state) => state);

	const getVolumeIcon = () => {
		if (volume === 0) return <IoVolumeMute />;
		else if (volume > 0.7) return <IoVolumeHigh />;
		else if (volume < 0.3) return <IoVolumeLow />;
		else return <IoVolumeMedium />;
	};

	return (
		<div className="fr gap-1" onMouseEnter={() => setVolumeVisible(true)} onMouseLeave={() => setVolumeVisible(false)}>
			<div className="atom" onClick={() => setMuted(!muted)}>
				{getVolumeIcon()}
			</div>
			<AnimatePresence>
				{volumeVisible && (
					// width 100% with framer motion
					<motion.div
						initial={{ opacity: 0, width: 0 }}
						animate={{ opacity: 1, width: 'auto' }}
						exit={{ opacity: 0, width: 0 }}
						transition={{ duration: 0.1 }}
					>
						<Slider
							aria-label="Volume"
							size="lg"
							color="foreground"
							classNames={{
								track: 'h-1 data-[thumb-hidden=false]:border-x-0 rounded-full',
								thumb: 'w-4 h-4 after:bg-white after:w-4 after:h-4 before:w-4 before:h-4',
								filler: 'h-1 rounded-full after:rounded-full',
							}}
							className="w-[80px]"
							onChange={changeVolume}
							onClick={(e) => e.currentTarget.blur()}
							value={volume}
							maxValue={1}
							minValue={0}
							step={0.01}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
export const Fullscreen = () => {
	return (
		<div
			className="atom"
			onClick={() => {
				if (document.fullscreenElement) {
					document.exitFullscreen();
					// add playsinline attribute
					document.querySelector('.player')?.setAttribute('playsinline', 'true');
				}
				if (document.querySelector('.player')?.requestFullscreen) {
					document.querySelector('.player')?.removeAttribute('playsinline');
					document.querySelector('.player')?.requestFullscreen();
				} else {
					// remove playsinline attribute
					document.querySelector('.player')?.removeAttribute('playsinline');
				}
			}}
		>
			<IoExpand />
		</div>
	);
};
export const Settings = () => {
	const { panelVisible, setPanelVisible } = usePlayerStore((state) => state);

	return (
		<div className="atom" onClick={() => setPanelVisible(!panelVisible)}>
			<IoCog />
		</div>
	);
};
export const Time = () => {
	const { played, duration, timedetails, setTimedetails, timeLeft } = usePlayerStore((state) => state);
	return (
		<div className="fr gap-3">
			<div
				suppressHydrationWarning
				className="fr cursor-pointer rounded-full bg-white/0 px-3 py-1 transition-colors hover:bg-white/20"
				onClick={() => setTimedetails(!timedetails)}
			>
				{!timedetails ? (
					<div className="fr gap-2">
						<p suppressHydrationWarning>{new Date(played * 1000).toISOString().substring(11, 19)}</p>
						<p>/</p>
						<p suppressHydrationWarning>{new Date(duration * 1000).toISOString().substring(11, 19)}</p>
						{/* <p>/</p>
						<p>{played}</p> */}
					</div>
				) : (
					// display time left, and what it finishes at
					<div className="fr gap-2">
						<p suppressHydrationWarning>
							{new Date((duration - played) * 1000).toISOString().substring(11, 19).replace(/^00:/, '')} left
						</p>
						<p>•</p>
						{/* take time left, and add it to current time in real world */}
						<p suppressHydrationWarning>Finishes at {timeLeft && format(new Date(Date.now() + timeLeft * 1000), 'hh:mm a')}</p>
					</div>
				)}
			</div>
		</div>
	);
};
export const PIP = ({ startPIP }: { startPIP: () => void }) => {
	return (
		<div className="atom" onClick={startPIP}>
			<MdPictureInPicture />
		</div>
	);
};

export const Airplay = () => {
	// how to handle airplay
	// https://developer.apple.com/documentation/webkitjs/adding_airplay_to_a_webpage
	return <div className="atom" onClick={() => alert('Airplay not supported on this device')}></div>;
};

export const Subtitle = () => {
	const { setSubtitlesPanelVisible, subtitlePanelVisible } = useSubtitlesStore((state) => state);
	return (
		<div className="atom" onClick={() => setSubtitlesPanelVisible(!subtitlePanelVisible)}>
			<PiSubtitles />
		</div>
	);
};

export const Episodes = () => {
	const { episodePanelVisible, setEpisodePanelVisible } = useTVStore((state) => state);
	return (
		<div
			className="fr cursor-pointer gap-2 rounded-full bg-white/0 px-3 py-1 transition-colors hover:bg-white/20"
			onClick={() => setEpisodePanelVisible(!episodePanelVisible)}
		>
			<IoAlbumsOutline className="text-2xl" />
			<span>Episodes</span>
		</div>
	);
};
