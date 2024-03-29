import { NextResponse } from 'next/server';
import ytdl, { videoFormat } from 'ytdl-core';
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const key = searchParams.get('key');
	if (!key) return NextResponse.json({ error: 'no key' });
	const y = await ytdl.getInfo(key);

	const formats: videoFormat[] = [...y.player_response.streamingData.adaptiveFormats, ...y.player_response.streamingData.formats];

	const final = {
		video: {
			url: '',
		},
		audio: {
			url: '',
		},
	};

	let i = 248;

	while (final.video.url === '') {
		try {
			const f = ytdl.chooseFormat(formats, { quality: i });
			final.video.url = f.url;
		} catch (e) {
			console.log(e);
		}
		i--;
	}

	// fetch audio only
	i = 251;
	while (final.audio.url === '') {
		try {
			const f = ytdl.chooseFormat(formats, { quality: i });
			final.audio.url = f.url;
		} catch (e) {
			console.log(e);
		}
		i--;
	}

	console.log(final);

	return NextResponse.json(final);
}
