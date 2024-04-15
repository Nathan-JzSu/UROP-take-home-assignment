/* 
This file contains the code for the ClaimsStage component, which is the stage where the players make their choices for the round.
The producer player is presented with the option to choose the quality of the product they want to produce and the quality of the advertisement they want to use.
The producer player can also choose to add a warrant to their advertisement, which will cost them a certain amount of capital.
The producer player can also choose the quantity of the product they want to produce.
The consumer player is presented with a waiting message and a button to proceed to the next stage.
player.set("stock", stock);
player.set("capital", capital);
player.set("warrants", warrants);
player.set("warrantPrice", warrantPrice);
stock = [{
  producerID: player.id,
  productID: productID,
  productIdentifier: adjSelector(),
  productQuality: productQuality,
  productAdQuality: productAdQuality,
  productCost: productCost,
  productPrice: productPrice,
  productAdImage: productAdImage,
  value: value,
  initialStock: tempStock,
  remainingStock: tempStock,
  soldStock: 0,
  round: round.get("name")
}]
warrants = [{
  producerID: player.id,
  productID: productID,
  productQuality: productQuality,
  productAdQuality: productAdQuality,
  warrantAdded: false,
  warrantPrice: 0,
  warrantDesc: "",
  challengeAmount: 0,
  round: round.get("name"),
}]
player.stage.set("submit", true);
*/


import React, { useState, useEffect } from "react";
import {
  useGame,
  usePlayer,
  useRound,
} from "@empirica/core/player/classic/react";
import { WarrantModal } from "../components/WarrantModal";
import { PayoffMatrix } from "../components/PayoffMatrix";
import { toast } from "react-toastify";

