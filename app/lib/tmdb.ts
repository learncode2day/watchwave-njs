import fetchDetails from './fetchDetails';

export const fetchContentDataFromCW = async (cwArr: any) => {
	const promises = cwArr.map(async (item) => {
		const res = await fetchDetails(item.id, item.type);
		return res;
	});
	// await all promises
	const results = await Promise.all(promises);
	console.log('results', results);

	return results.map((item, i) => {
		return item;
	});
};

// function to get image path from tmdb
export const getImagePath = (path: string, size: 'original' | 'w500' | 'w400' | 'w300' | 'w200' | 'w185' | 'w154' | 'w92' | 'w64') => {
	return `https://image.tmdb.org/t/p/${size}${path}`;
};
