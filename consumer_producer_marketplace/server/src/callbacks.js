import { ClassicListenersCollector } from "@empirica/core/admin/classic";
// import { getconsumerAgentFromId } from "../../client/src/strategie/ConsumerAgent.js"

export const Empirica = new ClassicListenersCollector();

const fs = require('fs');
const path = require('path');

const folderPath = '/';
const fileName = 'choices_consumer.json';
const filePath = path.join(folderPath, fileName);

// function appendObjectToJSON(newObject) {
//   // Check if the folder exists
//   fs.access(folderPath, fs.constants.F_OK, (err) => {
//     if (err) {
//       // Folder doesn't exist, create it
//       fs.mkdir(folderPath, { recursive: true }, (err) => {
//         if (err) {
//           console.error('Error creating folder:', err);
//         } else {
//           console.log('Folder created successfully!');
//           createFileAndAppend(newObject);
//         }
//       });
//     } else {
//       // Folder exists, proceed to create file and append
//       createFileAndAppend(newObject);
//     }
//   });
// }

// function createFileAndAppend(newObject) {
//   // Check if the file exists
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       // File doesn't exist, create it with initial structure
//       const initialData = { dataList: [] };
//       writeToFile(initialData, newObject);
//     } else {
//       // File exists, proceed to read and append
//       readFileAndAppend(newObject);
//     }
//   });
// }

// function readFileAndAppend(newObject) {
//   // Read the existing JSON file
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading JSON file:', err);
//       return;
//     }

//     try {
//       // Parse JSON content
//       const jsonData = JSON.parse(data);

//       // Modify the object (assuming it's an array called 'dataList')
//       jsonData.dataList.push(newObject);

//       // Write back to the JSON file
//       writeToFile(jsonData, newObject);
//     } catch (parseError) {
//       console.error('Error parsing JSON:', parseError);
//     }
//   });
// }

// function writeToFile(data, newObject) {
//   // Convert data to JSON
//   const updatedJson = JSON.stringify(data, null, 2);

//   // Write back to the JSON file
//   fs.writeFile(filePath, updatedJson, 'utf8', (err) => {
//     if (err) {
//       console.error('Error writing to JSON file:', err);
//     } else {
//       console.log('Object appended successfully!');
//     }
//   });
// }

// Function to update the score of consumers
async function updateConsumerScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "consumer") return;
    const basket = player.get("basket");
    const wallet = player.get("wallet");
    const round = player.round.get("round")
    const originalScore = player.get("score") || 0;
    let score = player.get("score") || 0;
    basket.forEach((item) => {
      if (item.round === round) {
        score += (item.value - item.productPrice) * item.quantity;
      }
    });
    player.set("score", score);
    player.set("scoreDiff", score - originalScore);
  });
}

