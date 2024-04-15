/*
players will be asked to choose the quality of the product they want to produce.
player.get("role") is used to fetch the role of the player.
player.round.set("productQuality", productQuality) is used to set the quality of the product for the producer.
player.round.set("productCost", productCost) is used to set the cost of the product for the producer.
player.round.set("productImage", productImage) is used to set the image of the product for the producer.
player.round.set("productName", productName) is used to set the name of the product for the producer.
player.round.set("productID", id) is used to set the id of the product for the producer.
player.stage.set("submit", true) is used to set the stage of each player to submit.
*/

import React, { useState } from "react";
import { usePlayer, useRound } from "@empirica/core/player/classic/react";
import { PayoffMatrix } from "../components/PayoffMatrix";
import { products } from "../../constant";
import { toast } from "react-toastify";

export function TrialStage() {
    const player = usePlayer();
    const role = player.get("role");
    const roundHook = useRound();
    const round = roundHook.get("name");

    if (role === "producer") {
        let [selectedProduct, _] = useState(getRandomProduct());
        let { low, high, id, category } = selectedProduct;
        let brandName = player.round.get("brandName");

        let [productQuality, setProductQuality] = useState("");
        let [productAdQuality, setProductAdQuality] = useState("");
        
        const backgroundColor = productQuality === "low" ? "#FA6B84" : "#00CDBB";
        const backgroundColorAd = productAdQuality === "low" ? "#FA6B84" : "#00CDBB";

        let [productCost, setProductCost] = useState(0);
        let [productImage, setProductImage] = useState("");
        let [productName, setProductName] = useState("");
        let [productID, setProductID] = useState(-1);
        let [capital, setCapital] = useState(player.get("capital"));
        let [productPrice, setProductPrice] = useState(0);

        let [productAdImage, setProductAdImage] = useState("");
        let [productAdName, setProductAdName] = useState("");
        let [value, setValue] = useState(0);
        let [profit, setProfit] = useState(0);
        let stock = player.get("stock") || [];
        let [updatedStock, setUpdatedStock] = useState({});
        let [tempStock, setTempStock] = useState(0);

        

        function adjSelector() {
            /*
            This function returns a string that is a combination of the base producer name and an adjective
            */
            const adjPos = ["excellent", "premium", "superior", "legendary"];
            const adjNeg = ["expired", "weak", "obsolete", "cheap", "crappy"];
            const chosenAdj =
                productAdQuality === "high"
                    ? adjPos[Math.floor(Math.random() * adjPos.length)]
                    : adjNeg[Math.floor(Math.random() * adjNeg.length)];
            return `${brandName} ${productAdName}'s ${chosenAdj} ${category}`;
        }

        const decrementQuantity = () => {
            /*
            This function decrements the stock of the player by 1 and increments the capital by the product cost
            */
            if (tempStock > 0) {
                setUpdatedStock({
                    ...updatedStock,
                    producerID: player.id,
                    productID: productID,
                    productIdentifier: adjSelector(),
                    productQuality: productQuality,
                    productAdQuality: productAdQuality,
                    productCost: productCost,
                    productPrice: productPrice,
                    productAdImage: productAdImage,
                    value: value,
                    initialStock: tempStock - 1,
                    remainingStock: tempStock - 1,
                });
                setCapital(Number(capital) + Number(productCost));
                setTempStock(tempStock - 1);

            }
        };


        const incrementQuantity = () => {
            /*
            This function increments the stock of the player by 1 and decrements the capital by the product cost
            */
            if (capital - productCost >= 0) {
                setUpdatedStock({
                    ...updatedStock,
                    producerID: player.id,
                    productID: productID,
                    productIdentifier: adjSelector(),
                    productQuality: productQuality,
                    productAdQuality: productAdQuality,
                    productCost: productCost,
                    productPrice: productPrice,
                    productAdImage: productAdImage,
                    value: value,
                    initialStock: updatedStock.remainingStock + 1,
                    remainingStock: updatedStock.remainingStock + 1,
                });
                setTempStock(tempStock + 1);
                setCapital(Number(capital) - Number(productCost));
            }
        };

        function handleSubmit() {
            /*
            handleSubmit() is used to handle the submit button click. It sets the product quality, cost, image, name, and id for the producer's product. It also sets the stage of each player to submit.
            */
            if (role === "producer") {
                if (productQuality === "") {
                    toast.error("Please select a product quality to produce first!");
                } else if (
                    productAdQuality === "") {
                    toast.error("Please select a product quality to advertise first!");
                } else if (tempStock == 0) {
                    toast.error("You need to produce units!");
                } else {
                    stock = [...stock, updatedStock]
                    player.set("capital", capital);
                    player.set("stock", stock);
                    player.round.set("round", round)
                    player.round.set("selectedProduct", selectedProduct);
                    player.stage.set("submit", true);
                }
            }
        }

        function getRandomProduct() {
            /*
            getRandomProduct() is used to get a random product from the list of products in constant.js.
            */
            const randomIndex = Math.floor(Math.random() * products.length);
            return products[randomIndex];
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }


        return (
            <div className="h-full w-full">
                <div className="flex h-full flex-row justify-center space-x-4 overflow-hidden bg-gray-50 p-4">
                    <div className="w-1/3 bg-white p-6 shadow-xl ring-2 ring-gray-900/5 rounded-lg text-center">
                        <h1 className="text-lg font-bold">Product Image</h1>
                        <img src={productQuality == "" ? low.productImage : productImage} alt="Product Image" className="w-full h-full object-contain" />
                    </div>

                    <div className="relative w-2/3 bg-white p-6 shadow-xl ring-2 ring-gray-900/5 rounded-lg">
                        <div className="flex flex-col justify-center items-center h-full w-full gap-8">

                            <div className="h-full w-full flex flex-col justify-center items-center gap-4 ">
                                <h1 className="text-lg font-bold">Choose Product Quality</h1>
                                <div className="flex flex-row justify-center space-x-4 w-full">
                                    <div onClick={() => {
                                        setCapital(capital + tempStock * productCost)
                                        setProductQuality(low.productQuality);
                                        setProductCost(low.productCost);
                                        setProductImage(low.productImage);
                                        setProductName(low.productName);
                                        setProductID(selectedProduct.id);
                                        setValue(low.value);
                                        setUpdatedStock({})
                                        setTempStock(0)
                                        setProfit(0)
                                        setProductAdQuality("")
                                    }}
                                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded-md text-center cursor-pointer w-1/2"
                                        style={{
                                            outline:
                                                productQuality == "low"
                                                    ? `4px solid ${backgroundColor}`
                                                    : "none",
                                        }}
                                    >
                                        <h1 className="text-xl font-bold">{capitalizeFirstLetter(low.productQuality)}</h1>
                                        <p className="text-sm">This will be produced at ${low.productCost}</p>
                                    </div>
                                    <div
                                        onClick={() => {
                                            setCapital(capital + tempStock * productCost);
                                            setProductQuality(high.productQuality);
                                            setProductCost(high.productCost);
                                            setProductImage(high.productImage);
                                            setProductName(high.productName);
                                            setProductID(selectedProduct.id);
                                            setValue(high.value);
                                            setUpdatedStock({})
                                            setTempStock(0)
                                            setProfit(0)
                                            setProductAdQuality("")
                                        }}
                                        className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded-md text-center cursor-pointer w-1/2"
                                        style={{
                                            outline:
                                                productQuality == "high"
                                                    ? `4px solid ${backgroundColor}`
                                                    : "none",
                                        }}
                                    >
                                        <h1 className="text-xl font-bold">{capitalizeFirstLetter(high.productQuality)}</h1>
                                        <p className="text-sm">This will be produced at ${high.productCost}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-full w-full flex flex-col justify-center items-center gap-4 ">
                                <h1 className="text-lg font-bold">Choose Advertisement Quality</h1>
                                <div className="flex flex-row justify-center space-x-4 w-full">
                                    <div onClick={() => {
                                        if (productQuality != "") {
                                            setCapital(capital + tempStock * productCost)
                                            setTempStock(0);
                                            setProfit(Number(low.productPrice) - Number(productCost))
                                            setProductAdQuality(low.productQuality)
                                            setProductPrice(low.productPrice)
                                            setProductAdImage(low.productImage)
                                            setProductAdName(low.productName)
                                            setUpdatedStock(
                                                {
                                                    producerID: player.id,
                                                    productID: productID,
                                                    productIdentifier: low.productName,
                                                    productQuality: productQuality,
                                                    productAdQuality: low.productQuality,
                                                    productCost: productCost,
                                                    productPrice: low.productPrice,
                                                    productAdImage: low.productImage,
                                                    value: value,
                                                    initialStock: 0,
                                                    remainingStock: 0,
                                                    soldStock: 0,
                                                    round: round
                                                }
                                            )
                                            toast.info('You can now select the number of units to produce!');

                                        }
                                        else {
                                            toast.error("Please select a product quality to produce first!")
                                        }
                                    }
                                    }
                                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded-md text-center cursor-pointer w-1/2"
                                        style={{
                                            outline:
                                                productAdQuality == "low"
                                                    ? `4px solid ${backgroundColorAd}`
                                                    : "none",
                                        }}
                                    >
                                        <h1 className="text-xl font-bold">{capitalizeFirstLetter(low.productQuality)}</h1>
                                        <p className="text-sm">This will sell for ${low.productPrice}</p>
                                    </div>
                                    <div onClick={() => {
                                        if (productQuality != "") {
                                            setCapital(capital + tempStock * productCost)
                                            setTempStock(0);
                                            setProfit(Number(high.productPrice) - Number(productCost))
                                            setProductAdQuality(high.productQuality)
                                            setProductPrice(high.productPrice)
                                            setProductAdImage(high.productImage)
                                            setProductAdName(high.productName)
                                            setUpdatedStock(
                                                {
                                                    producerID: player.id,
                                                    productID: productID,
                                                    productIdentifier: high.productName,
                                                    productQuality: productQuality,
                                                    productAdQuality: high.productQuality,
                                                    productCost: productCost,
                                                    productPrice: high.productPrice,
                                                    productAdImage: high.productImage,
                                                    value: value,
                                                    initialStock: 0,
                                                    remainingStock: 0,
                                                    soldStock: 0,
                                                    round: round
                                                }
                                            )
                                            toast.info('You can now select the number of units to produce!');

                                        }
                                        else {
                                            toast.error("Please select a product quality to produce first!")
                                        }
                                    }
                                    }
                                        className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded-md text-center cursor-pointer w-1/2"
                                        style={{
                                            outline:
                                                productAdQuality == "high"
                                                    ? `4px solid ${backgroundColorAd}`
                                                    : "none",
                                        }}
                                    >
                                        <h1 className="text-xl font-bold">{capitalizeFirstLetter(high.productQuality)}</h1>
                                        <p className="text-sm">This will sell for ${high.productPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-full w-full flex flex-col justify-center items-center gap-4">
                                <h1 className="text-lg font-bold">Update Cart</h1>
                                <div className="flex flex-row justify-center items-baseline space-x-4 w-full">
                                    <button
                                        onClick={() => {
                                            if (productQuality == "") {
                                                toast.error("Please select a product quality to produce first!");
                                            } else if (productAdQuality == "") {
                                                toast.error("Please select a product quality to advertise first!");
                                            } else if (tempStock === 0) {
                                                toast.error("You cannot decrease the stock any further!");
                                            } else {
                                                decrementQuantity();
                                            }
                                        }}
                                        className={`bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded-full text-center text-2xl font-bold w-12 ${tempStock === 0 ? 'cursor-not-allowed opacity-50' : ''}`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <div className="text-xl font-bold">{tempStock}</div>
                                    <button
                                        onClick={() => {
                                            if (productQuality == "") {
                                                toast.error("Please select a product quality to produce first!");
                                            } else if (productAdQuality == "") {
                                                toast.error("Please select a product quality to advertise first!");
                                            } else if (capital - productCost < 0) {
                                                toast.error("You do not have enough capital to produce more units!");
                                            } else {
                                                incrementQuantity();
                                            }
                                        }}
                                        className={`bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded-full text-center cursor-pointer text-2xl font-bold w-12 ${capital - productCost < 0 ? 'cursor-not-allowed opacity-50' : ''}`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="h-full w-full flex flex-col justify-center items-center gap-4">
                                <button
                                    onClick={() => handleSubmit()}
                                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-md text-center cursor-pointer w-1/3 text-xl font-bold">
                                    Submit
                                </button>
                            </div>

                            <div className="h-full w-full flex justify-center items-center gap-4">
                                <div className="h-full w-full">
                                    <h1 className="text-lg font-bold">Choices Summary</h1>
                                    <table
                                        className="table-auto border-separate border-spacing-2 border border-slate-500 rounded-md">
                                        <tbody>
                                            <tr>
                                                <td className="text-left font-semibold">Production Budget</td>
                                                <td className="text-center">
                                                    ${capital}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-left font-semibold">Quality Level</td>
                                                <td
                                                    className={productQuality == "" ? "text-center" : productQuality == "low" ? "text-center font-semibold text-base/none text-red-700 bg-red-300 rounded-lg p-1" : "text-center font-semibold text-base/none text-green-700 bg-green-300 rounded-lg p-1"}
                                                >
                                                    {productQuality == "" ? <>...</> : <>{productQuality}</>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-left font-semibold">Unit Margin</td>
                                                <td className="text-center">
                                                    ${profit ? profit : "..."}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-left font-semibold">Units Produced</td>
                                                <td className="text-center">
                                                    {tempStock > 0 ? tempStock : "..."}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-left font-semibold">Advertised Quality</td>
                                                <td
                                                    className={productAdQuality == "" ? "text-center" : productAdQuality == "low" ? "text-center font-semibold text-base/none text-red-700 bg-red-300 rounded-lg p-1" : "text-center font-semibold text-base/none text-green-700 bg-green-300 rounded-lg p-1"}
                                                >
                                                    {productAdQuality == "" ? <>...</> : <>{productAdQuality}</>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-left font-semibold">Profit - If everything sold</td>
                                                <td className="text-center">${tempStock > 0 ? profit * tempStock : <>...</>}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-left font-semibold">Profit - If no sales</td>
                                                <td className="text-center">${tempStock > 0 ? - productCost * tempStock : <>...</>}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="h-full w-full flex flex-col justify-center items-center gap-2">
                                    <div>
                                        <h1 className="text-lg font-bold">PayOff Matrix (Producer)</h1>
                                        <PayoffMatrix role="producer" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold">PayOut Matrix (Consumer)</h1>
                                        <PayoffMatrix role="consumer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/3 bg-white p-6 shadow-xl ring-2 ring-gray-900/5 rounded-lg text-center">
                        <h1 className="text-lg font-bold">Advertised Image</h1>
                        <img src={productAdQuality == "" ? high.productImage : productAdImage} alt="Product Ad Image" className="w-full h-full object-contain" />
                    </div>
                </div>
            </div >
        );
    }




    // if (role === "consumer") {
    //     function handleSubmit() {
    //         /*
    //         handleSubmit() is used to handle the submit button click. It sets the stage of each player to submit.
    //         */
    //         player.round.set("round", round);
    //         player.stage.set("submit", true);
    //     }
    //     function ConsumerWaitingMessage() {
    //         /*
    //         Used to display the waiting message for the consumer.
    //         */
    //         return (
    //             <div className="text-center p-[20px] bg-gray-100 rounded-md shadow-md max-w-[500px] mx-[20px] my-auto">
    //                 <h2 className="text-xl mb-2 font-semibold flex items-center justify-center">
    //                     <img src="https://cdn.pixabay.com/animation/2023/03/08/09/53/09-53-16-104_512.gif" alt="timer" className="w-6 h-6 mr-2" />
    //                     Waiting Room
    //                     <img src="https://cdn.pixabay.com/animation/2023/03/08/09/53/09-53-16-104_512.gif" alt="timer" className="w-6 h-6 ml-2" />
    //                 </h2>
    //                 <p>While you wait: </p>
    //                 <ul>
    //                     <li>"What products will be available? 🤔🛍️"</li>
    //                     <li>"Can you spot the best deals? 🕵️🔍"</li>
    //                 </ul>
    //                 <br />
    //                 <p>
    //                     Here is the payout you stand to win if you buy genuine products and lose
    //                     if you get misled by false advertisements.
    //                     Remember that <b className='text-red-600'>no purchase means no points</b>!
    //                 </p>
    //                 <br />
    //                 <PayoffMatrix role={"consumer"} />
    //                 <br />
    //                 <p>Get ready to make smart choices and find the best products! 🧠🎯</p>
    //                 <div>🛒🌟</div>
    //             </div>
    //         );
    //     }
    //     return (
    //         <div className="text-center mt-10 p-[20px] bg-white rounded-md shadow-md max-w-[500px] mx-[20px] my-auto">
    //             <ConsumerWaitingMessage />
    //             <button
    //                 onClick={handleSubmit}
    //                 className="mt-6 rounded-md bg-[#4CAF50] hover:bg-[#45a049] text-white px-[12px] py-[16px] rounded-sm cursor-pointer shadow-md hover:shadow-lg transitionn-all ease-in-out"
    //             >
    //                 Proceed to next stage
    //             </button>
    //         </div>
    //     );
    // }
}
