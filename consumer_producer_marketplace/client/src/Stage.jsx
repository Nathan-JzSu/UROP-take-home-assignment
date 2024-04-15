import {
  usePlayer,
  usePlayers,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { SelectRolesStage } from "./stages/SelectRoleStage";
import { QualityStage } from "./stages/qualityStage";
import { ClaimsStage } from "./stages/claimsStage";
import { DeliberateStage } from "./stages/deliberateStage";
import { ChoiceStage } from "./stages/choiceStage";
import { FeedbackStage } from "./stages/feedbackStage";
import { TrialStage } from "./stages/trialStage";
import Leaderboard from "./components/Leaderboard";

export function Stage() {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();

  // Fixes Window Blank Error Screen
  // Ref. to Empirica v2 (https://docs.empirica.ly)

  // if (stage.get("name") !== "selectRoleStage" && player.stage.get("submit") == undefined) {
  //   player.stage.set("submit", true);
  //   window.location.reload(true);
  //   return <>Hello!</>
  // }
  // else

  if (player.stage.get("submit") == true) {
    if (players.length === 1) {
      return <Loading />;
    }

    return (
      <div className="text-center text-gray-400 pointer-events-none flex items-center justify-center mt-10">
        <img src="https://raw.githubusercontent.com/Neilblaze/GSOC-23/main/Interactive%20Demo/public/sumercamppulse.gif" alt="" style={{ width: 23, height: 23 }} className="mr-2" />
        Please wait for other player(s)
        <span className="inline-block">
          <span className="animate-ping inline-block w-1 h-1 rounded-full bg-gray-400 ml-1"></span>
          <span className="animate-ping inline-block w-1 h-1 rounded-full bg-gray-400 ml-1"></span>
          <span className="animate-ping inline-block w-1 h-1 rounded-full bg-gray-400 ml-1"></span>
        </span>
    </div>
    );
  }

  switch (stage.get("name")) {
    case "selectRoleStage":
      return <SelectRolesStage />;
    case "stockStage":
      return <TrialStage />;
    case "choiceStage":
      return <ChoiceStage />;
    case "feedbackStage":
      return <FeedbackStage />;
    case "scoreboardStage":
      return <Leaderboard />;
    default:
      return <Loading />;
  }
}
