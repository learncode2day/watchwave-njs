// src/providers/tV-store-provider.tsx
'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';

import { type TVStore, createTVStore } from './TVStore';

export const TVStoreContext = createContext<StoreApi<TVStore> | null>(null);

export interface TVStoreProviderProps {
	children: ReactNode;
}

export const TVStoreProvider = ({ children }: TVStoreProviderProps) => {
	const storeRef = useRef<StoreApi<TVStore>>();
	if (!storeRef.current) {
		storeRef.current = createTVStore();
	}

	return <TVStoreContext.Provider value={storeRef.current}>{children}</TVStoreContext.Provider>;
};

export const useTVStore = <T,>(selector: (store: TVStore) => T): T => {
	const tVStoreContext = useContext(TVStoreContext);

	if (!tVStoreContext) {
		throw new Error(`useTVStore must be use within TVStoreProvider`);
	}

	return useStore(tVStoreContext, selector);
};
