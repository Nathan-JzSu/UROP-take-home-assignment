/*
  This file contains the DeliberateStage component which is used to display the warrant summaries to the players after the feedback stage.
  producerFeedback and consumerFeedback are used to display the feedback to the producer and consumer respectively.
  handleProceed is used to submit the stage and move to the next stage.
  handleSubmit is used to submit the stage and move to the next stage.
  renderProducerFeedback is used to display the feedback to the producer.
  renderConsumerFeedback is used to display the feedback to the consumer.
  player.get("stock") is used to get the stock of the player.
  player.get("capital") is used to get the capital of the player.
  player.get("warrants") is used to get the warrants of the player.
  player.get("claims") is used to get the claims of the player.
  player.get("challenges") is used to get the challenges of the player.
  player.get("wallet") is used to get the wallet of the player.
  player.get("basket") is used to get the basket of the player.
  player.get("score") is used to get the score of the player.
  player.get("role") is used to get the role of the player.
  player.round.get("warrantPrice") is used to get the warrant price of the player.
  player.round.get("warrantAdded") is used to get the warrant added of the player.
  player.round.get("challengeAmount") is used to get the challenge amount of the player.
  player.stage.set("submit", true) is used to submit the stage and move to the next stage.
*/


import React from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";

export function DeliberateStage() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");
  const roundHook = useRound();
  const round = roundHook.get("name");
  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  const handleSubmit = () => {
    player.stage.set("submit", true);
  }

  // Producer-specific feedback
  const renderProducerFeedback = () => {
    const stock = player.get("stock");
    const tempStock = stock.find((item) => item.round === round);
    const productQuality = tempStock.productQuality;
    const productAdQuality = tempStock.productAdQuality;

    const capital = player.get("capital")

    const warrants = player.get("warrants")
    const tempWarrant = warrants.find((item) => item.round === round);
    const warrantAdded = tempWarrant.warrantAdded;
    const warrantPrice = tempWarrant.warrantPrice;
    const claims = player.get("claims")
    const tempClaim = claims.find((item) => item.round === round);
    const warrantClaim = tempClaim.claim;
    const claimStatus = tempClaim.status;


    return (
      <div style={styles.feedbackContainer}>
        <h3>
          <b>🌟 Your Warrant Summary 🌟</b>
        </h3>
        <p>
          <span role="img" aria-label="factory">
            🏭
          </span>{" "}
          You produced a <b>{productQuality}</b> quality product and advertised it
          as <b>{productAdQuality}</b> quality.
        </p>
        {!warrantAdded ? (
          <>
            <p>There was no warrant to be challenged.</p>
            <br />
            <p>
              <span role="img" aria-label="trophy">
                🏆
              </span>{" "}
              Your current score is <b>{player.get("score")}</b>.
            </p>
          </>
        ) : warrantAdded == true && claimStatus == true && warrantClaim == true ? (
          <>
            <p>
              Your warrant claim was challenged{" "}
              <span className="bg-green-700 text-white p-1 rounded-md">
                unsuccessfully!
              </span>
            </p>
            <p>
              You have been rewarded back your warrant amount, i.e. ${warrantPrice}{" "}
              back
            </p>
            <p>Your capital is ${capital}</p>
            <br />
            <p>
              <span role="img" aria-label="trophy">
                🏆
              </span>{" "}
              Your current score is <b>{player.get("score")}</b>.
            </p>
          </>
        ) : warrantAdded == true && claimStatus == true && warrantClaim == false ? (
          <>
            <p>
              Your warrant claim was challenged{" "}
              <span className="bg-red-700 text-white p-1 rounded-md">
                successfully!
              </span>
            </p>
            <p>You lose your warrant Price of ${warrantPrice}</p>
            <p>Your capital is ${capital}</p>
            <br />
            <p>
              <span role="img" aria-label="trophy">
                🏆
              </span>{" "}
              Your current score is <b>{player.get("score")}</b>.
            </p>
          </>
        ) : warrantAdded == true && claimStatus == false ? (
          <>
            <p>Your warrant was not challenged this round.</p>
            <p>
              You have been rewarded back your warrant amount, i.e. ${warrantPrice}{" "}
              back
            </p>
            <p>Your capital is ${capital}</p>
            <br />
            <p>
              <span role="img" aria-label="trophy">
                🏆
              </span>{" "}
              Your current score is <b>{player.get("score")}</b>.
            </p>
          </>
        ) : (
          <>
            <p>Your capital is ${capital}</p>
            <br />
            <p>
              <span role="img" aria-label="trophy">
                🏆
              </span>{" "}
              Your current score is <b>{player.get("score")}</b>.
            </p>
          </>
        )}
        <br />
      </div>
    );
  };

  const renderConsumerFeedback = () => {
    const challenges = player.get("challenges")
    const tempChallenge = challenges.find((item) => item.round === round);
    const challengeStatus = tempChallenge.status;
    const warrantPrice = player.round.get("warrantPrice");
    const wallet = player.get("wallet")
    const challengeSuccess = tempChallenge.challenge
    const basket = player.get("basket")
    const tempBasket = basket.find((item) => item.round === round);
    const quantity = tempBasket.quantity;
    const warrantAdded = player.round.get("warrantAdded")
    const challengeAmount = player.round.get("challengeAmount")

    return (
      <div style={styles.feedbackContainer}>
        <h3>
          <b>Your Warrant Summary</b>
        </h3>
        {quantity == 0 ? (
          <>
            <p>
              <h3>
                {" "}
                No Products bought in this round, hence no warrants were challenged.
              </h3>
            </p>
          </>
        ) : warrantAdded == true &&
          challengeStatus == true &&
          challengeSuccess == true ? (
          <>
            <p>
              Your Challenge was{" "}
              <span className="bg-green-700 text-white p-1 rounded-md">
                successful!
              </span>
            </p>
            <p>You have been rewarded ${warrantPrice}</p>
            <br />
            <p>
              <span role="img" aria-label="trophy">
                🏆
              </span>{" "}
              Your successful claim amount of (<b>${warrantPrice}</b>) is added to
              your wallet = (<b>${wallet}</b>).
            </p>
            <br />
            <p>Your current score is {player.get("score")}</p>
          </>
        ) : warrantAdded == true &&
          challengeStatus == true &&
          challengeSuccess == false ? (
          <>
            <p>
              Your Challenge was{" "}
              <span className="bg-red-700 text-white p-1 rounded-md">
                unsuccessful!
              </span>
            </p>
            <p>You have lost the challenge amount of ${challengeAmount}</p>
            <p>Your current wallet is ${wallet}.</p>
            <br />
            <p>
              <span role="img" aria-label="trophy">
                🏆
              </span>{" "}
              Your current score is <b>{player.get("score")}</b>.
            </p>
          </>
        ) : warrantAdded == true && challengeStatus == false ? (
          <>
            <p>You did not challenge the warrant!</p>
            <br />
            <p>
              <span role="img" aria-label="trophy">
                🏆
              </span>{" "}
              Your current score is <b>{player.get("score")}</b>.
            </p>
          </>
        ) : (
          <>
            <p>The product was not warranted!</p>
            <p>Your capital is ${wallet}</p>
            <br />
            <p>
              <span role="img" aria-label="trophy">
                🏆
              </span>{" "}
              Your current score is <b>{player.get("score")}</b>.
            </p>
          </>
        )}
      </div>
    );
  };

  if (!role) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.feedbackContainer}>
      <br />
      {role === "producer" && renderProducerFeedback()}
      {role === "consumer" && renderConsumerFeedback()}

      <br />
      {role === "producer" ? <button style={styles.proceedButton} onClick={handleProceed}>Proceed to next stage</button> : <button style={styles.proceedButton} onClick={handleSubmit}>Proceed to next stage</button>}
    </div>
  );
}


