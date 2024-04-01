import { targets, makeStandardFetcher, makeProviders } from '@movie-web/providers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const body = await request.json();
	const { episode, season, id, name, release, type } = body;
	console.log('Fetched Sources\n\n', body);
	// get new episode
	// const proxyUrl = 'https://jocular-fairy-e633ed.netlify.app';
	const providers = makeProviders({
		fetcher: makeStandardFetcher(fetch),
		target: targets.BROWSER, // check out https://movie-web.github.io/providers/essentials/targets
	});
	let media;

	if (type === 'movie') {
		media = {
			title: name,
			releaseYear: parseInt(release.split('-')[0] || '0'),
			tmdbId: id.toString(),
		};
	} else if (type === 'tv') {
		media = {
			episode: {
				number: episode,
				tmdbId: id.toString(),
			},
			season: {
				number: season,
				tmdbId: id.toString(),
			},
			title: name,
			tmdbId: id.toString(),
			releaseYear: parseInt(release.split('-')[0] || '0'),
		};
	}

	const embed = [
		{ type: 'embed', id: 'vidplay', rank: 401, name: 'VidPlay' },
		{ type: 'embed', id: 'filemoon', rank: 400, name: 'Filemoon' },
		{ type: 'embed', id: 'vidcloud', rank: 201, name: 'VidCloud' },
		{ type: 'embed', id: 'upcloud', rank: 200, name: 'UpCloud' },
		{ type: 'embed', id: 'upstream', rank: 199, name: 'UpStream' },
		{ type: 'embed', id: 'mixdrop', rank: 198, name: 'MixDrop' },
		{ type: 'embed', id: 'vidsrcembed', rank: 197, name: 'VidSrc' },
		{ type: 'embed', id: 'febbox-mp4', rank: 190, name: 'Febbox (MP4)' },
		{ type: 'embed', id: 'dood', rank: 173, name: 'dood' },
		{ type: 'embed', id: 'wootly', rank: 172, name: 'wootly' },
		{ type: 'embed', id: 'mp4upload', rank: 170, name: 'mp4upload' },
		{ type: 'embed', id: 'streamsb', rank: 150, name: 'StreamSB' },
		{ type: 'embed', id: 'closeload', rank: 106, name: 'CloseLoad' },
		{ type: 'embed', id: 'ridoo', rank: 105, name: 'Ridoo' },
		{
			type: 'embed',
			id: 'smashystream-d',
			rank: 71,
			name: 'SmashyStream (D)',
		},
		{
			type: 'embed',
			id: 'smashystream-f',
			rank: 70,
			name: 'SmashyStream (F)',
		},
	];

	const sourceCollectionMovie = [
		`https://vidsrc.to/embed/movie/${id}`,
		`https://vidsrc.me/embed/movie?tmdb=${id}`,
		`https://embed.smashystream.com/playere.php?tmdb=${id}`,
		`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
		`https://anyembed.xyz/movie/${id}`,
	];

	const output = await providers.runEmbedScraper({
		id: 'vidsrcembed',
		url: 'https://vidsrc.to/embed/movie/438631',
	});

	if (output === null) return NextResponse.error();

	return NextResponse.json({ output });
}
