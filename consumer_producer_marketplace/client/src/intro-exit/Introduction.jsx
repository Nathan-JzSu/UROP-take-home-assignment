import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div className="mt-1 sm:mt-5 p-10">
      <img src = ""/>
      <h1 className="text-lg leading-6 font-large text-gray-900" style={{ fontSize: '30px' }}>
        Marketplace Game Instructions
      </h1>
      <br/>
      <GameIntroductionText/>
      <div style={{ marginTop: '30px' }}>
        <Button handleClick={next} autoFocus>
          <p>Next</p>
        </Button>
      </div>
    </div>
  );
}

function GameIntroductionText() {
  return (
    <div className="game-introduction">
      <h2>🎉 Welcome to the Marketplace Adventure! 🌍</h2>
      <br/>
      <p>Welcome to a thrilling game of strategy and choice in the world of trade and commerce. In this game, you'll have the chance to play as either a creative <strong>Producer</strong> or a savvy <strong>Consumer</strong>.</p>

      <p><strong>Producers</strong> craft and market products, balancing quality and cost to maximize profits. <strong>Consumers</strong> seek out the best deals, evaluating advertisements and products to make smart purchases.</p>

      <p>Your decisions will shape your journey in this dynamic marketplace. Each role offers its own challenges and strategies.</p>
      <br/>
      <p>Are you ready to discover what the market holds for you? Let's dive in and find out! 🚀</p>
    </div>
  );
}