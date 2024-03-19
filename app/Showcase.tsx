"use client";
import { motion } from "framer-motion";
import { cloneElement, useEffect, useRef, useState } from "react";

import Image from "next/image";
import { MovieDetails, ShowDetails, fetchResults } from "../types";

import { IoStar } from "react-icons/io5";

import Slider from "@/app/components/Slider";
import Footer from "@/app/components/Footer";
import { Animation } from "./Animation";
import { UserAuth } from "./context/AuthContext";
import useAddToWatchlist from "./lib/firebase/addToWatchlist";
import getDocData from "./lib/firebase/getDocData";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./lib/firebase/firebase";
import { format } from "date-fns";

import WatchlistButton from "./components/WatchlistButton";
import PlayButton from "./components/PlayButton";
import { fetchContentDataFromCW, getImagePath } from "./lib/tmdb";
import Link from "next/link";

interface Props {
  movie: MovieDetails & ShowDetails;
  collection: fetchResults;
}

const Showcase = ({ movie, collection }: Props) => {
  const imageURL = getImagePath(movie.backdrop_path, "original");

  const { user } = UserAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { add, remove } = useAddToWatchlist("movie", movie.id);
  const [cW, setCW] = useState<{
    heading: string;
    collection: Array<ShowDetails | MovieDetails>;
  } | null>(null);
  // record user info in firestore

  const generateDetails = () => {
    const details = {
      vote_average: (
        <li className="fr gap-1 whitespace-nowrap">
          <IoStar />
          <span>{movie.vote_average.toFixed(1)}</span>
        </li>
      ),
      release_date: new Date(movie.release_date).getFullYear(),
      content_rating: movie.content_rating && (
        <li className="whitespace-nowrap rounded-lg border-1 border-[#a1a1a1] px-1.5">
          {movie.content_rating}
        </li>
      ),
      runtime:
        movie.runtime &&
        format(
          new Date(0, 0, 0, 0, movie.runtime),
          "h 'hr' m 'min'",
        ).toString(),
      first_air_date: new Date(movie.first_air_date).getFullYear(),
      number_of_episodes:
        movie.number_of_episodes && `${movie.number_of_episodes} episodes`,
    };

    // remove undefined or NaN or null values
    Object.keys(details).forEach((key) => {
      const detailKey = key as keyof typeof details;
      if (
        details[detailKey] === undefined ||
        Number.isNaN(details[detailKey]) ||
        details[detailKey] === null
      ) {
        delete details[detailKey];
      }
    });

    // create an <li> for each value
    // in between, add a bullet point wrapped in a <li>
    let detailsArray = Object.values(details).map((detail, i) => {
      // if the value is already an <li>, return it
      if (typeof detail === "object")
        return cloneElement(detail, { key: `detail-${movie.id}-${i}` });
      // otherwise, create a new <li> and return it
      return (
        <li className="whitespace-nowrap" key={i}>
          {detail}
        </li>
      );
    });

    // add a bullet point between each <li>
    detailsArray = detailsArray.reduce(
      (acc: React.ReactElement[], li: React.ReactElement, i: number) => {
        // if it's the last item, don't add a bullet point
        if (i === detailsArray.length - 1) return [...acc, li];
        // otherwise, add a bullet point and the <li>
        return [...acc, li, <li key={`bullet-${i}`}>•</li>];
      },
      [] as React.ReactElement[],
    );

    return detailsArray;
  };

  const logUser = () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef)
      .then(async (docSnap) => {
        if (!docSnap.exists()) {
          console.log("doc does not exist");
          return;
        }
        await setDoc(
          docRef,
          {
            userInfo: {
              name: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              phoneNumber: user.phoneNumber,
              uid: user.uid,
              emailVerified: user.emailVerified,
            },
          },
          { merge: true },
        );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!user) return;
    logUser();
  }, [user]);

  //get continue watching data
  useEffect(() => {
    const getCW = async () => {
      //////////////////////////
      // Continue watching //

      let continueWatching = [];
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // access continueWatching array
          const continueWatchingData = docSnap.data().continueWatching;
          if (!continueWatchingData) return;
          // map through the array and fetch the details of each item
          continueWatching = await fetchContentDataFromCW(continueWatchingData);
        }
      }
      // set continue watching collection
      if (continueWatching.length > 0) {
        const continueWatchingCollection = {
          heading: "Continue Watching",
          collection: continueWatching,
        };
        setCW(continueWatchingCollection);
      }
    };
    getCW();
  }, [user]);

  // run getDocData only once
  useEffect(() => {
    if (!user) return;
    getDocData(user)
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err));
  }, [user]);

  useEffect(() => {
    if (!user) setData(null);
  }, [user]);

  useEffect(() => {
    if (!data) return;
    if (data.movie) {
      if (data.movie.includes(movie.id)) {
        setIsInWatchlist(true);
      } else {
        setIsInWatchlist(false);
      }
    }
  }, [data, user]);

  const textRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const textElement = textRef.current;
    const maxHeight = 100; // Adjust as needed

    if (textElement === null) return;
    while (textElement.offsetHeight > maxHeight) {
      const style = window.getComputedStyle(textElement);
      const fontSize = parseFloat(style.fontSize);

      textElement.style.fontSize = `${fontSize - 1}px`;
    }
  }, []);

  return (
    <>
      {isLoading && <Animation />}

      {/* <iframe className="w-screen h-screen" src="https://d.daddylivehd.sx/embed/stream-1.php">
				Your Browser Do not Support Iframe
			</iframe> */}
      <main className="min-h-screen w-full overflow-hidden bg-black light">
        <div className="fc w-screen justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="h-full w-full"
          >
            <Image
              src={imageURL}
              priority
              alt="movie poster"
              width={1920}
              height={1080}
              className="absolute h-full w-full object-cover object-center"
            />
            <motion.div
              initial={{
                background:
                  "radial-gradient(ellipse 100% 80% at 80% -50%, rgba(0, 0, 0) 0%, rgb(0, 0, 0) 100%)",
              }}
              animate={{
                background:
                  "radial-gradient(ellipse 100% 80% at 80% 20%, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%)",
              }}
              transition={{ duration: 1 }}
              className="mask absolute h-full w-full"
            />
          </motion.div>
          <div className="fc mb-10 h-full w-full items-start justify-start">
            <div className="fc z-10 w-full items-start justify-start pt-80 sm:px-0 sm:pl-36">
              <div className="fc w-full items-start justify-start px-5 pr-10">
                {movie.logo ? (
                  <div className="w-full max-w-[calc(50%)] px-3">
                    <Image
                      src={movie.logo}
                      alt="movie logo"
                      width={300}
                      height={200}
                      className="mb-5 max-h-[300px] w-full"
                    />
                  </div>
                ) : (
                  <h1
                    ref={textRef}
                    className="mb-3 pr-10 text-5xl font-bold text-white md:mb-5 md:text-8xl"
                  >
                    {movie.title}
                  </h1>
                )}

                {/* details */}
                <ul className="showcase_detail fr gap-3 font-medium text-white/80 sm:text-lg md:mt-1">
                  {generateDetails()}
                </ul>
                <p className="mt-4 max-w-[50ch] text-base font-medium leading-normal text-white/80">
                  {movie.overview}
                </p>
                <div className="fr mt-4 gap-3">
                  <Link href={`/watch/${movie.media_type}/${movie.id}`}>
                    <PlayButton />
                  </Link>
                  <WatchlistButton
                    isInWatchlist={isInWatchlist}
                    content={movie}
                    setData={setData}
                  />
                </div>
              </div>

              <div className="fc mt-10 w-full gap-10">
                {cW && cW.collection.length > 0 && (
                  <Slider
                    setIsLoading={setIsLoading}
                    headline={cW.heading}
                    section={cW}
                    more={false}
                    removeFromCW={true}
                  />
                )}
                {Object.keys(collection).map((key) => {
                  const collectionItem = collection[key as keyof fetchResults];
                  return (
                    <Slider
                      setIsLoading={setIsLoading}
                      key={key}
                      headline={collectionItem.heading}
                      section={collectionItem}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Showcase;
