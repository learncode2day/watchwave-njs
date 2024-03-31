'use client';
import { motion } from 'framer-motion';
import Separator from '../Separator';
import { ScrollShadow, Slider } from '@nextui-org/react';
import { usePlayerStore } from '@/app/store/player-state-provider';
import { useSubtitlesStore } from '@/app/store/subtitles-state-provider';
import { resetState } from '@/app/store/SubtitlesStore';
import Value from '../Controls/Value';

interface PanelProps {
	changeQuality: (quality: string) => void;
	setRate: (rate: number) => void;
}
export const SettingsPanel = ({ changeQuality, setRate }: PanelProps) => {
	const { availableQualities, quality, playbackRate, setPanelVisible } = usePlayerStore((state) => state);
	const { fontSize, setFontSize, setColor, color, setBackground, background, bottom, setBottom, setTimeOffset, timeOffset } = useSubtitlesStore(
		(state) => state
	);
	const state = useSubtitlesStore((state) => state);
	const qualities = ['4k', '1080', '720', '480', '360'];
	const playbackRates = [0.5, 1, 1.5, 2];
	// shades, yellow, red, blue
	const colors = ['#FFFFFF', '#CCCCCC', '#666666', '#000000', '#e4f752', '#f75252'];
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.1 }}
			className="absolute inset-0 z-20"
		>
			<div className="h-full w-full" onClick={() => setPanelVisible(false)} />
			<div className="absolute py-20 pt-10 fc justify-end h-full bottom-0 right-5 z-20 w-full max-w-[350px] pointer-events-none">
				<div className="fc w-full h-full justify-start gap-2 rounded-2xl bg-black/70 px-5 py-6 text-white/70 shadow-xl backdrop-blur-2xl overflow-hidden pointer-events-auto">
					<ScrollShadow hideScrollBar className="fc justify-start gap-5">
						<div className="fc w-full items-start">
							<div className="fr w-full items-end justify-between">
								<h2 className="text-sm font-bold uppercase text-white/50">Video Settings</h2>
							</div>
							<Separator />
							<ul className="fc my-2 w-full items-start gap-2">
								<li className="fc w-full items-start gap-2">
									<span>Quality</span>
									<div className="fr w-full rounded-lg bg-foreground-100 px-2 py-1">
										{qualities.map((q) => (
											<button
												onClick={() => changeQuality(q)}
												disabled={availableQualities.includes(q) ? false : true}
												className={`w-full rounded-lg px-2 py-1 transition-colors hover:bg-foreground-300 disabled:cursor-not-allowed disabled:text-white/40 disabled:hover:bg-transparent ${
													q === quality ? 'bg-foreground-300' : ''
												}`}
												key={q}
											>
												{q}
											</button>
										))}
									</div>
								</li>
								<li className="fc w-full items-start gap-2">
									<span>Playback Rate</span>
									<div className="fr w-full rounded-lg bg-foreground-100 px-2 py-1">
										{playbackRates.map((q) => (
											<button
												onClick={() => setRate(q)}
												className={`w-full rounded-lg px-2 py-1 transition-colors hover:bg-foreground-300 disabled:cursor-not-allowed disabled:hover:bg-transparent ${
													q === playbackRate ? 'bg-foreground-300' : ''
												}`}
												key={q}
											>
												{q}
											</button>
										))}
									</div>
								</li>
							</ul>
						</div>
						{/* Subtitles */}
						<div className="fc w-full items-start">
							<div className="fr w-full items-end justify-between">
								<h2 className="inline-flex w-full justify-between text-sm font-bold uppercase text-white/50">
									<span>Subtitle Settings</span>
									<button onClick={() => resetState(state)}>Reset</button>
								</h2>
							</div>
							<Separator />
							<ul className="fc my-2 w-full items-start gap-3">
								<li className="fc items-start gap-2">
									<span>Font Size</span>
									<Value
										decrement={() => setFontSize(fontSize - 1)}
										increment={() => setFontSize(fontSize + 1)}
										val={fontSize}
										set={setFontSize}
									/>
								</li>
								<li className="fc w-full items-start gap-2">
									<span>Font Color</span>
									<div className="fr w-full justify-between rounded-lg bg-foreground-100 px-3 py-3">
										{colors.map((q) => (
											<button
												style={{ background: q }}
												onClick={() => setColor(q)}
												className={`rounded-full p-4 ${color === q ? 'ring-3 ring-primary' : ''}`}
												key={q}
											></button>
										))}
									</div>
								</li>
								<li className="fc w-full items-start gap-2">
									<span>Background Opacity</span>
									<div className="fr w-full justify-between rounded-lg bg-foreground-100 px-3 py-3">
										<Slider
											aria-label="Background Opacity"
											minValue={0}
											step={0.01}
											maxValue={1}
											defaultValue={background}
											color="foreground"
											onChange={(e) => setBackground(e as number)}
											className="w-full"
										/>
									</div>
								</li>
								<li className="fc items-start gap-2">
									<span>Bottom Offset</span>
									<Value
										decrement={() => setBottom(bottom - 10)}
										increment={() => setBottom(bottom + 10)}
										val={bottom}
										step={10}
										set={setBottom}
									/>
								</li>
								<li className="fc items-start gap-2">
									<span>Time Offset</span>
									<Value
										decrement={() => setTimeOffset(timeOffset - 1)}
										increment={() => setTimeOffset(timeOffset + 1)}
										val={timeOffset}
										step={1}
										set={setTimeOffset}
									/>
								</li>
							</ul>
						</div>
					</ScrollShadow>
				</div>
			</div>
		</motion.div>
	);
};
