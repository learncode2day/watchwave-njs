'use client';
import { useAsyncList } from '@react-stately/data';
import React, { useEffect, useState } from 'react';
import { UserAuth } from '@/app/context/AuthContext';
import fetchDetails from '@/app/lib/fetchDetails';
import { MovieDetails, ShowDetails } from '@/types';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';
import Loading from '../loading';
import NewCard from '../components/NewCard';
import {
	Checkbox,
	Input,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	getKeyValue,
	Spinner,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/react';
import Image from 'next/image';
import RemoveButton from './RemoveButton';
import { format } from 'date-fns';
import { getImagePath } from '../lib/tmdb';
import { LuLoader } from 'react-icons/lu';
import options from '../lib/options';
import getDocData from '../lib/firebase/getDocData';
import { IoArrowDown, IoSearch } from 'react-icons/io5';
import { capitalize } from 'lodash';
import Link from 'next/link';

const Watchlist = () => {
	const { user } = UserAuth();
	const [value, loading, error] = useDocumentData(doc(db, 'users/' + user?.uid));
	const [movies, setMovies] = useState<MovieDetails[] | null>(null);
	const [tv, setTv] = useState<ShowDetails[] | null>(null);
	const [listView, setListView] = useState(false);
	const [query, setQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState(new Set(['movie', 'tv']));

	const selectedValue = React.useMemo(() => Array.from(statusFilter).join(', ').replaceAll('_', ' '), [statusFilter]);

	const getStuff = async () => {
		if (!value) return;
		if (value.movie) {
			const tempMovies = await Promise.all(value.movie.map((id) => fetchDetails(id, 'movie')));
			tempMovies.forEach((movie) => (movie.media_type = 'movie'));

			setMovies(tempMovies.reverse());
		}
		if (value.tv) {
			const tempTv = await Promise.all(value.tv.map((id) => fetchDetails(id, 'tv')));

			tempTv.forEach((tv) => (tv.media_type = 'tv'));
			console.log(tempTv);
			setTv(tempTv.reverse());
		}
	};

	useEffect(() => {
		if (!movies || !tv) return;
		console.log(movies.length, tv.length);
	}, [movies, tv]);

	useEffect(() => {
		console.log(movies);
	}, [movies]);

	useEffect(() => {
		console.log(tv);
	}, [tv]);

	useEffect(() => {
		getStuff();
	}, [value]);

	// return <App />;
	if (listView) {
		return (
			<div className="min-h-screen w-full bg-background text-foreground">
				<div className="fc min-h-screen w-full justify-start items-start gap-20 pt-28 sm:pl-36">
					{!user ? (
						<div className="fc h-full w-full text-white">Login to view your watchlist</div>
					) : (
						<>
							<div className="fc my-5 w-full items-start gap-3 px-2 sm:px-5">
								<h2 className="text-2xl sm:text-4xl font-bold text-white">Here's your watchlist, {user.displayName.split(' ')[0]}</h2>
								<Checkbox isSelected={listView} onChange={() => setListView(!listView)}>
									List View
								</Checkbox>
								<div className="w-full fc sm:fr gap-2 sm:gap-5 justify-start items-start sm:justify-start">
									<Input
										isClearable
										startContent={<IoSearch />}
										className="w-full sm:w-96"
										placeholder="Search for movies or TV shows"
										value={query}
										onChange={(e) => setQuery(e.target.value)}
									/>
									<Dropdown>
										<DropdownTrigger className="hidden sm:flex">
											<Button endContent={<IoArrowDown className="text-small" />} variant="flat">
												{selectedValue}
											</Button>
										</DropdownTrigger>
										<DropdownMenu
											disallowEmptySelection
											aria-label="Table Columns"
											closeOnSelect
											selectedKeys={statusFilter}
											selectionMode="multiple"
											onSelectionChange={(keys) => setStatusFilter(keys)}
										>
											<DropdownItem key="movie">movie</DropdownItem>
											<DropdownItem key="tv">tv</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</div>
								{movies && tv && (
									<div className="w-full overflow-x-scroll">
										<Table layout="auto" aria-label="Simple table" removeWrapper>
											<TableHeader>
												{/* info about the movie */}
												<TableColumn>POSTER</TableColumn>
												<TableColumn>NAME</TableColumn>
												<TableColumn>TYPE</TableColumn>
												<TableColumn>RELEASE DATE</TableColumn>
												<TableColumn>RATING</TableColumn>
												<TableColumn>REMOVE</TableColumn>
											</TableHeader>
											<TableBody
												emptyContent={query ? 'No results found' : 'No movies or TV shows added'}
												loadingContent={<Spinner label="Loading..." />}
												isLoading={loading || !movies || !tv}
											>
												{/* concatenate the arrays */}
												{Array.prototype
													.concat(movies, tv)
													.filter((movie: MovieDetails | ShowDetails) => {
														const title = 'title' in movie ? movie.title : movie.name;
														return title.toLowerCase().includes(query.toLowerCase());
													})
													.filter((movie: MovieDetails | ShowDetails) => {
														if (statusFilter.length === 0) {
															return true;
														}
														return statusFilter.has(movie.media_type);
													})
													.map((movie: MovieDetails | ShowDetails) => (
														<TableRow key={movie.id}>
															<TableCell>
																<Link href={`/watch/${movie.media_type}/${movie.id}`}>
																	<Image
																		className="rounded-md"
																		src={
																			movie.poster_path
																				? getImagePath(movie.poster_path, 'w300')
																				: 'https://via.placeholder.com/100x150'
																		}
																		alt={'title' in movie ? movie.title : movie.name}
																		width={100}
																		height={150}
																	/>
																</Link>
															</TableCell>
															<TableCell className="font-bold text-xl">
																<Link
																	className="underline underline-offset-2"
																	href={`/watch/${movie.media_type}/${movie.id}`}
																>
																	{'title' in movie ? movie.title : movie.name}
																</Link>
															</TableCell>
															<TableCell>{movie.media_type}</TableCell>
															{/* format release date with date-fns: March 13, 2024 */}
															<TableCell>
																{format(
																	'release_date' in movie
																		? new Date(movie.release_date)
																		: new Date(movie.first_air_date),
																	'MMMM d, yyyy'
																)}
															</TableCell>
															<TableCell>{movie.content_rating || '-'}</TableCell>
															<TableCell>
																<RemoveButton content={movie} />
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		);
	}

	if (loading || !movies || !tv) {
		return <Loading />; // Replace with your loading component
	}

	return (
		<div className="min-h-screen w-full bg-background text-foreground">
			<div className="fc min-h-screen w-full items-start gap-20 pt-16 sm:pl-36 md:pt-0">
				{!user ? (
					<div className="fc h-full w-full text-white">Login to view your watchlist</div>
				) : (
					<>
						<div className="fc my-5 w-full items-start gap-3 px-2 sm:px-5">
							<h2 className="text-2xl sm:text-4xl font-bold text-white">Here's your watchlist, {user.displayName.split(' ')[0]}</h2>
							<Checkbox isSelected={listView} onChange={() => setListView(!listView)}>
								List View
							</Checkbox>
							{movies && (
								<>
									<h3 className="text-xl font-bold text-white">Movies ({movies.length})</h3>
									<div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 md:gap-5 gap-3 place-items-start">
										{movies.length === 0 ? (
											<div className="text-white">No movies added</div>
										) : (
											<>
												{movies.map((movie: MovieDetails) => (
													<div key={movie.id} className="w-full fc light justify-start">
														<NewCard content={movie} />
													</div>
												))}
											</>
										)}
									</div>
								</>
							)}
							{tv && (
								<>
									<h3 className="mt-16 text-xl font-bold text-white">TV Shows ({tv.length})</h3>
									<div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 md:gap-5 gap-3 place-items-start">
										{tv.length === 0 ? (
											<div className="text-white">No TV shows added</div>
										) : (
											<>
												{tv.map((show: ShowDetails) => (
													<div key={show.id} className="w-full fc light justify-start">
														<NewCard content={show} />
													</div>
												))}
											</>
										)}
									</div>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Watchlist;
