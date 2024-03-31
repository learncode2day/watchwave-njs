import { Button } from '@nextui-org/react';
import React, { useState } from 'react';
import { IoAdd, IoCheckmark } from 'react-icons/io5';
import getDocData from '../lib/firebase/getDocData';
import { toast } from 'sonner';
import useAddToWatchlist from '../lib/firebase/addToWatchlist';
import { MovieDetails, ShowDetails } from '@/types';
import { UserAuth } from '../context/AuthContext';

interface Props {
	content: MovieDetails | ShowDetails;
	isInWatchlist: boolean;
	setData?: any;
}
const WatchlistButton = ({ content, setData, isInWatchlist }: Props) => {
	const { add, remove } = useAddToWatchlist(content.media_type, content.id);
	const { user } = UserAuth();

	return (
		<Button
			size="lg"
			radius="sm"
			className="group h-11 font-semibold text-white hover:text-black text-sm md:text-medium px-unit-4 md:px-unit-6"
			variant="ghost"
			onClick={() => {
				if (user) {
					if (isInWatchlist) {
						remove();
					} else {
						add();
					}
					getDocData(user)
						.then((res) => {
							if (setData) setData(res);
						})
						.catch((err) => console.log(err));
				} else {
					toast('Please sign in to add to watchlist');
				}
			}}
		>
			{!isInWatchlist ? (
				<>
					<IoAdd className="transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" size={20} />
					Add to Watchlist
				</>
			) : (
				<>
					<IoCheckmark size={20} />
					Added to Watchlist
				</>
			)}
		</Button>
	);
};

export default WatchlistButton;
