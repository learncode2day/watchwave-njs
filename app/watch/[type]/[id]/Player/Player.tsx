"use client";
// import dynamic from 'next/dynamic';
// import ReactPlayer from 'react-player';
// const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import {
  Episodes,
  FastForward,
  Fullscreen,
  PIP,
  PlayPause,
  Rewind,
  Settings,
  Subtitle,
  Time,
  Volume,
} from "./atoms";
import { RunOutput } from "@movie-web/providers";
import { useEffect, useRef, useState } from "react";
import { Slider, Spinner } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { MovieDetails, ShowDetails } from "@/types";
import "./player.css";
import { usePlayerStore } from "@/app/store/player-state-provider";
import { SubtitlesPanel } from "./Panels/SubtitlePanel";
import { SettingsPanel } from "./Panels/SettingsPanel";
import { EpisodePanel } from "./Panels/EpisodePanel";
import Captions from "./Captions";
import Hls from "hls.js";
import { useSubtitlesStore } from "@/app/store/subtitles-state-provider";
import { IoChevronBack } from "react-icons/io5";
import { Subtitles } from "@/app/store/SubtitlesStore";
import SourcesButton from "@/app/components/Details/SourcesButton";
import { useMainStore } from "@/app/store/main-state-provider";
import { useTVStore } from "@/app/store/tv-state-provider";
import NextEpisode from "./NextEpisode";
import MultiStepLoader from "./Loader";
import { toast } from "sonner";

interface PlayerProps {
  result: MovieDetails | ShowDetails;
  setPlayerVisibility: (visible: boolean) => void;
  sourceCollection: string[];
}