// Function to update the score of producers
async function updateProducerScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "producer") return;
    const round = player.round.get("round");
    const capital = player.get("capital");
    const tempStock = player.get("stock");
    const currentStock = tempStock.find((item) => item.round === round);
    const remainingStock = currentStock.remainingStock;
    const wallet = player.get("wallet");
    const productPrice = currentStock.productPrice;
    const productCost = currentStock.productCost;
    const productQuality = currentStock.productQuality
    const productAdQuality = currentStock.productAdQuality
    const initialStock = currentStock.initialStock;
    const value = currentStock.value;
    const agents = game.get("agents");

    const consumerAgent = agents.find(p => {
      return p.role === "consumer" && p.agent === "artificial"
    })
    const others = agents.filter(p => {
      return p.role !== "consumer" || p.agent !== "artificial"
    })

    // const strategy = getconsumerAgentFromId(consumerAgent.strategy);
    const roundNum = parseInt(round.replace("Round", ""), 10);
    if (consumerAgent.strategy == "gullible") {
      let wallet = consumerAgent.wallet;
      const mockQuantity = parseInt(wallet / productPrice);
      const soldStock = mockQuantity <= remainingStock ? mockQuantity : remainingStock
      if (soldStock == 0) {
        const totalCost = initialStock * productCost;
        const totalSales = soldStock * productPrice;
        const originalScore = player.get("score") || 0;
        let score = player.get("score") || 0;
        score += (totalSales - totalCost);
        consumerAgent.purchaseHistory.push({
          productQuality: productQuality,
          productAdQuality: productAdQuality,
          quantity: 0,
          round: round,
          roundNum: roundNum,
        });
        let consumerScore = consumerAgent.score;
        consumerAgent.scores.push({
          score: consumerScore,
          round: round,
          roundNum: roundNum
        });
        others.forEach(producerAgent => {
          producerAgent.scores.push({
            score: score,
            round: round,
            roundNum: roundNum
          });
          producerAgent.productionHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            initialStock: initialStock,
            remainingStock: remainingStock,
            soldStock: soldStock,
            round: round,
            roundNum: roundNum
          })
        });
        let cheated = productAdQuality === productQuality ? false : productAdQuality === "low" && productQuality === "high" ? false : true
        consumerAgent.cheatedHistory.push(cheated)
        player.set("score", score);
        player.set("scoreDiff", score - originalScore);
        player.set("capital", capital + totalSales);
      }
      else {
        const trialStock = tempStock.map((item) => {
          return item.round === round
            ? {
              ...item,
              remainingStock: item.remainingStock - soldStock,
              soldStock: item.soldStock + soldStock,
            }
            : item;
        });

        player.set("stock", trialStock);
        const totalCost = initialStock * productCost;
        const totalSales = soldStock * productPrice;
        const originalScore = player.get("score") || 0;
        let score = player.get("score") || 0;
        score += (totalSales - totalCost);

        consumerAgent.purchaseHistory.push({
          productQuality: productQuality,
          productAdQuality: productAdQuality,
          quantity: soldStock,
          round: round,
          roundNum: roundNum,
        });
        let consumerScore = consumerAgent.score;
        consumerScore = (value - productPrice) * soldStock;
        consumerAgent.score = consumerScore;
        consumerAgent.scores.push({
          score: consumerScore,
          round: round,
          roundNum: roundNum
        });
        let cheated = productAdQuality === productQuality ? false : productAdQuality === "low" && productQuality === "high" ? false : true
        consumerAgent.cheatedHistory.push(cheated)
        others.forEach(producerAgent => {
          producerAgent.scores.push({
            score: score,
            round: round,
            roundNum: roundNum
          });
          producerAgent.productionHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            initialStock: initialStock,
            remainingStock: remainingStock,
            soldStock: soldStock,
            round: round,
            roundNum: roundNum
          })
        });
        wallet = wallet - parseInt(productPrice * soldStock);
        consumerAgent.wallet = wallet;
        player.set("score", score);
        player.set("scoreDiff", score - originalScore);
        player.set("capital", capital + totalSales);
      }
      others.push(consumerAgent);
      console.log(others);
      game.set("agents", others);
    }
    else if (consumerAgent.strategy == "titfortat") {
      if (roundNum == 1) {
        let wallet = consumerAgent.wallet;
        const mockQuantity = parseInt(wallet / productPrice);
        const soldStock = mockQuantity <= remainingStock ? mockQuantity : remainingStock
        if (soldStock == 0) {
          const totalCost = initialStock * productCost;
          const totalSales = soldStock * productPrice;
          const originalScore = player.get("score") || 0;
          let score = player.get("score") || 0;
          score += (totalSales - totalCost);
          consumerAgent.purchaseHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            quantity: 0,
            round: round,
            roundNum: roundNum,
          });
          let consumerScore = consumerAgent.score;
          consumerAgent.scores.push({
            score: consumerScore,
            round: round,
            roundNum: roundNum
          });
          others.forEach(producerAgent => {
            producerAgent.scores.push({
              score: score,
              round: round,
              roundNum: roundNum
            });
            producerAgent.productionHistory.push({
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              initialStock: initialStock,
              remainingStock: remainingStock,
              soldStock: soldStock,
              round: round,
              roundNum: roundNum
            })
          });
          let cheated = productAdQuality === productQuality ? false : productAdQuality === "low" && productQuality === "high" ? false : true
          consumerAgent.cheatedHistory.push(cheated)
          player.set("score", score);
          player.set("scoreDiff", score - originalScore);
          player.set("capital", capital + totalSales);
        }
        else {
          const trialStock = tempStock.map((item) => {
            return item.round === round
              ? {
                ...item,
                remainingStock: item.remainingStock - soldStock,
                soldStock: item.soldStock + soldStock,
              }
              : item;
          });

          player.set("stock", trialStock);
          const totalCost = initialStock * productCost;
          const totalSales = soldStock * productPrice;
          const originalScore = player.get("score") || 0;
          let score = player.get("score") || 0;
          score += (totalSales - totalCost);

          consumerAgent.purchaseHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            quantity: soldStock,
            round: round,
            roundNum: roundNum,
          });
          let consumerScore = consumerAgent.score;
          consumerScore = (value - productPrice) * soldStock;
          consumerAgent.score = consumerScore;
          consumerAgent.scores.push({
            score: consumerScore,
            round: round,
            roundNum: roundNum
          });
          others.forEach(producerAgent => {
            producerAgent.scores.push({
              score: score,
              round: round,
              roundNum: roundNum
            });
            producerAgent.productionHistory.push({
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              initialStock: initialStock,
              remainingStock: remainingStock,
              soldStock: soldStock,
              round: round,
              roundNum: roundNum
            })
          });
          let cheated = productAdQuality === productQuality ? false : productAdQuality === "low" && productQuality === "high" ? false : true
          consumerAgent.cheatedHistory.push(cheated)
          wallet = wallet - parseInt(productPrice * soldStock);
          consumerAgent.wallet = wallet;
          player.set("score", score);
          player.set("scoreDiff", score - originalScore);
          player.set("capital", capital + totalSales);
        }
      }
      else if (roundNum > 1 && consumerAgent.cheatedHistory[roundNum-2] == false) {
        let wallet = consumerAgent.wallet;
        const mockQuantity = parseInt(wallet / productPrice);
        const soldStock = mockQuantity <= remainingStock ? mockQuantity : remainingStock
        if (soldStock == 0) {
          const totalCost = initialStock * productCost;
          const totalSales = soldStock * productPrice;
          const originalScore = player.get("score") || 0;
          let score = player.get("score") || 0;
          score += (totalSales - totalCost);
          consumerAgent.purchaseHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            quantity: 0,
            round: round,
            roundNum: roundNum,
          });
          let consumerScore = consumerAgent.score;
          consumerAgent.scores.push({
            score: consumerScore,
            round: round,
            roundNum: roundNum
          });
          others.forEach(producerAgent => {
            producerAgent.scores.push({
              score: score,
              round: round,
              roundNum: roundNum
            });
            producerAgent.productionHistory.push({
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              initialStock: initialStock,
              remainingStock: remainingStock,
              soldStock: soldStock,
              round: round,
              roundNum: roundNum
            })
          });
          let cheated = productAdQuality === productQuality ? false : productAdQuality === "low" && productQuality === "high" ? false : true
          consumerAgent.cheatedHistory.push(cheated)
          player.set("score", score);
          player.set("scoreDiff", score - originalScore);
          player.set("capital", capital + totalSales);
        }
        else {
          const trialStock = tempStock.map((item) => {
            return item.round === round
              ? {
                ...item,
                remainingStock: item.remainingStock - soldStock,
                soldStock: item.soldStock + soldStock,
              }
              : item;
          });

          player.set("stock", trialStock);
          const totalCost = initialStock * productCost;
          const totalSales = soldStock * productPrice;
          const originalScore = player.get("score") || 0;
          let score = player.get("score") || 0;
          score += (totalSales - totalCost);

          consumerAgent.purchaseHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            quantity: soldStock,
            round: round,
            roundNum: roundNum,
          });
          let consumerScore = consumerAgent.score;
          consumerScore = (value - productPrice) * soldStock;
          consumerAgent.score = consumerScore;
          consumerAgent.scores.push({
            score: consumerScore,
            round: round,
            roundNum: roundNum
          });
          others.forEach(producerAgent => {
            producerAgent.scores.push({
              score: score,
              round: round,
              roundNum: roundNum
            });
            producerAgent.productionHistory.push({
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              initialStock: initialStock,
              remainingStock: remainingStock,
              soldStock: soldStock,
              round: round,
              roundNum: roundNum
            })
          });
          let cheated = productAdQuality === productQuality ? false : productAdQuality === "low" && productQuality === "high" ? false : true
          consumerAgent.cheatedHistory.push(cheated)
          wallet = wallet - parseInt(productPrice * soldStock);
          consumerAgent.wallet = wallet;
          player.set("score", score);
          player.set("scoreDiff", score - originalScore);
          player.set("capital", capital + totalSales);
        }
      }
      else if (roundNum > 1 && consumerAgent.cheatedHistory[roundNum-2] == true) {
        let wallet = consumerAgent.wallet;
        const soldStock = 0;
        const totalCost = initialStock * productCost;
        const totalSales = soldStock * productPrice;
        const originalScore = player.get("score") || 0;
        let score = player.get("score") || 0;
        score += (totalSales - totalCost);
        consumerAgent.purchaseHistory.push({
          productQuality: productQuality,
          productAdQuality: productAdQuality,
          quantity: 0,
          round: round,
          roundNum: roundNum,
        });
        let consumerScore = consumerAgent.score;
        consumerAgent.scores.push({
          score: consumerScore,
          round: round,
          roundNum: roundNum
        });
        others.forEach(producerAgent => {
          producerAgent.scores.push({
            score: score,
            round: round,
            roundNum: roundNum
          });
          producerAgent.productionHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            initialStock: initialStock,
            remainingStock: remainingStock,
            soldStock: soldStock,
            round: round,
            roundNum: roundNum
          })
        });
        let cheated = productAdQuality === productQuality ? false : productAdQuality === "low" && productQuality === "high" ? false : true
        consumerAgent.cheatedHistory.push(cheated)
        player.set("score", score);
        player.set("scoreDiff", score - originalScore);
        player.set("capital", capital + totalSales);
      }
      others.push(consumerAgent);
      console.log(others);
      game.set("agents", others);
    }
    else if (consumerAgent.strategy == "nocheat2") {
      // console.log("Consumer strategy: nocheat2")
      const roundNum = parseInt(round.replace("Round", ""), 10);
      // Check if cheating occurred in the first two rounds
      // If cheating occurred in the first two rounds, stop buying products forever
      let cheated = productAdQuality === productQuality ? false : productAdQuality === "low" && productQuality === "high" ? false : true
      consumerAgent.cheatedHistory.push(cheated);
      console.log("roundNum: ", roundNum);
      console.log("cheat status at round", roundNum, consumerAgent.cheatedHistory[roundNum - 1]);
      if ((roundNum >= 1 && consumerAgent.cheatedHistory[0] === true) || (roundNum >= 2 && consumerAgent.cheatedHistory[1] === true)) {
        console.log("Consumer stops buying due to early cheating.");
        // No transaction happens
      } else {
        // If no cheating occurred in the first two rounds, buy as much as possible
        console.log("Consumer buys as much as possible after no early cheating.");
        let wallet = consumerAgent.wallet;
        const mockQuantity = parseInt(wallet / productPrice);
        const soldStock = mockQuantity <= remainingStock ? mockQuantity : remainingStock;
        console.log("Wallet: ", wallet, "Product price: ", productPrice, "Remaining stock: ", remainingStock, "Sold stock: ", soldStock);
        if (soldStock > 0) {
          const totalCost = soldStock * productCost;
          const totalSales = soldStock * productPrice;
          const scoreIncrease = totalSales - totalCost;
    
          // Modify stock and wallet
          const trialStock = tempStock.map(item => item.round === round ? { ...item, remainingStock: item.remainingStock - soldStock, soldStock: item.soldStock + soldStock } : item);
          player.set("stock", trialStock);
          wallet -= productPrice * soldStock;
          consumerAgent.wallet = wallet;
    
          // Update consumer purchase history
          consumerAgent.purchaseHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            quantity: soldStock,
            round: round,
            roundNum: roundNum,
          });
    
          // Update scores
          let consumerScore = consumerAgent.score;
          consumerScore += scoreIncrease;
          consumerAgent.score = consumerScore;
          consumerAgent.scores.push({
            score: consumerScore,
            round: round,
            roundNum: roundNum
          });
    
          // Record score
          const originalScore = player.get("score") || 0;
          let score = originalScore + scoreIncrease;
          player.set("score", score);
          player.set("scoreDiff", score - originalScore);
          player.set("capital", capital + totalSales);
        }
      }
      game.set("agents", others.concat(consumerAgent));
    }       
  });
}

