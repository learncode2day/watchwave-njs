import { useSubtitlesStore } from "@/app/store/subtitles-state-provider";
import { useEffect } from "react";
// Parse VTT string into subtitle cues

// Convert time string (HH:MM:SS.sss) to seconds

const Captions = ({ currentTime }: { currentTime: number }) => {
  const { background, bottom, color, fontSize, off, subtitle, timeOffset } =
    useSubtitlesStore((state) => state);

  useEffect(() => {
    // print current subtitle if currentTime is between start and end time
    subtitle &&
      subtitle.map((sub, i) => {
        if (currentTime >= sub.start && currentTime <= sub.end) {
          // console.log(sub.text);
        }
      });
  }, [currentTime]);

  return (
    <div className="fr absolute bottom-0 left-0 right-0 px-10 text-center">
      {subtitle &&
        subtitle.map((sub) =>
          currentTime >= sub.start + timeOffset &&
          currentTime <= sub.end + timeOffset &&
          !off ? (
            <p
              key={sub.start}
              className="absolute rounded-lg px-2 py-1"
              style={{
                background: `rgba(0,0,0, ${background})`,
                // iff controls visible add 80px to bottom, else add 0
                bottom: `calc(${bottom.toString()}px + 80px)`,
                color: color,
                fontSize: fontSize + "px",
              }}
              dangerouslySetInnerHTML={{ __html: sub.text }}
            ></p>
          ) : null,
        )}
    </div>
  );
};

export default Captions;
