import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { set } from "date-fns";
import { result } from "lodash";
import React from "react";
import { IoArrowDown } from "react-icons/io5";

interface Props {
  result: any;
  setSeason: any;
  setEpisode: any;
  season: number;
  set: any;
  id: number;
}

const SeasonButton = ({
  result,
  setSeason,
  setEpisode,
  season,
  set,
  id,
}: Props) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button size="sm">
          {
            // find name of current season
            result && result.seasons[season] && result.seasons[season].name
          }
          <IoArrowDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {result &&
          result.seasons.map((season, index) => (
            <DropdownItem
              key={index}
              onClick={() => {
                setSeason(index);

                // set episode to first index of the selected season
                setEpisode(result.seasons[index].episodes[0].episode_number);
                set(
                  index,
                  result.seasons[index].episodes[0].episode_number,
                  id,
                );
              }}
            >
              {season.name} •{" "}
              {!(season.episodes.length === 1) ? (
                <>{season.episodes.length} episodes</>
              ) : (
                <>1 episode</>
              )}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SeasonButton;
