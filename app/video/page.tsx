'use client';
import React from 'react';

export const Page = () => {
	return (
		<video
			src="https://usa7-nas32.shegu.net/vip/p1/movie_mp4_h264/2021/4/6/40596/movie.40596.2021.4K.H264.20211025075229.mp4?KEY1=9py2J8hUAlKxFn7omCAtkQ&KEY2=1710524823"
			controls
		>
			{/* subtitles */}
			<track src="/Dune.vtt" kind="subtitles" srcLang="en" label="English" />
		</video>
	);
};

export default Page;
