/*
This file contains the code for the choice stage of the game for the consumer.
The consumer can select the products from the producers and add them to the cart.
The consumer can also remove the products from the cart.
The consumer can proceed to the next stage only if he clicks on "Add to Cart".
player.set("wallet", wallet) is used to update the wallet of the player.
player.stage.set("submit", true) is used to set the stage to submit.
player.set("basket", getAllUniqueItems(basket)) is used to update the basket of the player.
basket=[{
    producerID: producer.id,
    productID: productID,
    productQuality: productQuality,
    productAdQuality: productAdQuality,
    productPrice: productPrice,
    value: value,
    quantity: 0,
    round: round,
}]
producer.set("stock", stock) is used to update the stock of the producer.
*/


import React, { useState, useEffect } from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import { toast } from "react-toastify";

/*
this function is used to display the product card of multiple producers for the consumer.
*/
const ConsumerProductCard = ({ producer, index, round, productSelections, wallet, setWallet, setBasket, basket, handleButtonClick, player }) => {
    const [stock, setStock] = useState(producer.get("stock"));
    const tempStock = stock.find((item) => item.round === round);
    const productID = tempStock.productID;
    const productQuality = tempStock.productQuality;
    const productAdQuality = tempStock.productAdQuality;
    const productPrice = tempStock.productPrice;
    const productIdentifier = tempStock.productIdentifier;
    const productAdImage = tempStock.productAdImage;
    const initialStock = tempStock.initialStock;
    const [remStock, setRemStock] = useState(tempStock.remainingStock);
    const [quantity, setQuantity] = useState(0);

    // Update the stock of the product
    const updateIncrementStock = () => {
        const trialStock = stock.map((item) => {
            return item.round === round
                ? {
                    ...item,
                    remainingStock: item.remainingStock + 1,
                    soldStock: item.soldStock - 1,
                }
                : item;
        });
        setStock(trialStock);
        setRemStock(remStock + 1);
        setQuantity(quantity - 1);
    };

    // Update the basket with the new quantity
    const updateIncrementBasket = () => {
        const trialBasket = basket.map((item) => {
            return item.round === round && item.producerID === producer.id
                ? {
                    ...item,
                    productID: productID,
                    productQuality: productQuality,
                    productAdQuality: productAdQuality,
                    productPrice: productPrice,
                    quantity: item.quantity + 1,
                }
                : item;
        });
        setBasket(trialBasket);
    }

    // Update the basket with the new quantity
    const updateDecrementBasket = () => {
        const trialBasket = basket.map((item) => {
            return item.round === round && item.producerID === producer.id
                ? {
                    ...item,
                    productID: productID,
                    productQuality: productQuality,
                    productAdQuality: productAdQuality,
                    productPrice: productPrice,
                    quantity: item.quantity - 1,
                }
                : item;
        });
        setBasket(trialBasket);
    }

    // Update the stock of the product
    const updateDecrementStock = () => {
        const trialStock = stock.map((item) => {
            return item.round === round
                ? {
                    ...item,
                    remainingStock: item.remainingStock - 1,
                    soldStock: item.soldStock + 1,
                }
                : item;
        });
        setStock(trialStock);
        setRemStock(remStock - 1);
        setQuantity(quantity + 1);
    };

    // Function to decrement the quantity of the product
    const decrementQuantity = () => {
        if (productSelections[index] === false) {
            if (quantity > 0 && initialStock > remStock) {
                setWallet(wallet + productPrice);
                updateIncrementStock();
                updateDecrementBasket();
            }
            else{
                toast.error("You cannot decrease the quantity further")
            }
        }
        else{
            toast.error("Please uncheck the checkbox to change the quantity")
        }
    }

    // Function to increment the quantity of the product
    const incrementQuantity = () => {
        if (productSelections[index] === false) {
            if (remStock > 0 && productPrice <= wallet) {
                setWallet(wallet - productPrice);
                updateDecrementStock();
                updateIncrementBasket();
            }
            else{
                toast.error("You don't have enough money in your wallet or the stock is not available")
            }
        }
        else{
            toast.error("Please uncheck the checkbox to change the quantity")
        }
    }

    // Function to get all the unique items in the basket
    const getAllUniqueItems = (basket) => {
        const uniqueItems = [];
        const itemOccurrences = {};

        basket.forEach(item => {
            const roundNo = item.round;

            if (itemOccurrences[roundNo]) {
                itemOccurrences[roundNo]++;
            } else {
                itemOccurrences[roundNo] = 1;
            }

            if (itemOccurrences[roundNo] === 1) {
                uniqueItems.push(item);
            }
        });

        return uniqueItems;
    };


    return (
        <div className="product-card border border-gray-300 shadow-md p-8 rounded-lg w-[310px] text-center bg-white mx-auto relative overflow-hidden">
            <h3>{`Ad # ${index + 1}`}</h3>
            <h4>Seller: {producer.id}</h4>
            <h3>{productIdentifier}</h3>
            <img
                className="max-w-full max-h-[20rem] h-auto w-auto block mx-auto mb-10"
                src={productAdImage}
                alt={`Product ${index + 1}`}
            />
            <p>Advertised Quality: {productAdQuality}</p>
            <p>Price: ${productPrice}</p>
        
            <p>
                In stock: <b>{remStock}</b>
            </p><br />
            <p>
                The amount to purchase:</p>
            <div className={"my-4"}>
                <button className="text-red-500 border border-red-500 rounded-full px-4 bg-white" onClick={decrementQuantity}>–</button>
                <span className="mx-1.5">{quantity}</span>
                <button className="text-green-500 border border-green-500 rounded-full px-3 bg-white" onClick={incrementQuantity}>+</button>
            </div>

            <button
                onClick={() => {
                    if (productSelections[index] === true) {
                        handleButtonClick(index)
                    }
                    else {
                        handleButtonClick(index)
                        producer.set("stock", stock)
                        // need to update for multiplayer TODO
                        player.set("basket", getAllUniqueItems(basket))
                        console.log("Basket", getAllUniqueItems(basket))
                    }
                }}
                className={`bg-${productSelections[index] ? "green-500" : "white"} text-black py-2 px-4 rounded-full border border-green-300 cursor-pointer shadow-md`}
            >
                {productSelections[index] ? "Confirmed" : "Confirm"}
            </button>
        </div>
    );
}

