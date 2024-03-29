'use client';
import Slider from '@/app/components/Slider';
import { useEffect, useState } from 'react';
import { UserAuth } from './context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { fetchContentDataFromCW } from './lib/tmdb';
import { db } from './lib/firebase/firebase';

const ContinueWatching = () => {
	const [cW, setCw] = useState(null);
	const { user } = UserAuth();

	const getcontinueWatching = async () => {
		let continueWatching = [];

		if (user) {
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				// access continueWatching array
				const continueWatchingData = docSnap.data().continueWatching;
				if (!continueWatchingData) return;
				// map through the array and fetch the details of each item
				continueWatching = await fetchContentDataFromCW(continueWatchingData);
			}
		}

		if (continueWatching.length > 0) {
			const continueWatchingCollection = {
				heading: 'Continue Watching',
				collection: continueWatching,
			};

			setCw(continueWatchingCollection);
		}
	};

	useEffect(() => {
		if (!user) return;
		getcontinueWatching();
		// fetch cw
	}, [user]);

	return cW && cW.collection.length > 0 && <Slider headline={cW.heading} section={cW} more={false} removeFromCW={true} />;
};

export default ContinueWatching;
