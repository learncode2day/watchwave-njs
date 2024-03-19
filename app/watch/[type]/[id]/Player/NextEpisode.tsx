import { useMainStore } from "@/app/store/main-state-provider";
import { useTVStore } from "@/app/store/tv-state-provider";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { IoPlayForward } from "react-icons/io5";
const NextEpisode = () => {
  const {
    nextEpisodeVisible,
    setNextEpisodeVisible,
    setEpisode,
    episode,
    season,
    setSeason,
  } = useTVStore((state) => state);
  const { result } = useMainStore((state) => state);

  const [final, setFinal] = useState(false);

  const handleNextEpisode = () => {
    // set episode to episode + 1, if last episode in season, set season to season + 1 and episode to 1
    if (episode === result.seasons[season].episodes.length) {
      if (season !== result.seasons.length - 1) {
        setSeason(season + 1);
        setEpisode(1);
      } else {
        setFinal(true);
      }
    } else {
      setEpisode(episode + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.1 }}
      className="pointer-events-none absolute inset-0 z-20"
    >
      <div className="fr pointer-events-auto absolute bottom-24 right-5 z-20 gap-4 light">
        {!final ? (
          <>
            <Button
              size="md"
              radius="sm"
              className="group h-11 font-semibold"
              onClick={handleNextEpisode}
            >
              Next Episode
              <IoPlayForward
                size={16}
                className="text-sm transition-transform duration-500 group-hover:scale-110 sm:text-base"
              />
            </Button>
            <Button
              size="md"
              radius="sm"
              className="group h-11 border-2 border-white bg-transparent text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black sm:text-base"
              onClick={() => setNextEpisodeVisible(false)}
            >
              Close
            </Button>
          </>
        ) : (
          <Button
            size="md"
            radius="sm"
            className="group h-11 bg-transparent font-semibold"
            onClick={() => setNextEpisodeVisible(false)}
          >
            Close
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default NextEpisode;
