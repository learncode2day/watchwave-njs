import { Button } from '@nextui-org/react';
import React from 'react';
import { IoRemove, IoAdd } from 'react-icons/io5';

interface ValueProps {
	val: number;
	set: (val: number) => void;
	increment: () => void;
	decrement: () => void;
	step?: number;
}

const Value = ({ val, set, increment, decrement, step }: ValueProps) => {
	return (
		<div className="fr w-full rounded-lg bg-foreground-100 px-2 py-1">
			<Button isIconOnly variant="ghost" className="rounded-full text-xl" onClick={() => decrement()}>
				<IoRemove />
			</Button>
			<input
				type="number"
				className="fc w-full rounded-lg bg-transparent px-2 text-white/70 outline-none"
				value={val}
				onChange={(e) => set(parseInt(e.target.value))}
				step={step || 1}
			/>
			<Button isIconOnly variant="ghost" className="rounded-full text-xl" onClick={() => increment()}>
				<IoAdd />
			</Button>
		</div>
	);
};

export default Value;
