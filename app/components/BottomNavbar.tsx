'use client';
import React from 'react';
import Link from 'next/link';
import { UserAuth } from '@/app/context/AuthContext';
import { IoHome, IoSearch, IoListOutline, IoTv, IoCog } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const BottomNavbar: React.FC = () => {
	const { user, googleSignIn, logOut } = UserAuth();
	const router = useRouter();
	const icons = [
		// {
		//   path: "/",
		//   title: "Logo",
		//   link: false,
		//   icon: (
		//     <svg
		//       className="h-10"
		//       width="90"
		//       height="81"
		//       viewBox="0 0 90 81"
		//       fill="none"
		//       xmlns="http://www.w3.org/2000/svg"
		//     >
		//       <path
		//         className="fill-white"
		//         d="M0 10.2062V10.2062C8.68276 5.19325 19.7777 7.99117 25.0449 16.5221L58.5 70.7062V70.7062C49.8172 75.7192 38.7223 72.9213 33.4551 64.3904L0 10.2062Z"
		//       />
		//       <path
		//         className="fill-white"
		//         d="M30 10.7021V10.7021C38.6703 5.6963 49.7507 8.52051 54.967 17.0657L75.5 50.7021V50.7021C66.8297 55.7079 55.7493 52.8837 50.533 44.3384L30 10.7021Z"
		//       />
		//       <path
		//         className="fill-white"
		//         d="M66.6063 13.3877C70.7505 6.85852 79.3054 4.75754 86.0027 8.62422L89.6091 10.7064L75.5885 34.9908L66.5381 20.0671C65.2898 18.0085 65.3162 15.4203 66.6063 13.3877V13.3877Z"
		//       />
		//     </svg>
		//   ),
		// },
		{
			path: '/',
			title: 'Home',
			link: true,
			icon: (
				<div>
					<IoHome size={25} />
				</div>
			),
		},
		{
			path: '/search',
			title: 'Search',
			link: true,
			icon: (
				<div>
					<IoSearch size={25} />
				</div>
			),
		},
		{
			path: '/watchlist',
			title: 'Watchlist',
			link: true,
			icon: (
				<div>
					<IoListOutline size={25} />
				</div>
			),
		},
		{
			path: '/account',
			// title: "Account",
			link: false,
			icon: (
				<div>
					{typeof user !== 'string' && (
						<>
							{user?.photoURL ? (
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="cursor-pointer">
									<Dropdown placement="right">
										<DropdownTrigger>
											<Image className="rounded-full" width={40} height={40} src={user.photoURL} alt="avatar" />
										</DropdownTrigger>
										<DropdownMenu aria-label="Static Actions">
											{/* <DropdownItem key="account">
                        Account Settings
                      </DropdownItem> */}
											<DropdownItem
												key="delete"
												className="text-danger"
												color="danger"
												onClick={() => {
													logOut();
													router.refresh();
												}}
											>
												Log Out
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</motion.div>
							) : (
								<Button
									onClick={() => {
										try {
											googleSignIn();
										} catch (e) {
											console.log(e);
										}
									}}
									className="text-white light hover:text-black"
									variant="ghost"
								>
									Login
								</Button>
							)}
						</>
					)}
				</div>
			),
		},
	];

	return (
		<div className="fc pointer-events-none fixed bottom-0 z-40 w-screen items-end sm:hidden">
			<div className="fr pointer-events-auto h-full w-full justify-between bg-black/20 px-6 py-4 backdrop-blur-xl">
				{icons.map((icon, i) => {
					if (icon.link)
						return (
							<Link href={icon.path} key={icon.title} className="fc h-8 w-8 text-white/70">
								{icon.icon}
							</Link>
						);

					return (
						<div key={i} className="fc h-8 w-8 text-white/70">
							{icon.icon}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default BottomNavbar;