export function ChoiceStage() {
    const player = usePlayer();
    const players = usePlayers();
    const role = player.get("role");
    const roundHook = useRound()
    const round = roundHook.get("name");

    let [basket, setBasket] = useState(player.get('role') == "consumer" && (player.get("basket") || []))
    let [wallet, setWallet] = useState(player.get('role') == "consumer" && (player.get("wallet")));

    /*
     This function is used to update the basket of the player.
    */
    useEffect(() => {
        if (role === "consumer") {
            const handleBasket = () => {
                const findProductID = (producer) => {
                    const st = producer.get("stock")
                    let prodID = st.find((item) => {
                        if (item.round === round) {
                            return item.productID
                        }
                        return -1
                    })
                    return prodID.productID
                }
                const findProductQuality = (producer) => {
                    const st = producer.get("stock")
                    let prodQual = st.find((item) => {
                        if (item.round === round) {
                            return item.productQuality
                        }
                        return -1
                    })
                    return prodQual.productQuality
                }
                const findProductAdQuality = (producer) => {
                    const st = producer.get("stock")

                    let prodAdQual = st.find((item) => {
                        if (item.round === round) {
                            return item.productAdQuality
                        }
                        return -1
                    })
                    return prodAdQual.productAdQuality
                }
                const findProductPrice = (producer) => {
                    const st = producer.get("stock")
                    let prodPrice = st.find((item) => {
                        if (item.round === round) {
                            return item.productPrice
                        }
                        return -1
                    })
                    return prodPrice.productPrice
                }

                const findValue = (producer) => {
                    const st = producer.get("stock")
                    let prodValue = st.find((item) => {
                        if (item.round === round) {
                            return item.value
                        }
                        return -1
                    })
                    return prodValue.value
                }

                const putBasket = players
                    .filter((player) => player.get("role") === "producer")
                    .map((producer, index) => ({
                        producerID: producer.id,
                        productID: findProductID(producer),
                        productQuality: findProductQuality(producer),
                        productAdQuality: findProductAdQuality(producer),
                        productPrice: findProductPrice(producer),
                        value: findValue(producer),
                        quantity: 0,
                        round: round,
                    }));
                setBasket((prevBasket) => [...prevBasket, ...putBasket]);
            }
            handleBasket()
        };
    }, [])

    const producerCount = players.filter((player) => player.get("role") === "producer").length;

    const [productSelections, setProductSelections] = useState(Array(producerCount).fill(false));

    const handleButtonClick = (index) => {
        const newSelections = [...productSelections];
        newSelections[index] = !newSelections[index];
        setProductSelections(newSelections);
    };

    const allProductsSelected = productSelections.every((isSelected) => isSelected);

    const handleProceed = () => {
        if (allProductsSelected) {
            player.set("wallet", wallet);
            player.stage.set("submit", true);
        }
        else{
            toast.error("Please add your products to the cart before proceeding!");
        }
    };

    if (role === "consumer") {

        const WalletDisplay = () => {
            return (
                <div className="fixed top-1/4 left-[20px] bg-white p-4 shadow-md rounded-lg z-10">
                    <span role="img" aria-label="wallet">
                        💰
                    </span>
                    Wallet: ${wallet.toFixed(2)}
                </div>
            );
        }

        const renderProductFeed = () => {
            return players
                .filter((p) => p.get("role") === "producer")
                .map((producer, index) => {
                    return (
                        <ConsumerProductCard
                            key={index}
                            producer={producer}
                            index={index}
                            round={round}
                            productSelections={productSelections}
                            wallet={wallet}
                            setWallet={setWallet}
                            basket={basket}
                            setBasket={setBasket}
                            handleButtonClick={handleButtonClick}
                            player={player}
                        />
                    )
                });
        };

        return (
            <div>
                <br />
                <h2 className="font-bold">Advertisements</h2>
                <h3>You can only buy if you have enough money in your wallet.</h3>
                <WalletDisplay />
                <div>{renderProductFeed()}</div>
                <br />
                <br />
                <button onClick={handleProceed} className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700">
                    Proceed to Next Stage
                </button>
                <br />
                <br />
                <br />
                <br />
            </div>
        );

    }

    else if (role === "producer") {
        const handleProceed = () => {
            player.stage.set("submit", true);
        };
        function ProducerWaitingMessage() {
            /* 
            This function will be used to display the waiting message for the producer
            */
            return (
                <div className="text-center p-4 bg-white rounded-lg shadow-md max-w-[600px] mx-auto my-4 border-8 border-gray-100">
                    <h2 className="text-xl mb-2 font-semibold flex items-center justify-center">
                        <img src="https://cdn.pixabay.com/animation/2023/03/08/09/53/09-53-16-104_512.gif" alt="timer" className="w-6 h-6 mr-2" />
                        Waiting Room
                        <img src="https://cdn.pixabay.com/animation/2023/03/08/09/53/09-53-16-104_512.gif" alt="timer" className="w-6 h-6 ml-2" />
                    </h2>
                    <p>While you wait: </p>
                    <ul>
                        <li>"How many will buy your product? 🤔"</li>
                        <li>"What moves are your competitors making? 🕵‍♂"</li>
                    </ul>
                    <br/>
                    <p>Keep an eye on the market trends and plan your next steps! 📈</p>
                    <div className="text-xl mt-5">🏭</div>
                </div>
            );
        }
        return (
            <div className="text-center mt-8 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-md max-w-[700px] mx-auto my-4">
                <ProducerWaitingMessage />
                <button onClick={handleProceed} className="mt-2 bg-green-500 text-white py-3 px-5 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700">
                    Proceed to Next Stage
                </button>
            </div>
        );
    }

    else if (!role) {
        return <div>Loading...</div>;
    }

    else {
        return <div>Unknown Role</div>;
    }
}
