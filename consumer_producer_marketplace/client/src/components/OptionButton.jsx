import React from "react";

export function SellQualityOption({ quality, imgUrl, selectedIdx, setSelectedIdx }) {
    const qualityCapitalized = quality[0].toUpperCase() + quality.slice(1);
    // TODO: Remove hardcoded values
    // price = (cost + value) / 2
    const price = quality === "low" ? "5" : "10";
    const backgroundColor = quality === "low" ? "#FA6B84" : "#00CDBB";
    const qualityIdx = quality === "low" ? 0 : 1;

    return <div className="text-center flex flex-col justify-center items-center" style={{ cursor: "pointer" }}
        onClick={_ => setSelectedIdx(qualityIdx)}>
        <div className="option" style={{
            textAlign: "center", padding: "20px",
            backgroundColor: backgroundColor,
            color: "#FFF",
            border: "none",
            borderRadius: "15px",
            outline: selectedIdx === qualityIdx ? `4px solid ${backgroundColor}` : "none",
            outlineOffset: "3px",
            fontSize: "16px",
            marginRight: "10px",
            width: "370px"
        }}>
            <h2 style={{ fontWeight: "bold", fontFamily: "Unbounded", fontSize: "24px" }}>Advertise
                as {qualityCapitalized + " "}
                Quality</h2>
            <p style={{ fontWeight: "lighter", fontFamily: "Archivo" }}>This will sell for ${price} in the market</p>
        </div>
        <img className="mb-6"
            style={{
                height: "375px",
                marginTop: "25px",
                borderRadius: "20px",
                filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))"
            }}
            src={imgUrl} alt={`${qualityCapitalized} quality toothpaste`} />
    </div>
}

export function MakeQualityOption({ quality, imgUrl, selectedIdx, setSelectedIdx }) {
    const qualityCapitalized = quality[0].toUpperCase() + quality.slice(1);
    // TODO: Remove hardcoded values
    const price = quality === "low" ? "2" : "6";
    const backgroundColor = quality === "low" ? "#FA6B84" : "#00CDBB";
    const qualityIdx = quality === "low" ? 0 : 1;

    return <div className="text-center flex flex-col justify-center items-center" style={{ cursor: "pointer" }}
        onClick={_ => setSelectedIdx(qualityIdx)}>
        <div className="option" style={{
            textAlign: "center", padding: "20px",
            backgroundColor: backgroundColor,
            color: "#FFF",
            border: "none",
            borderRadius: "15px",
            outline: selectedIdx === qualityIdx ? `4px solid ${backgroundColor}` : "none",
            outlineOffset: "3px",
            fontSize: "16px",
            marginRight: "10px",
            width: "370px"
        }}>
            <h2 style={{ fontWeight: "bold", fontFamily: "Avenir", fontSize: "24px" }}>Produce
                {" " + qualityCapitalized + " "}
                Quality</h2>
            <p style={{ fontWeight: "lighter", fontFamily: "Avenir" }}>This will cost you ${price} to produce, and you may advertise it as you wish.</p>
        </div>
        <img className="mb-6"
            style={{
                height: "375px",
                marginTop: "25px",
                borderRadius: "20px",
                filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))"
            }}
            src={imgUrl} alt={`${qualityCapitalized} quality toothpaste`} />
    </div>
}


// ---------------------------------------------------------- (TODO: Code Refactoring | Keeping for later reference)
// cc: @neilblaze


// import React, { useState } from "react";

// function QualityOption({ quality, imgUrl, selectedIdx, setSelectedIdx, actionType }) {
//     const qualityCapitalized = quality[0].toUpperCase() + quality.slice(1);
//     const price = actionType === "sell" ? (quality === "low" ? "5" : "10") : (quality === "low" ? "2" : "6");
//     const backgroundColor = quality === "low" ? "#FA6B84" : "#00CDBB";
//     const qualityIdx = quality === "low" ? 0 : 1;
//     const actionLabel = actionType === "sell" ? "Advertise" : "Produce";

//     return (
//         <div className="text-center flex flex-col justify-center items-center" style={{ cursor: "pointer" }}
//             onClick={() => setSelectedIdx(qualityIdx)}>
//             <div className="option" style={{
//                 textAlign: "center", padding: "20px",
//                 backgroundColor: backgroundColor,
//                 color: "#FFF",
//                 border: "none",
//                 borderRadius: "15px",
//                 outline: selectedIdx === qualityIdx ? `4px solid ${backgroundColor}` : "none",
//                 outlineOffset: "3px",
//                 fontSize: "16px",
//                 marginRight: "10px",
//                 width: "370px"
//             }}>
//                 <h2 style={{ fontWeight: "bold", fontFamily: "Unbounded", fontSize: "24px" }}>
//                     {actionLabel} as {qualityCapitalized} Quality
//                 </h2>
//                 <p style={{ fontWeight: "lighter", fontFamily: "Archivo" }}>
//                     {actionType === "sell" ? `This will sell for $${price} in the market` : `This will cost you $${price} to produce, and you may advertise it as you wish.`}
//                 </p>
//             </div>
//             <img className="mb-6"
//                 style={{
//                     height: "375px",
//                     marginTop: "25px",
//                     borderRadius: "20px",
//                     filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))"
//                 }}
//                 src={imgUrl} alt={`${qualityCapitalized} quality toothpaste`} />
//         </div>
//     );
// }

// export function SellQualityOption({ quality, imgUrl, selectedIdx, setSelectedIdx }) {
//     return <QualityOption quality={quality} imgUrl={imgUrl} selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} actionType="sell" />;
// }

// export function MakeQualityOption({ quality, imgUrl, selectedIdx, setSelectedIdx }) {
//     return <QualityOption quality={quality} imgUrl={imgUrl} selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} actionType="make" />;
// }

// export default function App() {
//     const [selectedSellIdx, setSelectedSellIdx] = useState(null);
//     const [selectedMakeIdx, setSelectedMakeIdx] = useState(null);

//     return (
//         <div>
//             <h1>Sell Options</h1>
//             <SellQualityOption quality="low" imgUrl="url-to-low-quality-image" selectedIdx={selectedSellIdx} setSelectedIdx={setSelectedSellIdx} />
//             <SellQualityOption quality="high" imgUrl="url-to-high-quality-image" selectedIdx={selectedSellIdx} setSelectedIdx={setSelectedSellIdx} />

//             <h1>Make Options</h1>
//             <MakeQualityOption quality="low" imgUrl="url-to-low-quality-image" selectedIdx={selectedMakeIdx} setSelectedIdx={setSelectedMakeIdx} />
//             <MakeQualityOption quality="high" imgUrl="url-to-high-quality-image" selectedIdx={selectedMakeIdx} setSelectedIdx={setSelectedMakeIdx} />
//         </div>
//     );
// }
