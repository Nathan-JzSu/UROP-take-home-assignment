import React, { useState, useEffect, useMemo } from "react";

import {
  // Slider,
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react";
import { Button } from "./Button";

import "./CSS/Leaderboard.css";
import "./CSS/Modal.css";

const Leaderboard = (props) => {
  const players = usePlayers();
  const player = usePlayer();
  const stage = useStage();

  const [scores, setScores] = useState([]);

  const sortedPlayers = useMemo(() => {
    return [...players].sort(
      (prev, next) => next.get("score") - prev.get("score")
    );
  }, [players]);

  const handleProceed = () => {
    player.stage.set("submit", true);
    player.set("round", player.get("round") + 1)
  };

  useEffect(() => {
    const scoreElems = sortedPlayers.map((player) => (
      <div
        key={player.id}
        className="score-container"
        style={{
          backgroundColor: player.get("role") === "producer" ? "#DDDDDD" : "white",
        }}
      >

        <p>
          <strong>{player.get("role")}</strong>
        </p>

        <p>
          <strong>{player.get("participantIdentifier")}</strong>
        </p>

        <p style={{ color: player.get("scoreDiff") > 0 ? "green" : "red" }}>
          {player.get("score")}, {player.get("scoreDiff") > 0 ? "+" : "-"}
          {Math.abs(player.get("scoreDiff"))}
        </p>
        
      </div>
    ));
    setScores(scoreElems);
  }, [sortedPlayers]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <p className="text-xl">
            <strong>Market Leaderboard</strong>
          </p>
          <div className="score-display mt-6">{scores}</div>
          <Button
            handleClick={() => {
              if (props.setLeaderboard) props.setLeaderboard(false);
              handleProceed();
            }}
          >
            Proceed to Next Stage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
