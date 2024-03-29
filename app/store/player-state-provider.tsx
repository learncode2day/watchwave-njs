// src/providers/player-store-provider.tsx
'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';

import { type PlayerStore, createPlayerStore } from './PlayerStore';

export const PlayerStoreContext = createContext<StoreApi<PlayerStore> | null>(null);

export interface PlayerStoreProviderProps {
	children: ReactNode;
}

export const PlayerStoreProvider = ({ children }: PlayerStoreProviderProps) => {
	const storeRef = useRef<StoreApi<PlayerStore>>();
	if (!storeRef.current) {
		storeRef.current = createPlayerStore();
	}

	return <PlayerStoreContext.Provider value={storeRef.current}>{children}</PlayerStoreContext.Provider>;
};

export const usePlayerStore = <T,>(selector: (store: PlayerStore) => T): T => {
	const playerStoreContext = useContext(PlayerStoreContext);

	if (!playerStoreContext) {
		throw new Error(`usePlayerStore must be use within PlayerStoreProvider`);
	}

	return useStore(playerStoreContext, selector);
};
