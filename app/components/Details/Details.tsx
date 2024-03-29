"use client";
import Genres from "./Genres";
import Image from "next/image";
import React, { useEffect } from "react";
import { db } from "@/app/lib/firebase/firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Error from "@/app/error";
import ListOfFacts from "./ListOfFacts";
import Keywords from "./Keywords";
import Reccomendations from "./Reccomendations";
import Videos from "./Videos";
import { getImagePath } from "@/app/lib/tmdb";
import PlayButton from "../PlayButton";
import WatchlistButton from "../WatchlistButton";
import { UserAuth } from "@/app/context/AuthContext";
import Cast from "./Cast";
import { useMainStore } from "@/app/store/main-state-provider";

const Details = () => {
  const { setPlayerVisibility, result, sections } = useMainStore(
    (state) => state,
  );
  // console.log(setIsLoading);
  const { user } = UserAuth();
  const [value, loading, error] = useDocumentData(
    doc(db, "commentsCollection/" + result?.media_type),
  );
  const [value2, loading2, error2] = useDocumentData(
    doc(db, "users/" + user?.uid),
  );
  useEffect(() => {
    console.log(value);
  }, [value]);

  if (error)
    <Error
      error={error}
      reset={() => {
        window.location.reload();
      }}
    />;

  const { recommendations, credits, keywords, videos, reviews, external } =
    sections || {}; // Add default empty object to handle null case

  if (!result?.id) return null;

  return (
    <>
      {/* check if result is type MovieDetails */}
      {result && (
        <div className="fc relative z-10 mt-[25vh] w-full pl-14 pt-7">
          <div className="fc md:fr mb-12 w-full max-w-7xl gap-5 px-5 sm:px-10 md:items-start md:justify-start">
            {result.poster_path && (
              <Image
                width={250}
                height={375}
                className="z-10 aspect-[2/3] max-w-[250px] rounded-xl object-cover"
                src={getImagePath(result.poster_path, "w400")}
                alt="Poster"
              />
            )}
            <div className="fc items-start gap-2">
              <h1 className="text-5xl font-bold">
                {"release_date" in result ? result.title : result.name}
              </h1>
              <ListOfFacts result={result} external={external} />
              <div className="fr flex-wrap justify-start gap-2 light">
                <PlayButton action={() => setPlayerVisibility(true)} />
                {value2 && (
                  <WatchlistButton
                    content={result}
                    isInWatchlist={value2[result.media_type].includes(
                      result.id,
                    )}
                  />
                )}
              </div>
              <p className="max-w-[50ch] text-sm sm:text-lg">
                {result.overview}
              </p>
              <ul className="fc lg:fr w-full flex-wrap items-start justify-start gap-4 lg:justify-start">
                {/* <Credits credits={credits} /> */}
                <Genres result={result} />
                <Keywords keywords={keywords} />
              </ul>
            </div>
          </div>
          <div className="w-full px-5">
            {/* {value && (
							<div className="fc w-full justify-start">
								<h3 className="mb-5 text-3xl font-bold">Comments</h3>
								<CommentSlider user={user} comments={value[result?.id] || null} mediatype={result.media_type} id={result.id} />
							</div>
						)} */}
            <Videos videos={videos} />
            <Reccomendations recommendations={recommendations} />
            <Cast credits={credits} imdbId={external.imdb_id} />
            {/* {reviews && reviews.results && reviews.results.length !== 0 && (
							<div className="fc my-10 w-full">
								<h3 className="mb-5 text-3xl font-bold">Reviews</h3>
								<div className="fr w-full flex-wrap items-start gap-6">
									{reviews.results.map((review: reviewProps) => (
										<Review key={review.id} review={review} />
									))}
								</div>
							</div>
						)} */}
          </div>
        </div>
      )}
    </>
  );
};

export default Details;
