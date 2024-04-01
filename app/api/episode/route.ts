import { buildProviders, targets, makeStandardFetcher, makeSimpleProxyFetcher, makeProviders } from '@movie-web/providers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const body = await request.json();
	const { episode, season, id, name, release, type } = body;
	console.log('\n\n\n CALLED \n\n\n');

	console.log('Fetched Sources\n\n', body);
	// get new episode
	const proxyUrl = 'https://jocular-fairy-e633ed.netlify.app';
	const providers = makeProviders({
		fetcher: makeStandardFetcher(fetch),
		target: targets.BROWSER, // check out https://movie-web.github.io/providers/essentials/targets
	});
	// console.log(sourceScrapers);
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

	const output = await providers.runAll({
		media: {
			...media,
			type: type === 'movie' ? 'movie' : 'show',
		},
	});

	if (output === null) return NextResponse.error();

	console.log('Output\n\n', output);

	return NextResponse.json({ output });
}
