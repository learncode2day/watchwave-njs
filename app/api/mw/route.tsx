import { makeProviders, makeSimpleProxyFetcher, makeStandardFetcher, targets } from '@movie-web/providers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const type = searchParams.get('type');
	const tmdbId = searchParams.get('id');
	const title = searchParams.get('title');
	const releaseYear = searchParams.get('release');

	const episode = searchParams.get('episode');
	const season = searchParams.get('season');

	const proxyUrl = 'https://jocular-fairy-e633ed.netlify.app';
	const providers = makeProviders({
		fetcher: makeStandardFetcher(fetch),
		proxiedFetcher: makeSimpleProxyFetcher(proxyUrl, fetch),
		target: targets.ANY,
	});
	if (type === 'show') {
		const media = {
			episode: {
				number: parseInt(episode || '1'),
				tmdbId: tmdbId,
			},
			season: {
				number: parseInt(season || '1'),
				tmdbId: tmdbId,
			},
			title,
			releaseYear: parseInt(releaseYear || '0'),
			tmdbId,
		};
		const output = await providers.runAll({
			media: {
				...media,
				type: 'show',
			},
			sourceOrder: ['flixhq'],
		});
		return NextResponse.json(output);
	} else if (type === 'movie') {
		const media = {
			title,
			releaseYear: parseInt(releaseYear || '0'),
			tmdbId,
		};
		const output = await providers.runAll({
			sourceOrder: ['flixhq'],
			media: {
				...media,
				type: 'movie',
			},
		});
		return NextResponse.json(output);
	}
}
