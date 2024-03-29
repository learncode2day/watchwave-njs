import { usePlayerStore } from "@/app/store/player-state-provider";
import * as Slider from "@radix-ui/react-slider";
import React from "react";

interface Props {
  seekTo: (e: number) => void;
  setIsInteracting: (e: boolean) => void;
}

const Seek = ({ seekTo, setIsInteracting }: Props) => {
  const { played, duration, setSeeking } = usePlayerStore((state) => state);
  return (
    <div className="fc w-full">
      {/* <Slider
											size="lg"
											classNames={{
												base: 'group cursor-pointer',
												// for track, add a 'after' that represents the buffered part's width
												track: `h-2 data-[thumb-hidden=false]:border-x-0 rounded-full`,
												thumb: 'w-3 h-3 after:bg-white after:w-3 after:h-3 before:w-3 before:h-3',
												filler: 'h-2 rounded-l-full',
											}}
											onMouseDown={() => {
												setSeeking(true);
											}}
											onMouseUp={() => {
												setSeeking(false);
											}}
											value={played}
											onChange={(e) => {
												setIsInteracting(true);
												seekTo(e);
											}}
											onChangeEnd={() => {
												setIsInteracting(false);
											}}
											step={1}
											aria-label="seek bar"
											maxValue={duration}
											color="foreground"
										/> */}

      <div className="group w-full grow touch-none select-none transition-[margin] *:duration-300 hover:-mx-2 hover:cursor-grab active:cursor-grabbing">
        <Slider.Root
          value={[played]}
          onValueChange={(e) => {
            setIsInteracting(true);
            seekTo(e[0]);
          }}
          min={0}
          max={duration}
          step={1}
          onMouseDown={() => {
            setSeeking(true);
          }}
          onMouseUp={() => {
            setSeeking(false);
          }}
          className="relative flex h-2 items-center transition-[height] duration-300 group-hover:h-3"
        >
          <Slider.Track className="h-full grow overflow-hidden rounded-full bg-[#F0F0F0] dark:bg-white/20">
            <Slider.Range className="absolute h-full rounded-l-full bg-white transition group-hover:bg-white/90" />
          </Slider.Track>
          <Slider.Thumb
            className="block h-4 w-2 rounded-sm border-1 border-black/60 bg-white outline-none transition-[height] group-hover:h-[20px] group-hover:w-[10px]"
            aria-label="Volume"
          />
        </Slider.Root>
      </div>
    </div>
  );
};

export default Seek;
