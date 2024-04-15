import React, { useState } from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";
import Leaderboard from "../components/Leaderboard";

export function SalesResults() {
  const player = usePlayer();
  const [leaderboard, setLeaderboard] = useState(false);
  const [productionQuality, advertisementQuality, priceOfProduct, productionCost] = player.get("round1choice");
  const imageUrl = advertisementQuality === "high" ? "/images/toothpaseamazing.jpg" : "/images/toothpastestandard.jpg";

  const currentScore = player.get("score") || 0;
  const numBuyers = Math.floor(Math.random() * (90 - 10) + 10);
  const salesCount = numBuyers * (priceOfProduct - productionCost);
  const finalScore = currentScore + salesCount;

  const handleSubmit = () => {
    console.log("Moving on from results round");
    player.stage.set("submit", true);
    player.set("score", finalScore);
  };

  return (
    <>
      {leaderboard && <Leaderboard setLeaderboard={setLeaderboard} />}
      <div className="mt-3 sm:mt-5 p-20">
        <h1 className="text-lg leading-6 font-medium text-gray-900">Sales</h1>
        <div className="text-lg mt-2 mb-6">
          <p>You chose to produce a <b>{productionQuality}</b> quality product.</p>
          <p>
            You chose to advertise it as a <b>{advertisementQuality}</b> quality product.
            <br />
            You sold it at a price of <b>${priceOfProduct}</b>.
          </p>
          <img
            src={imageUrl}
            alt={advertisementQuality === "high" ? "Toothpaste Amazing" : "Toothpaste Standard"}
            style={{ filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.3))' }}
            width="250"
            height="250"
          />
          <p>
            It was advertised to an audience of 100 users, and {numBuyers} users bought your product.
            <br />
            You earned ${priceOfProduct - productionCost} per product x {numBuyers} units sold = {salesCount} points in sales.
          </p>
          <p>Your score for this round is: {salesCount}</p>
          <p>Your total score is: {finalScore}</p>
          <p>Click to proceed to the next round to sell products in this marketplace.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button handleClick={handleSubmit} primary>
            I'm done!
          </Button>
          <Button handleClick={() => setLeaderboard(true)}>
            View leaderboard
          </Button>
        </div>
      </div>
    </>
  );
}
