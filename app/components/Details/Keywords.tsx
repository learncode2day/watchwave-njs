import { keywordProps } from '@/types';
import { Chip } from '@nextui-org/react';
import React from 'react';

const Keywords = ({ keywords }: { keywords: any }) => {
	return (
		<>
			{keywords?.keywords && keywords.keywords.length !== 0 && (
				<li className="fr items-start  w-full justify-start gap-3 sm:col-span-2">
					<div className="font-bold">Keywords</div>
					<div className="fr flex-wrap justify-start gap-2">
						{keywords.keywords.map((keyword: keywordProps, i: number) => (
							<Chip variant="bordered" key={i}>
								{keyword.name}
							</Chip>
						))}
					</div>
				</li>
			)}
		</>
	);
};

export default Keywords;
