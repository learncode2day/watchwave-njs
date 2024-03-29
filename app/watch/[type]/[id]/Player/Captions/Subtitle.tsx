'use client';
import { useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { useSubtitlesStore } from '@/app/store/subtitles-state-provider';
import PButton from '../Panels/PButton';
interface SubtitleProps {
	subtitle: { id: string; language: string };
	name: string;
	external: boolean;
}
const Subtitle = ({ subtitle, name, external }: SubtitleProps) => {
	const { subtitleSources, setSubtitle, setSubtitlesPanelVisible, setOff, setFetchedSubs, fetchedSubs } = useSubtitlesStore((state) => state);
	const [loading, setLoading] = useState(false);

	const fetchSubs = async (url: string) => {
		setLoading(true);
		console.log(url);
		const res = await fetch(`/api/subtitle?url=${encodeURI(url)}`);
		const subs = await res.json();
		setSubtitle(subs);
		setLoading(false);
	};

	const fetchURL = async (id: number) => {
		const url = await fetch(`/api/os?mode=file&id=${id}`);
		const data = await url.json();
		return data;
	};

	const handleClick = async () => {
		if (external) {
			// if url already exists, no need to fetch it again
			if (subtitle.link) {
				fetchSubs(subtitle.link).then(() => {
					setOff(false);
					setSubtitlesPanelVisible(false);
				});
				return;
			}

			const url = await fetchURL(subtitle.files[0].file_id);
			console.log(url);

			// edit existing object
			const newSub = fetchedSubs;
			newSub.find((sub) => sub.id === subtitle.id).link = url.link;
			setFetchedSubs(newSub);

			fetchSubs(url.link).then(() => {
				setOff(false);
				setSubtitlesPanelVisible(false);
			});
		} else {
			const currentSub = subtitleSources.filter((sub) => sub.language === subtitle.language);
			if (currentSub.length === 0) return;
			fetchSubs(currentSub[0].url).then(() => {
				setOff(false);
				setSubtitlesPanelVisible(false);
			});
		}
	};

	return (
		<li className="w-full" key={subtitle.id}>
			<PButton action={handleClick}>
				<span>{name}</span>
				{loading && (
					<span>
						<LuLoader className="animate-spinner-linear-spin" />
					</span>
				)}
			</PButton>
		</li>
	);
};

export default Subtitle;
