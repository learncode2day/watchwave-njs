'use client';
import React from 'react';

import { AuthContextProvider } from './context/AuthContext';
import { PlayerStoreProvider } from './store/player-state-provider';
import { SubtitlesStoreProvider } from './store/subtitles-state-provider';
import { MainStoreProvider } from './store/main-state-provider';
import { TVStoreProvider } from './store/tv-state-provider';
const AppContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuthContextProvider>
			<MainStoreProvider>
				<PlayerStoreProvider>
					<SubtitlesStoreProvider>
						<TVStoreProvider>{children}</TVStoreProvider>
					</SubtitlesStoreProvider>
				</PlayerStoreProvider>
			</MainStoreProvider>
		</AuthContextProvider>
	);
};

export default AppContainer;