const styles = {
  feedbackContainer: {
    backgroundColor: '#f3f3f3', // Light grey background for the container
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    marginBottom: '20px'
  },
  proceedButton: {
    backgroundColor: '#4CAF50', // Green background as in submitButton
    color: 'white', // White text
    padding: '12px 24px', // Generous padding for better touch area
    fontSize: '16px', // Slightly larger font size
    borderRadius: '5px', // Rounded corners
    border: 'none', // Remove default border
    cursor: 'pointer', // Cursor changes to pointer to indicate it's clickable
    boxShadow: '0 4px #2e7d32', // Shadow effect for depth, darker than background
    transition: 'all 0.2s ease-in-out', // Smooth transition for hover effects

    ':hover': {
      backgroundColor: '#45a049', // Slightly lighter green when hovered
      boxShadow: '0 2px #2e7d32', // Adjust shadow for hover effect
    }
  },
  challengeButton: {
    backgroundColor: "#008CBA", // Blue background
    color: "white", // White text
    padding: "10px 20px", // Padding
    fontSize: "14px", // Font size
    borderRadius: "4px", // Rounded corners
    border: "none", // Remove default border
    cursor: "pointer", // Cursor to pointer
    boxShadow: "0 3px #005f73", // Shadow effect for depth
    transition: "all 0.2s ease", // Smooth transition for hover effects
    margin: "10px 10px", // Margin top and bottom

    ":hover": {
      backgroundColor: "#0077b6", // Slightly lighter blue when hovered
      boxShadow: "0 2px #005f73", // Adjust shadow for hover effect
    },

    ":disabled": {
      backgroundColor: "#cccccc", // Disabled state color
      cursor: "not-allowed", // Change cursor for disabled state
      boxShadow: "none",
    },
  },
};
