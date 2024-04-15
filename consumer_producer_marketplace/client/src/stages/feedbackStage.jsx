/*
    This file contains the feedback stage for the consumer and producer roles.
    ConsumerFeedbackCard is used to display the feedback to the consumer.
    ProducerFeedbackCard is used to display the feedback to the producer.
    handleButtonClick is used to handle the button click.
    handleClaims is used to handle the claims.
    handleChallenges is used to handle the challenges.
    getQualityMatchEmoji is used to get the quality match emoji.
    player.get("role") is used to get the role of the player.
    player.get("wallet") is used to get the wallet of the consumer.
    player.get("challenges") is used to get the challenges of the consumer.
    player.get("claims") is used to get the claims of the producer.
    player.get("score") is used to get the score of the player.
    player.round.set("challengeAmount", challengeAmount) is used to set the challenge amount of the consumer.
    player.set("wallet", wallet) is used to set the wallet of the consumer.
    player.set("challenges", challenges) is used to set the challenges of the consumer.
    player.set("claims", claims) is used to set the claims of the producer.
    player.set("basket", basket) is used to set the basket of the consumer.
    player.stage.set("submit", true) is used to submit the stage and move to the next stage.
*/


import React, { useState } from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import { toast } from "react-toastify";

// ConsumerFeedbackCard is used to display the feedback to the consumer.
// function ConsumerFeedbackCard({ producer, player, index, basket, round, wallet }) {
//     const productAdQuality = basket.find((item) => item.producerID === producer.id && item.round === round).productAdQuality;
//     const productQuality = basket.find((item) => item.producerID === producer.id && item.round === round).productQuality;
//     const quantity = basket.find((item) => item.producerID === producer.id && item.round === round).quantity;


//     const getQualityMatchEmoji = (productAdQuality, productQuality) => {
//         // This function returns an emoji based on the match between advertised and actual quality
//         if (productAdQuality === productQuality) {
//             return '👍'; // Thumbs up for a match
//         } else if (productAdQuality === "high" && productQuality === "low") {
//             return '😠'; // Angry for high advertised but low actual quality
//         } else if (productAdQuality === "low" && productQuality === "high") {
//             return '🤔'; // Thinking for low advertised but high actual quality
//         } else {
//             return '❓'; // Question mark for any other case
//         }
//     };

//     const emoji = getQualityMatchEmoji(productAdQuality, productQuality);
//     return (
//         <div className="text-lg font-base mt-2">
//             {productAdQuality === productQuality
//                 ? showPopup(
//                     `You bought a ${productQuality} quality product as advertised!`,
//                     "green"
//                 )
//                 : showPopup(
//                     "You got cheated! The product was not of the advertised quality.",
//                     "red"
//                 )
//             }
//             <div style={{ fontFamily: "Archivo" }}>
//                 <p><b className="text-gray-700">👨‍💼 Producer: </b>  {producer.id}</p>
//                 <p><b className="text-gray-700">📦 Units Bought: </b>  {quantity}</p>
//                 <p><b className="text-gray-700">🛃 Advertised Quality was:</b> {productAdQuality.charAt(0).toUpperCase() + productAdQuality.slice(1)} </p>
//                 <p><b className="text-gray-700">✅ Real Product Quality was:</b> {productQuality.charAt(0).toUpperCase() + productQuality.slice(1)} {emoji}</p>
//                 <p><b className="text-gray-700">💰 Remaining Capital in Wallet:</b> {wallet} </p>
//             </div>
//             <br />
//             <p className="mb-6"><span role="img" aria-label="trophy">🏆</span> You get points equal to your utility score = <b>{player.get("score")}</b></p>
//         </div>
//     );
// }