// Function to assign roles to players
function assignRoles(game) {
  const treatment = game.get("treatment");
  const producerPercentage = treatment.producerPercentage;
  const players = game.players;
  const numberOfProducers = Math.round(producerPercentage * players.length);

  const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
  shuffledPlayers.forEach((player, index) => {
    // const role = index < numberOfProducers ? "producer" : "consumer";
    const role = "producer"
    player.set("role", role);
  });
}

Empirica.onGameStart(async ({ game }) => {
  // TODO: Remove hardcoded values
  const numRounds = 5;
  for (let roundNumber = 1; roundNumber <= numRounds; roundNumber++) {
    const round = game.addRound({ name: `Round${roundNumber}` });
    round.addStage({ name: "selectRoleStage", duration: 24000 });
    round.addStage({ name: "stockStage", duration: 24000 });
    // round.addStage({ name: "choiceStage", duration: 24000 });
    round.addStage({ name: "feedbackStage", duration: 24000 });
    round.addStage({ name: "scoreboardStage", duration: 24000 });
  }

  game.players.forEach((player) => {
    player.set("score", 0);
  });
  assignRoles(game);
});

// Empirica.onStageStart(({ stage }) => {
//   switch(stage.get("name")) {

//   }
// })

Empirica.onStageEnded(({ stage }) => {
  switch (stage.get("name")) {
    // case "choiceStage":
    //   updateProducerScores(stage.currentGame);
    //   updateConsumerScores(stage.currentGame);
    //   break;
    case "stockStage":
      updateProducerScores(stage.currentGame);
      break;
  }
});

Empirica.onGameEnded(({ game }) => { });
