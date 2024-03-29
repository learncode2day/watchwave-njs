import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const subs = {
		id: '6109582',
		type: 'subtitle',
		attributes: {
			subtitle_id: '6109582',
			language: 'en',
			download_count: 1029666,
			new_download_count: 22007,
			hearing_impaired: false,
			hd: true,
			fps: 25,
			votes: 2,
			ratings: 10,
			from_trusted: true,
			foreign_parts_only: false,
			upload_date: '2021-10-22T01:50:33Z',
			ai_translated: false,
			nb_cd: 1,
			machine_translated: false,
			release: 'Dune.2021.1080p.HDRip.X264.AC3-EVO',
			comments:
				"HI Removed | Full retail subtitles (ENGLiSH + FOREiGN parts), not a mix of a transcript with mistakes, missing lines and errors and a translation from another language | Works with all HDRip versions that run for 02:28:56 | Not to be used by RARBG & TurkceAltyazi thieves =) -- Please don't reupload on OpenSubtitles and give credit where it's due. Thanks!",
			legacy_subtitle_id: 8849760,
			legacy_uploader_id: 5634869,
			uploader: {
				uploader_id: 117966,
				name: 'explosiveskull',
				rank: 'Subtitle Translator',
			},
			feature_details: {
				feature_id: 1275717,
				feature_type: 'Movie',
				year: 2021,
				title: 'Dune',
				movie_name: '2021 - Dune',
				imdb_id: 1160419,
				tmdb_id: 438631,
			},
			url: 'https://www.opensubtitles.com/en/subtitles/legacy/8849760',
			related_links: [
				{
					label: 'All subtitles for dune',
					url: 'https://www.opensubtitles.com/en/movies/2020-dune',
					img_url: 'https://s9.opensubtitles.com/features/7/1/7/1275717.jpg',
				},
			],
			files: [
				{
					file_id: 7054999,
					cd_number: 1,
					file_name: 'Dune.2021.720p.WEBRip.x264.AAC-[YTS.MX]',
				},
			],
		},
	};

	const { searchParams } = new URL(request.url);
	const tmdb_id = searchParams.get('tmdb_id');
	const type = searchParams.get('type');
	const languages = searchParams.get('languages');
	const mode = searchParams.get('mode');
	const id = searchParams.get('id');

	if (mode === 'sub') {
		// const { id, type, lang } = request.body;
		const response = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?tmdb_id=${tmdb_id}&type=${type}&languages=${languages}`, {
			method: 'GET',
			headers: {
				'User-Agent': 'WatchWave v1.0',
				'Api-Key': process.env.NEXT_PUBLIC_OS_API,
			},
		});
		const data = await response.json();
		if (typeof data === 'string') return NextResponse.error();
		const subtitles = data.data.map((sub: typeof subs) => {
			return {
				id: sub.id,
				language: sub.attributes.language,
				name: sub.attributes.release,
				files: sub.attributes.files.map((file) => {
					return {
						file_id: file.file_id,
						file_name: file.file_name,
					};
				}),
			};
		});
		return NextResponse.json(subtitles);
	} else if (mode === 'file') {
		const url = 'https://api.opensubtitles.com/api/v1/download';
		const options = {
			method: 'POST',
			headers: {
				'User-Agent': 'WatchWave v1.0',
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Api-Key': process.env.NEXT_PUBLIC_OS_API,
			},
			body: `{"file_id":${id}}`,
		};
		const response = await fetch(url, options);
		const data = await response.json();
		console.log(data);
		return NextResponse.json(data);
	}
}
