import { NextResponse } from 'next/server';
import Vibrant from 'node-vibrant';

export async function GET(request: Request) {
	const params = new URLSearchParams(request.url);
	const url = params.get('url');
	const vibrant = new Vibrant(url);
	const palette = await vibrant.getPalette();
	return NextResponse.json(palette);
}
