import { Button } from '@nextui-org/react';
import React from 'react';
import { IoPlay } from 'react-icons/io5';

const PlayButton = ({ action }: { action?: () => void }) => {
	return (
		<Button size="lg" radius="sm" className="group h-11 font-semibold" onClick={() => action && action()}>
			<IoPlay size={20} className="text-sm transition-transform duration-500 group-hover:scale-110 sm:text-base" />
			Play
		</Button>
	);
};

export default PlayButton;
