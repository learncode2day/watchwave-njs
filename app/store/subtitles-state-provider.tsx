// src/providers/subtitles-store-provider.tsx
'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';

import { type SubtitlesStore, createSubtitlesStore } from './SubtitlesStore';

export const SubtitlesStoreContext = createContext<StoreApi<SubtitlesStore> | null>(null);

export interface SubtitlesStoreProviderProps {
	children: ReactNode;
}

export const SubtitlesStoreProvider = ({ children }: SubtitlesStoreProviderProps) => {
	const storeRef = useRef<StoreApi<SubtitlesStore>>();
	if (!storeRef.current) {
		storeRef.current = createSubtitlesStore();
	}

	return <SubtitlesStoreContext.Provider value={storeRef.current}>{children}</SubtitlesStoreContext.Provider>;
};

export const useSubtitlesStore = <T,>(selector: (store: SubtitlesStore) => T): T => {
	const subtitlesStoreContext = useContext(SubtitlesStoreContext);

	if (!subtitlesStoreContext) {
		throw new Error(`useSubtitlesStore must be use within SubtitlesStoreProvider`);
	}

	return useStore(subtitlesStoreContext, selector);
};