const Player: React.FC<PlayerProps> = ({
  result,
  sourceCollection,
  setPlayerVisibility,
}) => {
  const player = useRef<HTMLVideoElement>(null);
  const { source, adBlocker } = useMainStore((state) => state);
  const { episode, season } = useTVStore((state) => state);

  const {
    src,
    playing,
    volume,
    muted,
    played,
    loaded,
    duration,
    seeking,
    isControlsVisible,
    setSrc,
    setPlaying,
    isMobile,
    setMobile,
    setVolume,
    setMuted,
    setPlayed,
    setLoaded,
    setDuration,
    setPlaybackRate,
    setSeeking,
    setBuffering,
    setTimeLeft,
    setIsControlsVisible,
    setQuality,
    setAvailableQualities,
    panelVisible,
    failed,
    setFailed,
    setSources,
    sources,
    setFetching,
    fetching,
    setLoaderO,
    loaderO,
  } = usePlayerStore((state) => state);

  useEffect(() => {
    window.mobileCheck = function () {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a,
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4),
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    };
    if (window.mobileCheck()) {
      setMobile(true);
    }

    fetchSources().then((sources) => {
      setLoader("getting");
      setSources(sources);
      handleSources(sources);
    });
    return () => {
      setSources(null);
      setSrc("");
      setPlaying(false);
      setVolume(1);
      setMuted(false);
      setPlayed(0);
      setLoaded(false);
      setDuration(0);
      setPlaybackRate(1.0);
      setSeeking(false);
      setBuffering(false);
      setTimeLeft(null);
      setIsControlsVisible(true);
      setQuality(null);
      setAvailableQualities([]);
      setSubtitleSources([]);
      setFailed(false);
    };
  }, [episode, season]);

  // when episode changes, update the sources by calling /api/episode

  const fetchSources = async () => {
    if (result.media_type === "movie" && "title" in result) {
      setFetching(true);
      const res = await fetch("/api/episode", {
        method: "POST",
        body: JSON.stringify({
          type: "movie",
          id: result.id,
          name: result.title,
          release: result.release_date,
        }),
      });
      const data = await res.json();
      console.log(data);
      setFetching(false);
      return data.output;
    } else if ("name" in result) {
      console.log({
        episode,
        season,
      });
      // find index of season
      setFetching(true);
      const res = await fetch("/api/episode", {
        method: "POST",
        body: JSON.stringify({
          type: "tv",
          episode: episode.toString(),
          season: (season + 1).toString(),
          id: result.id,
          name: result.name,
          release: result.first_air_date,
        }),
      });
      const data = await res.json();
      console.log(data);
      setFetching(false);
      return data.output;
    }
  };

  useEffect(() => {
    console.log("controls", isControlsVisible);
  }, [isControlsVisible]);

  const {
    bottom,
    setBottom,
    setFontSize,
    fontSize,
    setTimeOffset,
    timeOffset,
    setSubtitleSources,
    subtitleSources,
    subtitlePanelVisible,
  } = useSubtitlesStore((state) => state);
  const { episodePanelVisible, nextEpisodeVisible, setNextEpisodeVisible } =
    useTVStore((state) => state);

  const timerRef = useRef(null);

  const [isInteracting, setIsInteracting] = useState(false);

  const setLoader = (state: "getting" | "parsing" | "subs" | "vid init") => {
    let index;
    switch (state) {
      case "getting":
        index = 0;
        break;
      case "parsing":
        index = 1;
        break;
      case "subs":
        index = 2;
        break;
      case "vid init":
        index = 3;
        break;
    }

    console.log(loaderO);
    const newState = [...loaderO];
    newState[index].completed = true;
    setLoaderO(newState);
  };

  const handleSources = (s: RunOutput | null) => {
    console.log(s);
    if (s === null && !fetching) {
      setFailed(true);
      return;
    }
    if (s.stream.type === "file") {
      const qualities = Object.keys(s.stream.qualities).sort((a, b) => {
        if (a === "4k") {
          return -1; // '4k' should come before any other value
        } else if (b === "4k") {
          return 1; // '4k' should come before any other value
        } else {
          return Number(b) - Number(a); // Convert keys to numbers and sort in ascending order
        }
      });

      setAvailableQualities(qualities);

      // set highest available quality as default
      setQuality(qualities[0]);

      // set url to the highest quality available
      setSrc(
        s.stream.qualities[qualities[0] as keyof typeof s.stream.qualities]
          ?.url,
      );
      setLoader("parsing");

      // set subtitles variable
      // prepend each subtitle url with https://jocular-fairy-e633ed.netlify.app
      const newCaptions = s.stream.captions.map((caption: Subtitles) => {
        return {
          ...caption,
          url: `https://jocular-fairy-e633ed.netlify.app/?destination=${caption.url}`,
        };
      });
      setSubtitleSources(newCaptions);
      setLoader("subs");
    } else {
      // hls
      if (!player.current) return;
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferSize: 500 * 1000 * 1000, // 500 mb of buffering, should load more fragments at once
          fragLoadPolicy: {
            default: {
              maxLoadTimeMs: 30 * 1000, // allow it load extra long, fragments are slow if requested for the first time on an origin
              maxTimeToFirstByteMs: 30 * 1000,
              errorRetry: {
                maxNumRetry: 2,
                retryDelayMs: 1000,
                maxRetryDelayMs: 8000,
              },
              timeoutRetry: {
                maxNumRetry: 3,
                maxRetryDelayMs: 0,
                retryDelayMs: 0,
              },
            },
          },
          // TODO: extract qualities from the manifest
        });
        console.log(s.stream.playlist);

        if (
          s.stream.playlist.startsWith("/") &&
          s.stream.flags.includes("cors-allowed")
        ) {
          // setFailed(true);
        }

        // sources.stream.playlist = 'https://jocular-fairy-e633ed.netlify.app/?destination=' + sources.stream.playlist;
        console.log(hls.levels);
        hls.loadSource(s.stream.playlist);
        hls.attachMedia(player.current);
        setLoader("parsing");
      }
      // HLS.js is not supported on platforms that do not have Media Source
      // Extensions (MSE) enabled.
      //
      // When the browser has built-in HLS support (check using `canPlayType`),
      // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
      // element through the `src` property. This is using the built-in support
      // of the plain video element, without using HLS.js.
      else if (player.current.canPlayType("application/vnd.apple.mpegurl")) {
        player.current.src = s.stream.playlist;
        setLoader("parsing");
      }
    }
  };

  /**
   * Handles mouse movement to show controls and start timeout
   * to hide controls after period of inactivity.
   */
  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!isInteracting && playing) {
      timerRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 2000);
    }
  };

  // TODO: fix interaction
  // useEffect(() => {
  // 	console.log(isInteracting);
  // }, [isInteracting]);

  /**
   * Adds a keydown event listener that shows the video
   * controls overlay and handles media playback keyboard
   * shortcuts when the user presses keys.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey || e.metaKey || e.altKey || e.ctrlKey) return;
      switch (e.key) {
        case " ":
          // Toggle play/pause when space is pressed
          playPause();
          break;
        case "ArrowRight":
          // Seek 15 seconds forward when right arrow is pressed
          // Seek 30 seconds forward when shift + right arrow is pressed
          const forwardTime = e.shiftKey ? played + 30 : played + 15;
          setPlayed(forwardTime);
          if (player.current) player.current.currentTime = forwardTime;
          break;
        case "ArrowLeft":
          // Seek 15 seconds backward when left arrow is pressed
          // Seek 30 seconds backward when shift + left arrow is pressed
          const backwardTime = e.shiftKey ? played - 30 : played - 15;
          setPlayed(backwardTime);
          if (player.current) player.current.currentTime = backwardTime;
          break;
        case "ArrowUp":
          // Increase volume when up arrow is pressed
          changeVolume(Math.min(volume + 0.1, 1));

          break;
        case "ArrowDown":
          changeVolume(Math.max(volume - 0.1, 0));

          break;
        case "m":
          // Toggle mute when "m" is pressed
          setMuted(!muted);
          break;
        case "f":
          // Toggle fullscreen when "f" is pressed
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.querySelector(".player")?.requestFullscreen();
          }
          break;
        case "p":
          // Toggle PiP when "p" is pressed
          startPIP();
          break;
        case "=":
          // Increase caption font size when "=" is pressed
          setFontSize(fontSize + 1);
          break;
        case "-":
          // Decrease caption font size when "-" is pressed
          setFontSize(fontSize - 1);
          break;
        case "t":
          // Increase caption bottom offset when "t" is pressed
          setBottom(bottom + 5);
          break;

        case "r":
          // decrease caption bottom offset when "t" is pressed
          setBottom(bottom - 5);
          break;

        case "z":
          // decrease time offset

          setTimeOffset(timeOffset - 1);
        case "x":
          // increase time offset
          setTimeOffset(timeOffset + 1);

        // numbers with set to percentages ex. 1 will set to 10% 2 will set to 20% etc
        case "1":
          seekTo((duration / 100) * 10);
          break;
        case "2":
          seekTo((duration / 100) * 20);
          break;
        case "3":
          seekTo((duration / 100) * 30);
          break;
        case "4":
          seekTo((duration / 100) * 40);
          break;
        case "5":
          seekTo((duration / 100) * 50);
          break;
        case "6":
          seekTo((duration / 100) * 60);
          break;
        case "7":
          seekTo((duration / 100) * 70);
          break;
        case "8":
          seekTo((duration / 100) * 80);
          break;
        case "9":
          seekTo((duration / 100) * 90);
          break;
        case "0":
          seekTo(duration);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [played]);

  /**
   * Cleans up the timer when the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /**
   * Use effect hook to initialize text track on video load.
   * Hide all text tracks, show selected track, and set subtitle state.
   * This ensures correct text track is shown on video load.
   */

  const seekTo = (e: number | number[]) => {
    setPlayed(e as number);
    if (player.current) player.current.currentTime = e as number;
  };

  const seek15s = (direction: "backward" | "forward") => {
    const newTime = direction === "forward" ? played + 15 : played - 15;
    setPlayed(newTime);
    if (player.current) player.current.currentTime = newTime;
  };

  useEffect(() => {
    const tl = duration - played;
    setTimeLeft(tl);
  }, [played, duration]);

  const playPause = () => {
    if (playing) {
      player.current?.pause();
      setPlaying(false);
    } else {
      setPlaying(!playing);
      player.current?.play();
    }
  };

  const startPIP = () => {
    if (player.current) {
      if (!document.pictureInPictureElement)
        player.current.requestPictureInPicture();
      else document.exitPictureInPicture();
    }
  };

  const changeVolume = (e: number | number[]) => {
    setVolume(e as number);
    if (player.current) player.current.volume = e as number;
  };

  const setRate = (rate: number) => {
    setPlaybackRate(rate);
    if (player.current) player.current.playbackRate = rate;
  };

  const changeQuality = (q: string) => {
    setQuality(q);
    if (player.current) {
      setSrc(sources.stream.qualities[q]?.url);
      player.current.src = sources.stream.qualities[q]?.url;
      player.current.load();

      // restore the current time
      player.current.currentTime = played;
      player.current.play();
    }
  };

  // if (fetching) {
  //   return (
  //     <div className="fc fixed z-40 h-screen w-full overflow-hidden bg-black">
  //       <Spinner />
  //     </div>
  //   );
  // }

  if (failed) {
    if (adBlocker) toast.info("Please enable ad blocker or use Brave Browser");

    return (
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        className="fc absolute bottom-0 z-40 h-full w-full justify-between overflow-hidden bg-black text-white"
      >
        <div className="fr w-full justify-start bg-black px-5 py-3">
          <div className="fr gap-2 text-xl">
            <button
              className="fr gap-1 text-white/50 transition-colors hover:text-white"
              onClick={() => setPlayerVisibility(false)}
            >
              <IoChevronBack /> <span>Back</span>
            </button>
            <p className="text-white/50">/</p>
            <h1>{"title" in result ? result.title : result.name}</h1>
          </div>
        </div>
        <iframe
          allowFullScreen={true}
          className="h-full w-full"
          src={sourceCollection[source]}
        />
        <div className="fr w-full justify-start bg-black px-5 py-3">
          <div className="fr gap-2 text-xl">
            <SourcesButton sourceCollection={sourceCollection} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.2 }}
      suppressHydrationWarning
      onMouseDown={() => setIsInteracting(true)}
      onMouseUp={() => setIsInteracting(false)}
      style={{ pointerEvents: "auto" }}
      className="player fc fixed z-40 aspect-video h-screen w-full overflow-hidden bg-black"
    >
      <MultiStepLoader />
      {src && (
        <video
          autoPlay
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          ref={player}
          onDurationChange={(
            e: React.SyntheticEvent<HTMLVideoElement, Event>,
          ) => setDuration((e.target as HTMLVideoElement).duration)}
          onTimeUpdate={(e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            if (!seeking) setPlayed(e.currentTarget.currentTime);
          }}
          muted={muted}
          controls={false}
          onLoadedData={() => {
            setLoader("vid init");
            setLoaded(true);
          }}
          onWaiting={() => setBuffering(true)}
          onSeeking={() => setSeeking(true)}
          onSeeked={() => setSeeking(false)}
          playsInline
          className="aspect-video w-full"
        >
          <source src={src as string} />
          {subtitleSources.map((source, index) => (
            <track
              key={index}
              src={source.url.split("=")[1]}
              kind="subtitles"
              srcLang={source.language}
              label={source.language}
            />
          ))}
        </video>
      )}
      <Captions currentTime={played} />

      {/* Add your overlay controls here */}
      {/* Checklist */}
      {/* - [ ] Play/Pause */}
      {/* back and forward 15s */}
      {/* - [ ] Volume */}
      {/* - [ ] Fullscreen */}
      {/* - [ ] Seekbar */}
      {/* - [ ] Time */}
      {/* - [ ] Quality */}
      {/* - [ ] PiP */}
      {/* - [ ] Playback Rate */}
      {/* - [ ] Loop */}

      {/* Control bar at the bottom */}
      {loaded && (
        <div
          onMouseMove={handleMouseMove}
          className={`fc absolute bottom-0 z-10 h-full w-full justify-between overflow-hidden text-white ${
            !isControlsVisible && "cursor-none"
          }`}
        >
          <AnimatePresence>
            {panelVisible && (
              <SettingsPanel setRate={setRate} changeQuality={changeQuality} />
            )}
            {subtitlePanelVisible && <SubtitlesPanel />}
            {episodePanelVisible && <EpisodePanel />}
            {/* if in the last minute of the video, show next episode */}
            {duration - played < 60 && <NextEpisode />}
          </AnimatePresence>

          {/* if buffering, show spinning loader */}
          {/* {buffering && (
						<div className="w-full h-full absolute bg-black/50 z-10 fc justify-center items-center text-white">
							<p>Buffering...</p>
						</div>
					)} */}
          <div
            className="absolute -z-10 h-full w-full"
            onClick={(e) => {
              if (isMobile) {
                setIsControlsVisible(!isControlsVisible);
              } else {
                playPause();
              }
            }}
            onDoubleClick={(e) => {
              const screenWidth = window.innerWidth;
              const clickPosition = e.clientX;

              if (isMobile) {
                // Check if double click is on the right or left side of the screen
                if (clickPosition <= screenWidth / 2) {
                  // back 15s
                  seek15s("backward");
                } else {
                  seek15s("forward");
                }
              } else {
                // Not a mobile device, toggle fullscreen
                if (document.fullscreenElement) document.exitFullscreen();
                document.querySelector(".player")?.requestFullscreen();
              }
            }}
          ></div>
          <AnimatePresence>
            {isControlsVisible && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="fr z-10 w-full justify-start rounded-t-2xl bg-gradient-to-b from-black to-transparent px-5 py-3"
                >
                  <div className="fr gap-2 text-xl">
                    <button
                      className="fr gap-1 text-white/50 transition-colors hover:text-white"
                      onClick={() => setPlayerVisibility(false)}
                    >
                      <IoChevronBack /> <span>Back</span>
                    </button>
                    <p className="text-white/50">/</p>
                    <h1>{"title" in result ? result.title : result.name}</h1>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="fc z-10 w-full gap-3 rounded-b-2xl bg-gradient-to-b from-transparent to-black px-5 py-3"
                >
                  {/* seek bar */}
                  <div className="fc w-full">
                    <Slider
                      size="lg"
                      classNames={{
                        base: "group cursor-pointer",
                        // for track, add a 'after' that represents the buffered part's width
                        track: `h-2 data-[thumb-hidden=false]:border-x-0 rounded-full`,
                        thumb:
                          "w-3 h-3 after:bg-white after:w-3 after:h-3 before:w-3 before:h-3",
                        filler: "h-2 rounded-l-full",
                      }}
                      onMouseDown={() => {
                        setSeeking(true);
                      }}
                      onMouseUp={() => {
                        setSeeking(false);
                      }}
                      value={played}
                      onChange={(e) => {
                        setIsInteracting(true);
                        seekTo(e);
                      }}
                      onChangeEnd={() => {
                        setIsInteracting(false);
                      }}
                      step={1}
                      aria-label="seek bar"
                      maxValue={duration}
                      color="foreground"
                    />
                    {/* <div className="w-full relative rounded-lg overflow-hidden h-4">
											<input
												id="default-range"
												type="range"
												value={played}
												className="rounded-lg appearance-none bg-white/60 h-4 w-full absolute inset-0"
												onChange={(e) => seekTo(Number(e.target.value))}
												step={1}
												min={0}
												max={duration}
											/>
										</div> */}
                  </div>

                  <div className="fr w-full justify-between gap-3">
                    {/* left controls */}
                    <div className="fr w-full gap-3">
                      <div className="fr w-full justify-start gap-2">
                        {/* back 15s */}
                        <Rewind seek15s={seek15s} />
                        {/* play btn */}
                        <PlayPause playPause={playPause} />
                        {/* forward 15s */}
                        <FastForward seek15s={seek15s} />
                        {/* Volume bar */}
                        <Volume changeVolume={changeVolume} />
                        {/* time */}
                        <Time />
                      </div>
                    </div>

                    {/* right controls */}
                    <div className="fr gap-3">
                      {/* episodes if tv */}
                      {result.media_type === "tv" && <Episodes />}
                      {/* Subtitles */}
                      <Subtitle />
                      {/* pip */}
                      <PIP startPIP={startPIP} />
                      {/* settingts */}
                      <Settings />
                      {/* full screen */}
                      <Fullscreen />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Player;

// class="flex justify-center items-center before:absolute before:w-11 before:h-11 before:rounded-full after:shadow-small after:bg-background data-[focused=true]:z-10 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 after:w-5 after:h-5 rounded-full after:rounded-full bg-foreground top-1/2 cursor-grab data-[dragging=true]:cursor-grabbing ring-transparent border-0 after:transition-all motion-reduce:after:transition-none data-[dragging=true]:after:scale-80 w-4 h-4"

/* <ReactPlayer
        suppressHydrationWarning={true}
        ref={player}
        url={src}
        onDuration={(duration) => {
          setDuration(duration);
        }}
        playbackRate={playbackRate}
        volume={volume}
        controls={false}
        pip={pip}
        onDisablePIP={() => setPip(false)}
        onEnablePIP={() => setPip(true)}
        playing={playing}
        width="100%"
        height="auto"
        muted={muted}
        onStart={() => setBuffering(false)}
        onProgress={(e) => {
          // only want to update time slider if we are not currently seeking
          if (!seeking) {
            setPlayed(e.playedSeconds);
            setBuffered(e.loadedSeconds);
            // document.querySelector('.trackfor')?.style.setProperty('--progress', `calc(${(e.loadedSeconds / duration) * 100}% + 3px)`);
          }
        }}
        onSeek={(e) => console.log(e)}
        onPlay={() => setPlaying(true)}
        onReady={() => setLoaded(true)}
        onPause={() => setPlaying(false)}
      /> */

// const [src, setSrc] = useState<string | string[] | undefined>('');
// const [playing, setPlaying] = useState(false);
// const [volume, setVolume] = useState(1);
// const [muted, setMuted] = useState(false);
// const [played, setPlayed] = useState<number>(0);
// const [loaded, setLoaded] = useState(false);
// const [duration, setDuration] = useState(0);
// const [playbackRate, setPlaybackRate] = useState(1.0);
// const [seeking, setSeeking] = useState(false);
// const [buffering, setBuffering] = useState(false);

// const [volumeVisible, setVolumeVisible] = useState(false);
// const [timedetails, setTimedetails] = useState(false);
// const [timeLeft, setTimeLeft] = useState<number | null>(null);

// const [isControlsVisible, setIsControlsVisible] = useState(true);
// const [quality, setQuality] = useState<string | number | null>(null);
// const [availableQualities, setAvailableQualities] = useState<(number | string)[]>([]);

// const [subtitle, setSubtitle] = useState('');
