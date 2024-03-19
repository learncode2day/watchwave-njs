import options from "@/app/lib/options";
import { MovieDetails, ShowDetails } from "@/types";
import {
  buildProviders,
  targets,
  makeStandardFetcher,
  makeSimpleProxyFetcher,
} from "@movie-web/providers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { episode, season, id, name, release, type } = body;
  console.log(body);
  // get new episode
  const proxyUrl = "https://jocular-fairy-e633ed.netlify.app";
  const providers = buildProviders()
    .setTarget(targets.BROWSER) // target of where the streams will be used
    .setFetcher(makeStandardFetcher(fetch)) // fetcher, every web request gets called through here
    .setProxiedFetcher(makeSimpleProxyFetcher(proxyUrl, fetch)) // proxied fetcher, every web request gets called through here
    .addBuiltinProviders() // add all builtin providers, if this is not called, no providers will be added to the controls
    .build();
  // console.log(sourceScrapers);

  let media;

  if (type === "movie") {
    media = {
      title: name,
      releaseYear: parseInt(release.split("-")[0] || "0"),
      tmdbId: id.toString(),
    };
  } else if (type === "tv") {
    media = {
      episode: {
        number: episode,
        tmdbId: id.toString(),
      },
      season: {
        number: season,
        tmdbId: id.toString(),
      },
      title: name,
      tmdbId: id.toString(),
      releaseYear: parseInt(release.split("-")[0] || "0"),
    };
  }

  const output = await providers.runAll({
    sourceOrder: ["flixhq"],
    embedOrder: ["vidsrc"],
    media: {
      ...media,
      type: type === "movie" ? "movie" : "show",
    },
  });

  return Response.json({ output });
}
