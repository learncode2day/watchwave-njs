import { createStore } from "zustand/vanilla";

// const [season, setSeason] = useState<number>(0);
// const [episode, setEpisode] = useState<number>(1);
// const [source, setSource] = useState<number>(0);
// const [isInFuture, setIsInFuture] = useState<boolean>(false);
// const [isinDMCA, setIsInDMCA] = useState<boolean>(false);
// const [playerVisible, setPlayerVisible] = useState(false);

export type TVState = {
  season: number;
  episode: number;
  episodePanelVisible: boolean;
  isDeep: boolean;
  displaySeason: number;
  nextEpisodeVisible: boolean;
};

export type TVActions = {
  setSeason: (season: number) => void;
  setEpisode: (episode: number) => void;
  setEpisodePanelVisible: (visible: boolean) => void;
  setIsDeep: (isDeep: boolean) => void;
  setDisplaySeason: (season: number) => void;
  setNextEpisodeVisible: (visible: boolean) => void;
};

export type TVStore = TVState & TVActions;

export const defaultInitState: TVState = {
  season: 0,
  episode: 0,
  episodePanelVisible: false,
  isDeep: false,
  displaySeason: 0,
  nextEpisodeVisible: false,
};

export const createTVStore = (initState: TVState = defaultInitState) => {
  return createStore<TVStore>()((set) => ({
    ...initState,
    setSeason: (season) => set({ season }),
    setEpisode: (episode) => set({ episode }),
    setEpisodePanelVisible: (episodePanelVisible) =>
      set({ episodePanelVisible }),
    setIsDeep: (isDeep) => set({ isDeep }),
    setDisplaySeason: (displaySeason) => set({ displaySeason }),
    setNextEpisodeVisible: (nextEpisodeVisible) => set({ nextEpisodeVisible }),
  }));
};
