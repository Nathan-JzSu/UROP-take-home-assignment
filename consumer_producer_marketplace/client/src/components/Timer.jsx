import { useStageTimer } from "@empirica/core/player/classic/react";
import React from "react";

export function Timer() {
  const { remaining } = useStageTimer() || {};

  let formattedTime = remaining !== undefined ? humanTimer(Math.round(remaining / 1000)) : "--:--";
  const isAlmostFinished = remaining !== undefined && remaining <= 15000; 

  return (
    <div className={`flex flex-col items-center ${isAlmostFinished ? 'animate-pulse text-red-500' : ''}`}>
      <h1 className="tabular-nums text-3xl font-semibold">
        {formattedTime}
      </h1>
    </div>
  );
}

function humanTimer(seconds) {
  if (seconds === null || seconds === undefined) {
    return "--:--";
  }

  const s = seconds % 60;
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600);

  const formattedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return formattedTime;
}
