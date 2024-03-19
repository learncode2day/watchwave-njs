import { createStore } from "zustand/vanilla";
import { RunOutput } from "@movie-web/providers";

type L = {
  text: string;
  completed: boolean;
};

export type PlayerState = {
  sources: RunOutput | null;
  src: string | string[] | undefined;
  playing: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: boolean;
  duration: number;
  playbackRate: number;
  seeking: boolean;
  buffering: boolean;
  volumeVisible: boolean;
  timedetails: boolean;
  timeLeft: number | null;
  isControlsVisible: boolean;
  quality: string | number | null;
  availableQualities: (number | string)[];
  panelVisible: boolean;
  failed: boolean;
  fetching: boolean;
  isMobile: boolean;

  loaderO: L[];
};

export type PlayerActions = {
  setSources: (sources: RunOutput | null) => void;
  setSrc: (src: string | string[] | undefined) => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlayed: (played: number) => void;
  setLoaded: (loaded: boolean) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (playbackRate: number) => void;
  setSeeking: (seeking: boolean) => void;
  setBuffering: (buffering: boolean) => void;
  setVolumeVisible: (volumeVisible: boolean) => void;
  setTimedetails: (timedetails: boolean) => void;
  setTimeLeft: (timeLeft: number | null) => void;
  setIsControlsVisible: (isControlsVisible: boolean) => void;
  setQuality: (quality: string | number | null) => void;
  setAvailableQualities: (availableQualities: (number | string)[]) => void;
  setPanelVisible: (panelVisible: boolean) => void;
  setFailed: (failed: boolean) => void;
  setFetching: (fetching: boolean) => void;
  setMobile: (isMobile: boolean) => void;
  setLoaderO: (loaderO: L[]) => void;
};

export type PlayerStore = PlayerState & PlayerActions;

export const defaultInitState: PlayerState = {
  sources: null,
  src: "",
  playing: false,
  volume: 1,
  muted: false,
  played: 0,
  loaded: false,
  duration: 0,
  playbackRate: 1.0,
  seeking: false,
  buffering: false,
  volumeVisible: false,
  timedetails: false,
  timeLeft: null,
  isControlsVisible: true,
  quality: null,
  availableQualities: [],
  panelVisible: false,
  failed: false,
  fetching: false,
  isMobile: false,
  loaderO: [
    {
      text: "Getting Sources...",
      completed: false,
    },
    {
      text: "Parsing Sources...",
      completed: false,
    },
    {
      text: "Getting Subtitles...",
      completed: false,
    },
    {
      text: "Video Initializing...",
      completed: false,
    },
  ],
};

export const createPlayerStore = (
  initState: PlayerState = defaultInitState,
) => {
  return createStore<PlayerStore>()((set) => ({
    ...initState,
    setSrc: (src) => set({ src }),
    setPlaying: (playing) => set({ playing }),
    setVolume: (volume) => set({ volume }),
    setMuted: (muted) => set({ muted }),
    setPlayed: (played) => set({ played }),
    setLoaded: (loaded) => set({ loaded }),
    setDuration: (duration) => set({ duration }),
    setPlaybackRate: (playbackRate) => set({ playbackRate }),
    setSeeking: (seeking) => set({ seeking }),
    setBuffering: (buffering) => set({ buffering }),
    setVolumeVisible: (volumeVisible) => set({ volumeVisible }),
    setTimedetails: (timedetails) => set({ timedetails }),
    setTimeLeft: (timeLeft) => set({ timeLeft }),
    setIsControlsVisible: (isControlsVisible) => set({ isControlsVisible }),
    setQuality: (quality) => set({ quality }),
    setAvailableQualities: (availableQualities) => set({ availableQualities }),
    setPanelVisible: (panelVisible) => set({ panelVisible }),
    setFailed: (failed) => set({ failed }),
    setSources: (sources) => set({ sources }),
    setFetching: (fetching) => set({ fetching }),
    setMobile: (isMobile) => set({ isMobile }),
    setLoaderO: (loaderO) => set({ loaderO }),
  }));
};
