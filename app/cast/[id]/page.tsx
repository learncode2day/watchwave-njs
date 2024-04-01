import options from '@/app/lib/options';
import React from 'react';
import Actor from './Actor';

const fetchActor = async (id: number) => {
	// fetch from tmdb
	try {
		const res = await fetch(`https://api.themoviedb.org/3/person/${id}?language=en-US`, options);
		const data = await res.json();
		return data;
	} catch (err) {
		console.log(err);
		return null;
	}
};

type Props = {
	params: { id: number };
};

const Page = async ({ params }: Props) => {
	const { id } = params;
	const actor = await fetchActor(id);

	return <Actor actor={actor} />;
};

export default Page;
