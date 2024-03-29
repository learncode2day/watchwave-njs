import { usePlayerStore } from '@/app/store/player-state-provider';
import { useSubtitlesStore } from '@/app/store/subtitles-state-provider';
import React, { useEffect } from 'react';

interface Props {
	seekTo: (time: number) => void;
	playPause: () => void;
	changeVolume: (volume: number) => void;
	startPIP: () => void;
	player: React.RefObject<HTMLVideoElement>;
}

const KeyboardControls = ({ seekTo, playPause, changeVolume, startPIP, player }: Props) => {
	const { setPlayed, played, setMuted, muted, duration, volume, setVolume } = usePlayerStore((state) => state);
	const { fontSize, setFontSize, timeOffset, setTimeOffset, setBottom, bottom } = useSubtitlesStore((state) => state);

	/**
	 * Adds a keydown event listener that shows the video
	 * controls overlay and handles media playback keyboard
	 * shortcuts when the user presses keys.
	 */
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.shiftKey || e.metaKey || e.altKey || e.ctrlKey) return;
			switch (e.key) {
				case ' ':
					// Toggle play/pause when space is pressed
					playPause();
					break;
				case 'ArrowRight':
					// Seek 15 seconds forward when right arrow is pressed
					// Seek 30 seconds forward when shift + right arrow is pressed
					const forwardTime = e.shiftKey ? played + 30 : played + 15;
					setPlayed(forwardTime);
					if (player.current) player.current.currentTime = forwardTime;
					break;
				case 'ArrowLeft':
					// Seek 15 seconds backward when left arrow is pressed
					// Seek 30 seconds backward when shift + left arrow is pressed
					const backwardTime = e.shiftKey ? played - 30 : played - 15;
					setPlayed(backwardTime);
					if (player.current) player.current.currentTime = backwardTime;
					break;
				case 'ArrowUp':
					// Increase volume when up arrow is pressed
					changeVolume(Math.min(volume + 0.1, 1));

					break;
				case 'ArrowDown':
					changeVolume(Math.max(volume - 0.1, 0));

					break;
				case 'm':
					// Toggle mute when "m" is pressed
					setMuted(!muted);
					break;
				case 'f':
					// Toggle fullscreen when "f" is pressed
					if (document.fullscreenElement) {
						document.exitFullscreen();
					} else {
						document.querySelector('.player')?.requestFullscreen();
					}
					break;
				case 'p':
					// Toggle PiP when "p" is pressed
					startPIP();
					break;
				case '=':
					// Increase caption font size when "=" is pressed
					setFontSize(fontSize + 1);
					break;
				case '-':
					// Decrease caption font size when "-" is pressed
					setFontSize(fontSize - 1);
					break;
				case 't':
					// Increase caption bottom offset when "t" is pressed
					setBottom(bottom + 5);
					break;

				case 'r':
					// decrease caption bottom offset when "t" is pressed
					setBottom(bottom - 5);
					break;

				case 'z':
					// decrease time offset

					setTimeOffset(timeOffset - 1);
				case 'x':
					// increase time offset
					setTimeOffset(timeOffset + 1);

				// numbers with set to percentages ex. 1 will set to 10% 2 will set to 20% etc
				case '1':
					seekTo((duration / 100) * 10);
					break;
				case '2':
					seekTo((duration / 100) * 20);
					break;
				case '3':
					seekTo((duration / 100) * 30);
					break;
				case '4':
					seekTo((duration / 100) * 40);
					break;
				case '5':
					seekTo((duration / 100) * 50);
					break;
				case '6':
					seekTo((duration / 100) * 60);
					break;
				case '7':
					seekTo((duration / 100) * 70);
					break;
				case '8':
					seekTo((duration / 100) * 80);
					break;
				case '9':
					seekTo((duration / 100) * 90);
					break;
				case '0':
					seekTo(duration);
					break;
				default:
					break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [played]);
	return <></>;
};

export default KeyboardControls;
