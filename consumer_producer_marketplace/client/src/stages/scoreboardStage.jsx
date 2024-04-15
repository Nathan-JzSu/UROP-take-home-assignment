import React, { useMemo } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function ScoreboardStage() {
  const player = usePlayer();
  const players = usePlayers();

  // Sort players by score in descending order
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => (b.get("score") || 0) - (a.get("score") || 0));
  }, [players]);

  const handleProceed = () => {
    console.log(player.get("role"))
    player.stage.set("submit", true);
  };

  return (
    <div>
      <h2 className="text-center text-black text-2xl mb-4 uppercase tracking-wide">Leaderboard</h2>
      <table className="w-full border-collapse border-separate border-spacing-4 my-[20px] text-lg">
        <thead>
          <tr className="bg-blue-800 text-white">
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((p) => (
            <tr key={p.id} className={`border-b border-gray-300 ${p.id === player.id ? 'bg-blue-200' : ''} p-3`}>
              <td>{p.id}</td>
              <td>{p.get("role")}</td>
              <td>{p.get("score")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md" onClick={handleProceed}>Proceed to Next Round</button>
    </div>
  );
}
