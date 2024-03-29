import { useMainStore } from '@/app/store/main-state-provider';
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from '@nextui-org/react';
import React from 'react';
import { BsChevronDown } from 'react-icons/bs';

interface Props {
	sourceCollection: any;
}

const SourcesButton = ({ sourceCollection }: Props) => {
	const { source, setSource } = useMainStore((state) => state);
	return (
		<Dropdown size="sm">
			<DropdownTrigger>
				<Button size="sm">
					Source {source + 1} <BsChevronDown />
				</Button>
			</DropdownTrigger>
			<DropdownMenu aria-label="Source Selection" onAction={(key) => setSource(Number(key))}>
				{sourceCollection ? (
					sourceCollection.map((source, index) => <DropdownItem key={index}>Source {index + 1}</DropdownItem>)
				) : (
					<DropdownItem>Sources not available</DropdownItem>
				)}
			</DropdownMenu>
		</Dropdown>
	);
};

export default SourcesButton;
