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
import { usePlayer } from "@empirica/core/player/classic/react";
import { PayoffMatrix } from "../components/PayoffMatrix";
import { products } from "../../constant";
import { toast } from "react-toastify";

export function QualityStage() {
    const player = usePlayer();
    const role = player.get("role");

    const [selectedProduct, _] = useState(getRandomProduct());
    const { low, high, id, category } = selectedProduct;

    const [productQuality, setProductQuality] = useState("");
    const [productCost, setProductCost] = useState(0);
    const [productImage, setProductImage] = useState("");
    const [productName, setProductName] = useState("");
    const [productID, setProductID] = useState(-1);

    function handleSubmit() {
        /*
        handleSubmit() is used to handle the submit button click. It sets the product quality, cost, image, name, and id for the producer's product. It also sets the stage of each player to submit.
        */
        if (role === "producer") {
            if (productQuality != "") {
                player.round.set("productQuality", productQuality);
                player.round.set("productCost", productCost);
                player.round.set("productImage", productImage);
                player.round.set("productName", productName);
                player.round.set("productID", productID);
                player.round.set("selectedProduct", selectedProduct);
                player.stage.set("submit", true);
            } else {
                toast.error("Not selected a product to produce!")
            }
        }
        player.stage.set("submit", true);
    }

    function getRandomProduct() {
        /*
        getRandomProduct() is used to get a random product from the list of products in constant.js.
        */
        const randomIndex = Math.floor(Math.random() * products.length);
        return products[randomIndex];
    }

    function MakeQualityOption({ quality, imgUrl, cost, name, id }) {
        /*
        Used to display the quality options for the producer.
        */
        const [hover, setHover] = useState(false);
        const qualityCapitalized = quality[0].toUpperCase() + quality.slice(1); // low -> Low
        const backgroundColor = quality === "low" ? "#FA6B84" : "#00CDBB";

        return (
            <div
                className="text-center flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {
                    setProductQuality(quality);
                    setProductCost(cost);
                    setProductImage(imgUrl);
                    setProductName(name);
                    setProductID(id);
                }}
            >
                <div
                    className={`option text-center p-[20px] bg-[${backgroundColor}] text-black border-none rounded-md outline-offset-2 text-base mr-[10px] w-96`}
                    style={{
                        outline:
                            quality === productQuality
                                ? `4px solid ${backgroundColor}`
                                : "none",
                        background: quality === productQuality || hover ? `${backgroundColor}80` : "transparent",
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <h2
                        style={{
                            fontWeight: "bold",
                            fontFamily: "Unbounded",
                            fontSize: "24px",
                        }}
                    >
                        Produce
                        {" " + qualityCapitalized + " "}
                        Quality
                    </h2>
                    <p style={{ fontWeight: "lighter", fontFamily: "Archivo" }}>
                        This will cost you ${cost} to produce, and you may advertise it as
                        you wish.
                    </p>
                </div>
                <img
                    className="mb-6 h-[375px] mt-[25px] rounded-md"
                    style={{
                        height: "375px",
                        marginTop: "25px",
                        borderRadius: "20px",
                        filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))",
                    }}
                    src={imgUrl}
                    alt={`${qualityCapitalized} Image`}
                />
            </div>
        );
    }

    function ConsumerWaitingMessage() {
        /*
        Used to display the waiting message for the consumer.
        */
        return (
            <div className="text-center p-[20px] bg-gray-100 rounded-md shadow-md max-w-[500px] mx-[20px] my-auto">
                <h2 className="text-xl mb-2 font-semibold flex items-center justify-center">
                    <img src="https://cdn.pixabay.com/animation/2023/03/08/09/53/09-53-16-104_512.gif" alt="timer" className="w-6 h-6 mr-2" />
                    Waiting Room
                    <img src="https://cdn.pixabay.com/animation/2023/03/08/09/53/09-53-16-104_512.gif" alt="timer" className="w-6 h-6 ml-2" />
                </h2>
                <p>While you wait: </p>
                <ul>
                    <li>"What products will be available? 🤔"</li>
                    <li>"Can you spot the best deals? 🕵️"</li>
                </ul>
                <br />
                <p>
                <b className='text-red-600'>Are you fooled by false ads?</b> Here is the payout depending on the product you buy:
                </p>
                <br />
                <PayoffMatrix role={"consumer"} selectedProduct={selectedProduct} />
                <br />
                <p>Reward applies to each unit purchased. No purchase means no points. 🎯</p>
                <div>Get ready to find the best deals! 🛒</div>
            </div>
        );
    }

    if (role === "consumer") {
        return (
            <div className="text-center mt-10 p-[20px] bg-white rounded-md shadow-md max-w-[500px] mx-[20px] my-auto">
                <ConsumerWaitingMessage />
                <button
                    onClick={handleSubmit}
                    className="mt-6 rounded-md bg-[#4CAF50] hover:bg-[#45a049] text-white px-[12px] py-[16px] rounded-sm cursor-pointer shadow-md hover:shadow-lg transitionn-all ease-in-out"
                >
                    Proceed to next stage
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col -top-6 justify-center border-3 border-indigo-800 p-6 rounded-lg shadow-md relative mt-16">
            <h1
                className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-200 border-2 border-teal-600 pl-2 pr-2 rounded-lg text-lg mb-4 text-center whitespace-nowrap"
                style={{ fontFamily: "'Archivo', sans-serif" }}
            >
                Choose Quality
            </h1>
            <h1 className="flex justify-center mt-2 mb-6">
                You are a producer of {category}, and you may choose what quality you
                would like to produce.
            </h1>
            <div className="flex justify-center gap-10 items-center">
                <MakeQualityOption
                    quality={low.productQuality}
                    imgUrl={low.productImage}
                    cost={low.productCost}
                    name={low.productName}
                    id={id}
                />

                <MakeQualityOption
                    quality={high.productQuality}
                    imgUrl={high.productImage}
                    cost={high.productCost}
                    name={high.productName}
                    id={id}
                />
            </div>
            <div className="flex justify-center items-center">
                <button
                    onClick={handleSubmit}
                    className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-[12px] py-[16px] rounded-lg cursor-pointer shadow-md hover:shadow-lg transitionn-all ease-in-out"
                >
                    Proceed to Next Page
                </button>
            </div>
        </div>
    );
}
