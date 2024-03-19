import { createStore } from "zustand/vanilla";

export interface Captions {
  start: number;
  end: number;
  text: string;
}

export type SubtitlesState = {
  background: number;
  color: string;
  fontSize: number;
  timeOffset: number;
  bottom: number;
  off: boolean;
  subtitle: Captions[];
  subtitlePanelVisible: boolean;
  subtitleSources: Subtitles[];
  fetchedSubs: [];
  isDeep: boolean;
  currentLang: string | null;
  loading: boolean;
};

export interface Subtitles {
  id: string;
  language: string;
  hasCorsRestrictions: boolean;
  type: string;
  url: string;
}
export type SubtitlesActions = {
  setBackground: (background: number) => void;
  setColor: (color: string) => void;
  setFontSize: (fontSize: number) => void;
  setTimeOffset: (timeOffset: number) => void;
  setBottom: (bottom: number) => void;
  setOff: (off: boolean) => void;
  setSubtitle: (subtitle: Captions[]) => void;
  setSubtitlesPanelVisible: (subtitlePanelVisible: boolean) => void;
  setSubtitleSources: (subtitleSources: Subtitles[]) => void;
  setFetchedSubs: (fetchedSubs: []) => void;
  setIsDeep: (isDeep: boolean) => void;
  setCurrentLang: (currentLang: string | null) => void;
  setLoading: (loading: boolean) => void;
};

export type SubtitlesStore = SubtitlesState & SubtitlesActions;

export const defaultInitState: SubtitlesState = {
  background: 0.5,
  color: "#FFFFFF",
  fontSize: 26,
  timeOffset: 0,
  bottom: 0,
  off: false,
  subtitle: [
    {
      start: 0,
      end: 0,
      text: "",
    },
  ],
  subtitlePanelVisible: false,
  subtitleSources: [],
  fetchedSubs: [],
  currentLang: null,
  loading: false,
  isDeep: false,
};

export const resetState = (state: SubtitlesState) => {
  state.background = 0.5;
  state.color = "#FFFFFF";
  state.fontSize = 20;
  state.timeOffset = 0;
  state.bottom = 0;
};

export const createSubtitlesStore = (
  initState: SubtitlesState = defaultInitState,
) => {
  return createStore<SubtitlesStore>()((set) => ({
    ...initState,
    setBackground: (background) => set({ background }),
    setColor: (color) => set({ color }),
    setFontSize: (fontSize) => set({ fontSize }),
    setTimeOffset: (timeOffset) => set({ timeOffset }),
    setBottom: (bottom) => set({ bottom }),
    setOff: (off) => set({ off }),
    setSubtitle: (subtitle) => set({ subtitle }),
    setSubtitlesPanelVisible: (subtitlePanelVisible) =>
      set({ subtitlePanelVisible }),
    setSubtitleSources: (subtitleSources) => set({ subtitleSources }),
    setFetchedSubs: (fetchedSubs) => set({ fetchedSubs }),
    setIsDeep: (isDeep) => set({ isDeep }),
    setCurrentLang: (currentLang) => set({ currentLang }),
    setLoading: (loading) => set({ loading }),
  }));
};