const showPopup = (message, color) => {
    return (
        <div className={`p-4 text-white ${color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}>
            <strong>{message}</strong>
        </div>
    );
};

export function FeedbackStage() {
    const player = usePlayer();
    // const players = usePlayers();
    const role = player.get("role");
    const roundHook = useRound();
    const round = roundHook.get("name");

    // if (role === "consumer") {
    //     const [clicked, setClicked] = useState(false);
    //     const wallet = player.get("wallet");

    //     const handleSubmit = (basket) => {
    //         player.set("basket", basket);
    //         player.stage.set("submit", true);
    //     }


    //     const getAllUniqueItems = (basket) => {
    //         const uniqueItems = [];
    //         const itemOccurrences = {};

    //         basket.forEach(item => {
    //             const roundNo = item.round;

    //             if (itemOccurrences[roundNo]) {
    //                 itemOccurrences[roundNo]++;
    //             } else {
    //                 itemOccurrences[roundNo] = 1;
    //             }

    //             if (itemOccurrences[roundNo] === 1) {
    //                 uniqueItems.push(item);
    //             }
    //         });

    //         return uniqueItems;
    //     };

    //     const basket = getAllUniqueItems(player.get("basket"));


    //     return (
    //         <div className="bg-gradient-to-r from-slate-100 to-blue-50 mt-10 p-4 rounded-lg shadow-md mb-8 flex justify-center items-center flex flex-col text-center max-w-[700px]">
    //             <h2 className="text-2xl font-bold mt-2 mb-6"><b>🛒 Your Consumer Summary 🛒</b></h2>
    //             <div className={clicked ? `hidden` : `mb-8 bg-white shadow-md text-center mx-auto my-auto w-full h-full p-6 rounded-lg max-w-[550px] border-8 border-gray-100`}>
    //                 <h2>Get ready to review your purchase summary for the products you've bought this round.
    //                     Take a moment to check your order details! 🛍️</h2> <br />

    //                 <div className="relative">
    //                     <span className="absolute right-40 z-10 mt-[-8px] mr-[-8px]">
    //                         <span className="relative flex h-4 w-4">
    //                             <span className="top-9 animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
    //                             <span className="relative top-9 inline-flex rounded-full h-4 w-4 bg-green-500"></span>
    //                         </span>
    //                     </span>
    //                     <button
    //                         className="mt-8 mb-3 bg-blue-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md disabled:opacity-100 disabled:cursor-not-allowed relative"
    //                         onClick={() => {
    //                             setClicked(!clicked);
    //                         }}
    //                         disabled={clicked}
    //                     >
    //                         Are You Ready!
    //                     </button>
    //                 </div>
    //             </div>

    //             {clicked && players.filter((p) => p.get("role") === "producer").map((producer, index) => {
    //                 return <ConsumerFeedbackCard
    //                     key={index}
    //                     producer={producer}
    //                     player={player}
    //                     index={index}
    //                     basket={basket}
    //                     round={round}
    //                     wallet={wallet}
    //                 />
    //             })}

    //             <br />
    //             <button
    //                 className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md"
    //                 onClick={() => handleSubmit(basket)}
    //             >
    //                 Proceed to Next Stage
    //             </button>
    //         </div>
    //     );
    // }

    // else if (!role) {
    //     return <div>Loading...</div>;
    // }

    // else 
    if (role === "producer") {
        const handleProceed = () => {
            player.stage.set("submit", true);
        };

        const renderProducerFeedback = () => {

            const stock = player.get("stock")
            const productQuality = stock.find((item) => item.round === round).productQuality;
            const productAdQuality = stock.find((item) => item.round === round).productAdQuality;
            const productPrice = stock.find((item) => item.round === round).productPrice;
            const productCost = stock.find((item) => item.round === round).productCost;
            const capital = player.get("capital")
            const soldStock = stock.find((item) => item.round === round).soldStock;
            const initialStock = stock.find((item) => item.round === round).initialStock;
            const profit = soldStock * productPrice - (initialStock * productCost);

            return (
                <div className="text-center p-4 bg-white rounded-lg shadow-md max-w-[600px] mx-auto border-8 border-gray-100">
                    <h2 className="text-2xl mb-6 font-semibold flex items-center justify-center">
                        <img src="https://i.pinimg.com/originals/8f/9f/76/8f9f76391315ee0b33d9b17981ee8ce0.gif" alt="timer" className="w-6 h-6 mr-2" />
                        Producer Summary
                        <img src="https://i.pinimg.com/originals/8f/9f/76/8f9f76391315ee0b33d9b17981ee8ce0.gif" alt="timer" className="w-6 h-6 ml-2" />
                    </h2>
                    <hr className="border-t border-gray-300 my-4" />
                    {
                        soldStock > 0
                            ? showPopup(
                                `Your strategy worked! You sold ${soldStock} products to make a profit of $${profit.toFixed(2)}`,
                                "green"
                            )
                            : showPopup("Your strategy failed! You sold no products.", "red")
                    }
                    <div className="mt-6">
                        <p><span role="img" aria-label="factory">🏭</span> You produced {initialStock} <b>{productQuality.charAt(0).toUpperCase() + productQuality.slice(1)}</b> quality products and advertised it as <b>{productAdQuality.charAt(0).toUpperCase() + productAdQuality.slice(1)}</b> quality!</p>
                        <p><span role="img" aria-label="shopping-cart">🛒</span> Consumers bought <b>{soldStock}</b> unit(s) of your product at <b>${productPrice}</b> each!</p>
                        <p><span role="img" aria-label="money-bag">💰</span> This resulted in a total profit of: <b>${profit.toFixed(2)}</b></p>
                        <br />
                        <p><span role="img" aria-label="trophy">🏆</span> Your score this round is your profits (<b>${profit}</b>).</p>
                        <br />
                        <p className="text-lg" style={{ fontFamily: "'Archivo', sans-serif" }}>Your unused capital is: <b>${capital}</b></p>
                    </div>
                </div>
            );
        };
        return (
            <div className="text-center mt-8 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-md max-w-[700px] mx-auto my-4">
                <br />
                {renderProducerFeedback()}
                <br />
                <button className="mb-4 mt-1 bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md" onClick={handleProceed}>Proceed to next stage</button>
            </div>
        );
    }
    else {
        return (
            <div>
                <h1>Feedback Stage</h1>
            </div>
        );
    }
};
