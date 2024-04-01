import { Movie, MovieDetails, Show, ShowDetails, recommendationProps } from '@/types';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { IoAdd, IoCheckmark, IoClose, IoImage, IoList } from 'react-icons/io5';
import useAddToContinueWatching from '../lib/firebase/useContinueWatching';
import useAddToWatchlist from '../lib/firebase/addToWatchlist';
import getDocData from '../lib/firebase/getDocData';
import { UserAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getImagePath } from '../lib/tmdb';
import { redirect } from 'next/navigation';

interface Props {
	content: Show | Movie | MovieDetails | ShowDetails | recommendationProps;
	removeFromCW?: boolean;
}

const NewCard = ({ content, removeFromCW }: Props) => {
	const { user } = UserAuth();
	const cardRef = useRef<HTMLDivElement>(null);
	const cw = useAddToContinueWatching(content.media_type, content.id);
	const [data, setData] = useState<any>(null);
	const { add, remove } = useAddToWatchlist(content.media_type, content.id);

	const [isInWatchlist, setIsInWatchlist] = useState(false);

	useEffect(() => {
		getDocData(user)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.log(err));
	}, [user]);

	useEffect(() => {
		if (!data) return;
		if (data[content.media_type]) {
			if (data[content.media_type].includes(content.id)) {
				setIsInWatchlist(true);
			} else {
				setIsInWatchlist(false);
			}
		}
	}, [data, user]);

	const handleWatchlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (!user) toast('Please sign in to add to watchlist');
		if (isInWatchlist) {
			remove();
		} else {
			add();
		}
		getDocData(user)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.log(err));
	};

	const handleRemoveFromCW = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (!user) toast('Please sign in to remove from Continue Watching');
		cw.remove();
		getDocData(user)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.log(err));
	};

	const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		// create glow on hover
		const card = cardRef.current;
		if (!card) return;
		const cardRect = card.getBoundingClientRect();
		card.style.setProperty('--mouse-x', `${e.clientX - cardRect.left}px`);
		card.style.setProperty('--mouse-y', `${e.clientY - cardRect.top}px`);
	};

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">{'title' in content ? content.title : content.name}</ModalHeader>
							<ModalBody>
								{content.backdrop_path && (
									<Image
										src={getImagePath(content.backdrop_path, 'original')}
										alt="poster"
										width={300}
										height={450}
										className="w-full rounded-xl"
									/>
								)}
								<div className="fc gap-2">
									<div className="fr gap-2">
										<h3 className="font-bold">
											{'title' in content ? content.title : content.name} •{' '}
											{'release_date' in content && content.release_date.length !== 0
												? content.release_date.split('-')[0]
												: 'first_air_date' in content && content.first_air_date.length !== 0
													? content.first_air_date.split('-')[0]
													: 'N/A'}
											{'runtime' in content
												? ` • ${format(new Date(0, 0, 0, 0, content.runtime), "h 'hr' m 'min'")}`
												: 'number_of_episodes' in content
													? `• ${content.number_of_episodes} episodes • ${content.number_of_seasons} seasons`
													: ''}
										</h3>
									</div>
									<p className="text-sm text-foreground/50">{content.overview}</p>
								</div>
							</ModalBody>
							<ModalFooter className="light">
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Link href={`/watch/${content.media_type}/${content.id}`}>
									<Button>Watch</Button>
								</Link>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			<div
				onMouseMove={mouseMove}
				className="fc group relative w-full max-w-[202px] cursor-pointer overflow-hidden rounded-2xl p-px no-pointer:hidden"
			>
				{/* desktop with pointer */}
				<div
					ref={cardRef}
					className="glow absolute inset-0 h-full w-full rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
				></div>
				<div className="h-full w-full max-w-[200px] rounded-2xl bg-transparent backdrop-blur-2xl transition-background group-hover:bg-foreground-800/90">
					<div className="fc h-full w-full gap-2 p-2">
						<div className="fc w-full items-start gap-1">
							<Link href={`/watch/${content.media_type}/${content.id}`} className="w-full transition-transform group-hover:scale-[.97]">
								{content.poster_path ? (
									<Image
										src={getImagePath(content.poster_path, 'w300')}
										alt={'title' in content ? content.title : content.name}
										width={300}
										height={450}
										className="mb-3 aspect-[2/3] h-full w-full rounded-2xl"
									/>
								) : (
									<div className="fc relative mb-3 aspect-[2/3] rounded-2xl bg-foreground-800 text-2xl">
										<Image
											src="/dummy_300x450.png"
											alt="No Poster"
											width={300}
											height={450}
											className="aspect-[2/3] h-full w-full opacity-0"
										/>
										<IoImage className="absolute z-10" />
									</div>
								)}
								<h4 className="text-sm font-bold text-white">{'title' in content ? content.title : content.name}</h4>
								<div className="fr justify-start gap-1 text-xs text-foreground-500">
									<p>{content.media_type === 'movie' ? 'Movie' : 'TV'}</p>
									<p>•</p>
									<p>
										{'release_date' in content && content.release_date.length !== 0
											? content.release_date.split('-')[0]
											: 'first_air_date' in content && content.first_air_date.length !== 0
												? content.first_air_date.split('-')[0]
												: 'N/A'}
									</p>
								</div>
							</Link>
							<div className="fr mt-3 gap-2">
								{removeFromCW && (
									<Tooltip content="Remove from Continue Watching">
										<Button
											isIconOnly
											color="danger"
											radius="full"
											variant="ghost"
											size="sm"
											className="text-white hover:text-black"
											aria-label="add to watchlist"
											onClick={handleRemoveFromCW}
										>
											{<IoClose size={15} />}
										</Button>
									</Tooltip>
								)}
								<Tooltip content={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}>
									<Button
										isIconOnly
										color="default"
										radius="full"
										variant="ghost"
										size="sm"
										className={`text-white hover:text-black ${!isInWatchlist ? 'hover:rotate-90' : 'hover:rotate-0'}`}
										aria-label="add to watchlist"
										onClick={handleWatchlistClick}
									>
										{isInWatchlist ? <IoCheckmark size={15} /> : <IoAdd size={15} />}
									</Button>
								</Tooltip>
								<Tooltip content="More Info">
									<Button
										isIconOnly
										color="default"
										radius="full"
										variant="ghost"
										size="sm"
										className="text-white hover:text-black"
										onClick={onOpen}
									>
										<IoList size={15} />
									</Button>
								</Tooltip>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* mobile with no pointer */}
			<div className="group pointer:hidden">
				<div className="h-full w-full max-w-[200px]  rounded-2xl bg-transparent backdrop-blur-2xl transition-background">
					<div className="fc h-full w-full gap-2 p-2">
						<div className="fc w-full items-start gap-1">
							<Link href={`/watch/${content.media_type}/${content.id}`}>
								{content.poster_path ? (
									<Image
										src={getImagePath(content.poster_path, 'w300')}
										alt={'title' in content ? content.title : content.name}
										width={300}
										height={450}
										className="mb-3 aspect-[2/3] h-full w-full rounded-2xl"
									/>
								) : (
									<div className="fc relative mb-3 aspect-[2/3] rounded-2xl bg-foreground-800 text-2xl">
										<Image
											src="/dummy_300x450.png"
											alt="No Poster"
											width={300}
											height={450}
											className="aspect-[2/3] h-full w-full opacity-0"
										/>
										<IoImage className="absolute z-10" />
									</div>
								)}
								<h4 className="text-sm font-bold text-white">{'title' in content ? content.title : content.name}</h4>
								<div className="fr justify-start gap-1 text-xs text-foreground-500">
									<p>{content.media_type === 'movie' ? 'Movie' : 'TV'}</p>
									<p>•</p>
									<p>
										{'release_date' in content && content.release_date.length !== 0
											? content.release_date.split('-')[0]
											: 'first_air_date' in content && content.first_air_date.length !== 0
												? content.first_air_date.split('-')[0]
												: 'N/A'}
									</p>
								</div>
							</Link>
							<div className="fr mt-3 gap-2">
								{removeFromCW && (
									<Tooltip content="Remove from Continue Watching">
										<Button
											isIconOnly
											color="danger"
											radius="full"
											variant="ghost"
											size="md"
											className="text-white"
											aria-label="add to watchlist"
											onClick={handleRemoveFromCW}
										>
											{<IoClose size={22} />}
										</Button>
									</Tooltip>
								)}
								<Tooltip content={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}>
									<Button
										isIconOnly
										color="default"
										radius="full"
										variant="ghost"
										size="md"
										className={`text-white`}
										aria-label="add to watchlist"
										onClick={handleWatchlistClick}
									>
										{isInWatchlist ? <IoCheckmark size={22} /> : <IoAdd size={22} />}
									</Button>
								</Tooltip>
								<Tooltip content="More Info">
									<Button
										isIconOnly
										color="default"
										radius="full"
										variant="ghost"
										size="md"
										className="text-white"
										onClick={onOpen}
									>
										<IoList size={22} />
									</Button>
								</Tooltip>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NewCard;
