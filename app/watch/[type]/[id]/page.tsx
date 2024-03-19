import { buildProviders, makeSimpleProxyFetcher, makeStandardFetcher, targets } from '@movie-web/providers';
import options from '@/app/lib/options';
import { Metadata } from 'next';
import Main from './Main copy';
import { cookies } from 'next/headers';
import { MovieDetails, SeasonDetails, ShowDetails, castProps, recommendationProps } from '@/types';

type Props = {
	params: { type: string; id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// read route params
	const id = params.id;
	const type = params.type;
	cookies();

	// fetch data
	const content = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options).then((res) => res.json());

	// fetch keywords
	const keywords = await fetch(`https://api.themoviedb.org/3/${type}/${id}/keywords?language=en-US`, options).then((res) => res.json());
	let keywordsArray = [];
	if (keywords.results) {
		for (let i = 0; i < keywords.results.length; i++) {
			keywordsArray.push(keywords.results[i].name);
		}
	} else if (keywords.keywords) {
		for (let i = 0; i < keywords.keywords.length; i++) {
			keywordsArray.push(keywords.keywords[i].name);
		}
	}
	// get image url from
	const image = content.poster_path || content.poster_path;

	return {
		title: `${content.title || content.name} | WatchWave`,
		keywords:
			'watch movies, movies online, watch TV, TV online, TV shows online, watch TV shows, stream movies, stream tv, instant streaming, watch online, movies, watch movies United States, watch TV online, no download, full length movies watch online, movies online, movies, watch movies online, watch movies, watch movies online free, watch movies for free, watch streaming media, watch tv online, watch movies online, watch movies online free, watch movies for free, watch streaming media, watch tv online, ' +
			keywordsArray.join(', '),
		description: `${content.overview}`,
		openGraph: {
			type: 'website',
			url: `https://watchwave.github.io/watch/${type}/${id}`,
			title: `Watch ${content.title || content.name} for free on WatchWave`,
			images: [image && { url: `/api/og?img=${image}&title=${content.title || content.name}` }],
		},
	};
}

export default async function Page({ params }: Props) {
	const { id, type } = params;

	const movieWeb = async () => {
		const proxyUrl = 'https://jocular-fairy-e633ed.netlify.app';
		const providers = buildProviders()
			.setTarget(targets.BROWSER) // target of where the streams will be used
			.setFetcher(makeStandardFetcher(fetch)) // fetcher, every web request gets called through here
			.setProxiedFetcher(makeSimpleProxyFetcher(proxyUrl, fetch)) // proxied fetcher, every web request gets called through here
			.addBuiltinProviders() // add all builtin providers, if this is not called, no providers will be added to the controls
			.build();
		// console.log(sourceScrapers);
		// fetch some data from TMDB
		const content: MovieDetails | ShowDetails = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options).then((res) =>
			res.json()
		);

		if (type === 'tv' && 'name' in content) {
			const media = {
				episode: {
					number: 1,
					tmdbId: id.toString(),
				},
				season: {
					number: 1,
					tmdbId: id.toString(),
				},
				title: content.name,
				releaseYear: parseInt(content.first_air_date?.split('-')[0] || '0'),
				tmdbId: content.id.toString(),
			};
			const output = await providers.runAll({
				sourceOrder: ['flixhq'],
				embedOrder: ['vidsrc'],
				media: {
					...media,
					type: 'show',
				},
			});

			// console.log(media);
			// console.log(output);
			return output;
		} else if (type === 'movie' && 'title' in content) {
			const media = {
				title: content.title,
				releaseYear: parseInt(content.release_date?.split('-')[0] || '0'),
				tmdbId: content.id.toString(),
			};
			const output = await providers.runAll({
				sourceOrder: ['flixhq'],
				embedOrder: ['vidsrc'],
				media: {
					...media,
					type: 'movie',
				},
			});
			// console.log(embedScrapers);
			// console.log(media);
			// console.log(output);
			return output;
		}
	};

	const fetchMovie = async () => {
		try {
			const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options);
			const data = await res.json();

			const res2 = await fetch(`https://api.themoviedb.org/3/${type}/${id}/release_dates?language=en-US`, options);
			const data2 = await res2.json();

			const countries = ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'IN', 'ZA'];
			let content_rating = '';
			for (let i = 0; i < data2.results.length; i++) {
				if (countries.includes(data2.results[i].iso_3166_1)) {
					content_rating = data2.results[i].release_dates[0].certification;
					break;
				}
			}
			data.content_rating = content_rating;
			data.media_type = 'movie';

			return data;
		} catch (error) {
			// console.error('Error fetching movie data:', error);
			return null;
		}
	};

	const fetchTV = async () => {
		try {
			const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options);
			const data = await res.json();

			const res2 = await fetch(`https://api.themoviedb.org/3/tv/${id}/content_ratings?language=en-US`, options);
			const data2 = await res2.json();

			let content_rating = '';
			for (let i = 0; i < data2.results.length; i++) {
				if (data2.results[i].iso_3166_1 === 'US') {
					content_rating = data2.results[i].rating;
					break;
				}
			}
			data.content_rating = content_rating;
			data.media_type = 'tv';

			const fetchSeasonData = async (season: SeasonDetails) => {
				const seasonData = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}`, options);
				return await seasonData.json();
			};

			const tempContent = await Promise.all(data.seasons.map(fetchSeasonData));
			data.seasons = tempContent;

			return data;
		} catch (error) {
			// console.error('Error fetching TV data:', error);
			return null;
		}
	};

	const fetchData = async () => {
		if (type === 'movie') {
			return await fetchMovie();
		} else if (type === 'tv') {
			return await fetchTV();
		}
	};

	async function fetchSections() {
		// fetch recommendations, credits, keywords, videos, reviews
		const reccomendations = await fetch(`https://api.themoviedb.org/3/${type}/${id}/recommendations?language=en-US&page=1`, options);
		let recc: {
			results: recommendationProps[];
		} = await reccomendations.json();
		// console.log(recc);

		const credits = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?language=en-US`, options);
		let cred = await credits.json();
		// for each cast inside cred.cast,
		//  fetch(
		//   `https://api.themoviedb.org/3/person/${cast.id}/external_ids`,
		//   options,
		// )
		// and then add it to the cast object as imdb_id in cred

		cred = cred.cast.filter((cast: castProps) => cast.known_for_department === 'Acting');

		await cred.forEach(async (cast: castProps) => {
			if (!cast.id) return;
			// filter by actor

			const external = await fetch(`https://api.themoviedb.org/3/person/${cast.id}/external_ids`, options);
			let ext = await external.json();
			cast.imdb_id = ext.imdb_id;
		});

		const videos = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`, options);
		let vid = await videos.json();
		const reviews = await fetch(`https://api.themoviedb.org/3/${type}/${id}/reviews?language=en-US&page=1`, options);
		let rev = await reviews.json();

		const external = await fetch(`https://api.themoviedb.org/3/${type}/${id}/external_ids?language=en-US`, options);
		let ext = await external.json();
		const keywords = await fetch(`https://api.themoviedb.org/3/${type}/${id}/keywords?language=en-US`, options);
		let keyw = await keywords.json();

		return {
			recommendations: recc,
			credits: cred,
			keywords: keyw,
			videos: vid,
			reviews: rev,
			external: ext,
		};
	}

	const sources = await movieWeb();
	const result = await fetchData();
	const sections = await fetchSections();

	return <Main sources={sources} params={params} result={result} sections={sections} />;
}