// This function returns the component for the ClaimsStage
export function ClaimsStage() {
  const player = usePlayer();
  const round = useRound();
  const role = player.get("role");
  const game = useGame();
  const treatment = game.get("treatment");
  const marketType = treatment["marketType"];

  // This function returns the component for the producer player
  if (role === "producer") {
    const productCost = player.round.get("productCost");
    let selectedProduct = player.round.get("selectedProduct");
    const { low, high, category, productWarrants } = selectedProduct;
    let productID = player.round.get("productID");
    let brandName = player.round.get("brandName");
    let productQuality = player.round.get("productQuality");
    let [capital, setCapital] = useState(player.get("capital"));
    let [productPrice, setProductPrice] = useState(0);
    let [productAdQuality, setProductAdQuality] = useState("");
    let [productAdImage, setProductAdImage] = useState("");
    let [productAdName, setProductAdName] = useState("");
    let [value, setValue] = useState(0)
    let [isModalOpen, setIsModalOpen] = useState(false);
    let [isCheckboxSelected, setIsCheckboxSelected] = useState(false);

    let [profit, setProfit] = useState(0);
    let [iniStock, setIniStock] = useState(0);
    let stock = player.get("stock") || [];
    let [updatedStock, setUpdatedStock] = useState({});
    let warrants = player.get("warrants") || [];
    let [updateWarrants, setUpdateWarrants] = useState({});
    let [tempStock, setTempStock] = useState(0);

    useEffect(() => {
      if (isCheckboxSelected == true) {
        warrants.find((warrant) => {
          if (
            warrant.productID === productID &&
            warrant.productQuality === productQuality &&
            warrant.productAdQuality === productAdQuality
          ) {
            setUpdateWarrants(warrant);
            setUpdateWarrants({
              ...updateWarrants,
              round: round.get("name"),
            });
            setCapital(Number(capital) - Number(warrant.warrantPrice));
            return true

          } else {
            setUpdateWarrants({
              producerID: player.id,
              productID: productID,
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              warrantAdded: false,
              warrantPrice: 0,
              warrantDesc: "",
              challengeAmount: 0,
              round: round.get("name"),
            });
            return true
          }
        });
      }
      else {
        if (updateWarrants.warrantPrice == undefined) {
          setUpdateWarrants({
            producerID: player.id,
            productID: productID,
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            warrantAdded: false,
            warrantPrice: 0,
            warrantDesc: "",
            challengeAmount: 0,
            round: round.get("name"),
          });
        }
        else {
          setCapital(Number(capital) + Number(updateWarrants.warrantPrice));
          setUpdateWarrants({
            producerID: player.id,
            productID: productID,
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            warrantAdded: false,
            warrantPrice: 0,
            warrantDesc: "",
            challengeAmount: 0,
            round: round.get("name"),
          });
        }
      }
    }, [isCheckboxSelected]);


    // This function handles the submission of the choices made by the producer player
    const handleSubmit = () => {
      if (productAdQuality === "") {
        toast.error("Please select an advertisement quality for the product!");
      } else if (
        isCheckboxSelected == true && updateWarrants.warrantDesc === "") {
        toast.error("Select a warrant from the options!");
      } else if (tempStock == 0) {
        toast.error("You cannot submit without any stock!");
      } else {
        warrants = [...warrants, updateWarrants];
        stock = [...stock, updatedStock]
        player.set("warrants", warrants);
        player.set("capital", capital);
        player.set("stock", stock);
        player.stage.set("submit", true);
      }
    };

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
      return `${brandName} ${productAdName} ${chosenAdj} ${category}`;
    }

    const decrementQuantity = () => {
      /*
      This function decrements the stock of the player by 1 and increments the capital by the product cost
      */
      if (tempStock >= iniStock) {
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
        setTempStock(tempStock - 1);
        setCapital(Number(capital) + Number(productCost));
      }
      if (tempStock === 1 && isCheckboxSelected) {
        setIsCheckboxSelected(false);
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


    /*
    This function returns a component that allows the player to select the quality of the product they want to produce
    */
    function SellQualityOption({ quality, imgUrl, price, name, value }) {
      const qualityCapitalized = quality[0].toUpperCase() + quality.slice(1);
      const backgroundColor = quality === "low" ? "#FA6B84" : "#00CDBB";
      return (
        <div
          className="text-center flex flex-col justify-center items-center"
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (isCheckboxSelected == false) {
              setProductPrice(price);
              setProductAdImage(imgUrl);
              setProductAdName(name);
              setProfit(price - productCost);
              setProductAdQuality(quality);
              setValue(value);
              setUpdatedStock(
                {
                  producerID: player.id,
                  productID: productID,
                  productIdentifier: name,
                  productQuality: productQuality,
                  productAdQuality: quality,
                  productCost: productCost,
                  productPrice: price,
                  productAdImage: imgUrl,
                  value: value,
                  initialStock: 0,
                  remainingStock: 0,
                  soldStock: 0,
                  round: round.get("name")
                }
              )
              setCapital(capital + tempStock * productCost)
              setTempStock(0);
              setIniStock(0);
              setUpdateWarrants({
                producerID: player.id,
                productID: productID,
                productQuality: productQuality,
                productAdQuality: quality,
                warrantAdded: false,
                warrantPrice: 0,
                warrantDesc: "",
                challengeAmount: 0,
                round: round.get("name")
              });
              setIsCheckboxSelected(false);
              toast.info('You also have the ability to warrant your product!');
            }
            else {
              toast.error("Please deselect your warrant first to switch product quality choice!")
            }
          }}
        >
          <div
            className="option shadow-lg"
            style={{
              textAlign: "center",
              padding: "20px",
              backgroundColor: backgroundColor,
              color: "#FFF",
              border: "none",
              borderRadius: "15px",
              outline:
                quality === productAdQuality
                  ? `4px solid ${backgroundColor}`
                  : "none",
              outlineOffset: "3px",
              fontSize: "16px",
              marginRight: "10px",
              width: "370px",
            }}
          >
            <h2
              style={{
                fontWeight: "bold",
                fontFamily: "Unbounded",
                fontSize: "24px",
              }}
            >
              Advertise as {qualityCapitalized + " "}
              Quality
            </h2>
            <p style={{ fontWeight: "lighter", fontFamily: "Archivo" }}>
              This will sell for ${price} in the market
            </p>
          </div>
          <img
            className="mb-6"
            style={{
              height: "375px",
              marginTop: "25px",
              borderRadius: "20px",
              filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))",
            }}
            src={imgUrl}
            alt={`${qualityCapitalized} quality toothpaste`}
          />
        </div>
      );
    }

    function WarrantSelector() {
      /*
      This function returns a component that allows the player to select a warrant for their advertisement
      */

      const selectedCardStyle = {
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderRadius: "6px",
        padding: "10px",
      };

      return (
        <div className="flex justify-center items-center">
          <div
            className="container cursor-pointer p-[20px] mb-[20px] w-1/2 border border-gray-300 rounded-lg shadow-md"
            style={{
              outline: isCheckboxSelected ? "3px solid #a666ff" : "1px solid #AAAAAA",
              outlineOffset: "3px",
              borderRadius: "15px",
            }}
          >
            <div className="flex items-center">
              <input
                className="rounded-md mr-2 focus:ring-8 focus:ring-blue-500 cursor-pointer h-6 w-6"
                type="checkbox"
                id="addWarrant"
                checked={isCheckboxSelected}
                onClick={() => {
                  if (tempStock <= 0 || capital <= Math.abs(profit) * 3) {
                    toast.error("You do not have enough capital to add a warrant");
                  }
                  else if (productAdQuality === "") {
                    toast.error("Choose a quality to advertise first!");
                  }
                  else if (tempStock == 0) {
                    toast.error("You cannot add a warrant without any stock!")
                  }
                  else {
                    setIsCheckboxSelected(!isCheckboxSelected);
                  }
                }}
                readOnly={true}
              />
              <div>
                <span className="text-lg font-semibold">Warrant my Advertisement</span>
              </div>

              <div className="ml-auto">
                {isCheckboxSelected && (
                  <button
                    className={`bg-blue-400 p-2 rounded-lg ${updateWarrants.warrantAdded ? "" : "bg-red-400"} ${isCheckboxSelected && updateWarrants.warrantAdded ? "" : "animate-pulse"}`}
                    disabled={!isCheckboxSelected}
                    onClick={() => setIsModalOpen(true)}
                  >
                    {updateWarrants.warrantAdded ? "Warrant Selected" : "Select Warrant"}
                  </button>
                )}
              </div>

            </div>
            <hr className="mt-1 mb-2" />
            <div className="option">
              <div className="flex justify-between">
              </div>
              <p className="mb-2" style={{ fontWeight: "normal" }}>
                🧾 This will cost you{" — "}<b>$</b>
                <b>{updateWarrants.warrantPrice == 0 ? "..." : updateWarrants.warrantPrice}</b>
              </p>

              <p className="text-justify">
                💡 Warrants allow you to add credible claims to boost your advertisements, backed by an amount of money.
                Your warranted advertisement is showcased to all potential consumers. If your claim is unchallenged or truthful, the
                money spent on your warrant will be fully refunded. However, if you warrant a false advertisement that is challenged,
                your money spent on the warrant will be lost to the challenger.
              </p>
            </div>
          </div>

          <WarrantModal
            isOpen={isModalOpen}
            onClose={() => {
              if (capital < 0) {
                toast.error("Not enough funds, change advertising choices!");
              }
              { setIsModalOpen(false) }
            }}
            title="Warrant"
            children={
              <>
                {Array.isArray(productWarrants) && productWarrants.length > 0 && (
                  <div className="flex justify-center space-x-4">
                    {productWarrants.map((warrant, index) => {
                      return (
                        <div
                          style={
                            updateWarrants.warrantDesc === warrant.description
                              ? selectedCardStyle
                              : {}
                          }
                          className="flex flex-col items-center cursor-pointer select:border-2 border-black"
                          key={index}
                          onClick={(e) => {
                            if (updateWarrants.warrantDesc === warrant.description) {
                              setUpdateWarrants({
                                producerID: player.id,
                                productID: productID,
                                productQuality: productQuality,
                                productAdQuality: productAdQuality,
                                warrantAdded: false,
                                warrantPrice: 0,
                                warrantDesc: "",
                                challengeAmount: 0,
                                round: round.get("name"),
                              })
                              setCapital(Number(capital) + Number(warrant.multiplier * Math.abs(profit)))
                            } else {
                              setCapital(Number(capital) + Number(updateWarrants.warrantPrice) - Number(warrant.multiplier * Math.abs(profit)))
                              setUpdateWarrants({
                                ...updateWarrants,
                                warrantAdded: true,
                                warrantPrice: warrant.multiplier * Math.abs(profit),
                                warrantDesc: warrant.description,
                                challengeAmount: parseInt(Math.ceil((warrant.multiplier * Math.abs(profit)) / 5))
                              });
                            }
                          }}
                        >
                          <img
                            src={warrant.icon}
                            alt="icon"
                            className="mb-2 max-w-full h-auto rounded-lg"
                          />
                          <h1 className="font-bold text-center mb-4">
                            {warrant.description}
                          </h1>
                          <h1 className="font-semibold text-xl text-center">
                            <span style={{ color: "green" }}>
                              ${Math.abs(profit) * warrant.multiplier}
                            </span>
                          </h1>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            }
          />
        </div>
      );
    }

    function InfoDisplay() {

      // Production Budget:	$24
      // Quality Level:	Low
      // Unit Margin:	$6
      // Units Produced:	5
      // Advertised Quality:	High
      // Ad Quality warranted?	No
      // Profit: No Sales -$10, Everything Sells $30

      return (
        <div className="fixed left-[10px] top-[200px] w-[280px] bg-white p-[10px] shadow-md rounded-md z-[1000]">
          <h1 className="text-xl font-semibold">Choices Summary</h1>
          <table
            className="table-auto border-separate border-spacing-2 border border-slate-500 rounded-md">
            <tr>
              <td className="text-left font-semibold">Production Budget</td>
              <td className="text-center font-semibold text-base/none text-green-700 bg-green-300 rounded-lg
                  ">{capital}</td>
            </tr>
            <tr>
              <td className="text-left font-semibold">Quality Level</td>
              <td className="text-center font-semibold text-base/none text-red-700 bg-red-300 rounded-lg
                  ">{productQuality}</td>
            </tr>
            <tr>
              <td className="text-left font-semibold">Unit Margin</td>
              <td className="text-center font-semibold text-base/none text-green-700 bg-green-300 rounded-lg
                  ">{profit ? profit : "..."}</td>
            </tr>
            <tr>
              <td className="text-left font-semibold">Units Produced</td>
              <td className="text-center
                  ">{tempStock > 0 ? tempStock : "..."}</td>
            </tr>
            <tr>
              <td className="text-left font-semibold">Advertised Quality</td>
              <td className="text-center
                  ">{productAdQuality ? productAdQuality : "..."}</td>
            </tr>
            <tr>
              <td className="text-left font-semibold">Ad Quality warranted?</td>
              <td className="text-center
                  ">{updateWarrants.warrantAdded ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="text-left font-semibold">Profit</td>
              <td className="text-center
                  ">{profit * tempStock}</td>
            </tr>
          </table>
          <b style={{ color: "red" }}>All unsold products removed each round!</b>

          <div className="mt-4 ">
            <PayoffMatrix className="mt-4" role={"producer"} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col -top-6 justify-center items-center border-3 border-indigo-800 p-6 rounded-lg h-full shadow-md relative p-10 mt-32 w-10/12">
        <h1
          className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-200 border-2 border-teal-600 pl-2 pr-2 rounded-lg text-lg mb-4"
          style={{
            fontFamily: "'Archivo', sans-serif",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          <div className="divide-y divide-lime-500">
            <div>
              <b>Choose how you want to Advertise</b>
            </div>
            <div>
              Higher profits get you a higher score!
            </div>
          </div>
        </h1>

        {<InfoDisplay />}

        <div className="flex justify-center gap-10 items-center">
          <SellQualityOption
            quality={low.productQuality}
            imgUrl={low.productImage}
            price={low.productPrice}
            name={low.productName}
            value={productQuality === "low" ? low.value : high.value}
          />
          <SellQualityOption
            quality={high.productQuality}
            imgUrl={high.productImage}
            price={high.productPrice}
            name={high.productName}
            value={productQuality === "low" ? low.value : high.value}
          />
        </div>
        <div className={"mx-10 mt-16 mb-16"}>
          <button
            className={`text-red-500 border-solid border-2 rounded-full border-red-500 px-2 py-1 bg-white ${tempStock === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => {
              if (iniStock - tempStock === 0) {
                toast.error("You cannot reduce the stock any further!");
              } else if (updatedStock.initialStock === undefined) {
                toast.error("Choose a quality to advertise first!");
              } else {
                decrementQuantity();
              }
            }}
            disabled={tempStock === 0}
          >
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
          <span style={{ marginLeft: "10px", marginRight: "10px", fontSize: "25px" }}>
            {tempStock}
          </span>
          <button
            className={`text-green-500 border-solid border-2 rounded-full border-green-500 px-2 py-1 bg-white ${capital - productCost < 0 ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => {
              if (capital - productCost < 0) {
                toast.error("You do not have enough capital to produce more units!");
              } else if (updatedStock.initialStock === undefined) {
                toast.error("Choose a quality to advertise first!");
              } else {
                incrementQuantity();
              }
            }}
            disabled={capital - productCost < 0}
          >
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
        {
          marketType === "coasian-market" ? (
            <WarrantSelector />
          ) : null
        }
        <div className="flex justify-center items-center mt-4">
          <button
            className={"p-2 rounded-md border-transparent shadow-sm text-white bg-empirica-600 hover:bg-empirica-700"}
            onClick={handleSubmit}
          >
            Submit choices and go to market
          </button>
        </div>
      </div >
    );
  } else { // This function returns the component for the consumer player
    const handleProceed = () => {
      player.stage.set("submit", true);
    };
    function ConsumerWaitingMessage() {
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
            <br/>
            <PayoffMatrix role={"consumer"} />
            <br />
            <p>Reward applies to each unit purchased. No purchase means no points. 🎯</p>
            <div>Get ready to find the best deals! 🛒</div>
          </div>
      );
    }
    if (!role) {
      return <div>Loading... Unknown role</div>;
    }

    return (
      <div className="text-center mt-10 p-[20px] bg-white rounded-md shadow-md max-w-[500px] mx-[20px] my-auto">
        <ConsumerWaitingMessage />
        <button
          onClick={handleProceed}
          className="mt-6 rounded-md hover: cursor-pointer rounded-md border-none bg-[#4CAF50] px-4 py-4 text-base text-white shadow-md transition-all ease-in-out hover:bg-[#45a049] hover:shadow-md hover:shadow-gray-400"
        >
          Proceed to next stage
        </button>
      </div>
    );
  }
}
