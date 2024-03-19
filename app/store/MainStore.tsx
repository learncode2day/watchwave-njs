import { MovieDetails, ShowDetails, recommendationProps } from "@/types";
import { createStore } from "zustand/vanilla";

// const [season, setSeason] = useState<number>(0);
// const [episode, setEpisode] = useState<number>(1);
// const [source, setSource] = useState<number>(0);
// const [isInFuture, setIsInFuture] = useState<boolean>(false);
// const [isinDMCA, setIsInDMCA] = useState<boolean>(false);
// const [playerVisible, setPlayerVisible] = useState(false);

export type MainState = {
  season: number;
  episode: number;
  source: number;
  isInFuture: boolean;
  isinDMCA: boolean;
  playerVisible: boolean;
  sections: {
    recommendations: { results: recommendationProps[] };
    credits: any;
    keywords: any;
    videos: any;
    reviews: any;
    external: any;
  } | null;
  result: MovieDetails | ShowDetails | null;
  adBlocker: boolean;
};

export type MainActions = {
  setSeason: (season: number) => void;
  setEpisode: (episode: number) => void;
  setSource: (source: number) => void;
  setIsInFuture: (isInFuture: boolean) => void;
  setIsInDMCA: (isinDMCA: boolean) => void;
  setPlayerVisible: (playerVisible: boolean) => void;
  setSections: (sections: MainState["sections"]) => void;
  setResult: (result: MainState["result"]) => void;
  setAdBlocker: (adBlocker: boolean) => void;
};

export type MainStore = MainState & MainActions;

export const defaultInitState: MainState = {
  season: 0,
  episode: 1,
  source: 0,
  isInFuture: false,
  isinDMCA: false,
  playerVisible: false,
  sections: null,
  result: null,
  adBlocker: false,
};

export const createMainStore = (initState: MainState = defaultInitState) => {
  return createStore<MainStore>()((set) => ({
    ...initState,
    setSeason: (season) => set({ season }),
    setEpisode: (episode) => set({ episode }),
    setSource: (source) => set({ source }),
    setIsInFuture: (isInFuture) => set({ isInFuture }),
    setIsInDMCA: (isinDMCA) => set({ isinDMCA }),
    setPlayerVisible: (playerVisible) => set({ playerVisible }),
    setSections: (sections) => set({ sections }),
    setResult: (result) => set({ result }),
    setAdBlocker: (adBlocker) => set({ adBlocker }),
  }));
};
