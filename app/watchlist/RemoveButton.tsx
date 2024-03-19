import { MovieDetails, ShowDetails } from '@/types';
import React from 'react';
import useAddToWatchlist from '../lib/firebase/addToWatchlist';
import { Button } from '@nextui-org/react';
import { IoTrash } from 'react-icons/io5';
interface RemoveButtonProps {
	content: MovieDetails | ShowDetails;
}

const RemoveButton = ({ content }: RemoveButtonProps) => {
	const { remove } = useAddToWatchlist(content.media_type, content.id);
	return (
		<button onClick={remove} className="text-2xl text-danger fc">
			<IoTrash />
		</button>
	);
};

export default RemoveButton;
