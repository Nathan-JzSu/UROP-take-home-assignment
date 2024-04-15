import React from 'react';
import { cost_hi, cost_lo, price_hi, price_lo, value_hi, value_lo } from "../../constants";

function getColor(name) {
    if (name.toLowerCase().includes("low")) {
        return "#EF4444";
    } else if (name.toLowerCase().includes("high") || name.toLowerCase().includes("premium")) {
        return "#22C55E";
    } else {
        return "white";
    }
}

// cc: @abhishekshah

// // Credits: code modified off Chat-GPT
// function PayoffTable({ data }) {
//     // Assuming data is a 2D array where data[0] represents column names
//     // and each subsequent array represents a row with the first element as the row name
//     const columnNames = data[0];
//     const rows = data.slice(1);

//     return (
//         <table style={{ borderCollapse: 'collapse', width: '100%' }}>
//             <thead>
//                 <tr>
//                     {/* Render column names with blue color */}
//                     {columnNames.map((columnName, index) => (
//                         <th key={index} style={{ fontFamily: "Avenir", color: 'white', backgroundColor: getColor(columnName), border: '1px solid #ddd', padding: '8px' }}>
//                             {columnName}
//                         </th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody>
//                 {/* Render rows with orange-colored row names */}
//                 {rows.map((row, rowIndex) => (
//                     <tr key={rowIndex}>
//                         {/* Render row name with orange color */}
//                         <td style={{ fontFamily: "Avenir", fontWeight: "bold", color: 'white', backgroundColor: getColor(row[0]), border: '1px solid #ddd', padding: '8px' }}>
//                             {row[0]}
//                         </td>
//                         {/* Render row data */}
//                         {row.slice(1).map((cell, cellIndex) => (
//                             <td key={cellIndex} style={{ color: cell < 0 ? 'red' : (cell > 0 ? 'green' : ''), border: '1px solid #ddd', padding: '8px', backgroundColor: 'white' }}>
//                                 {(cell > 0 ? "+" : "") + cell + " points"}
//                             </td>
//                         ))}
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     );
// }

// export function PayoffMatrix({ role }) {
//     // const price_lo = 0.5 * (cost_lo + value_lo);
//     // const price_hi = 0.5 * (cost_hi + value_hi);
//     let data;

//     if (role == "consumer") {
//         data = [
//             ['', 'Advertised Quality - Low', 'Advertised Qulaity - High'],
//             ['Actual Quality - Low', value_lo - price_lo, value_lo - price_hi],
//             ['Actual Quality - High', value_hi - price_lo, value_hi - price_hi],
//         ];
//     } else if (role == "producer") {
//         data = [
//             ['', 'Advertised As - Low', 'Advertised As - High'],
//             ['Produced Quality - Low', price_lo - cost_hi, price_lo - cost_lo],
//             ['Produced Quality - High', price_hi - cost_hi, price_hi - cost_lo],
//             // Add more rows as needed
//         ];
//     }

//     return <PayoffTable data={data} />
// }


// ---------------------------------------------------------- (Code Refactoring | Keeping for later reference)
// cc: @neilblaze


function PayoffTable({ columnNames, rows }) {
    return (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                <tr>
                    {columnNames.map((columnName, index) => (
                        <th key={index}
                            style={{
                                fontFamily: "Archivo",
                                color: 'black',
                                backgroundColor: getColor(columnName),
                                border: '1px solid #ddd',
                                padding: '8px',
                                fontSize: "10px"
                            }}
                        >
                            {columnName}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <td style={{
                            fontFamily: "Archivo",
                            fontWeight: "bold",
                            color: 'black',
                            backgroundColor: getColor(row[0]),
                            border: '1px solid #ddd',
                            padding: '8px',
                            fontSize: "10px"
                        }}
                        >
                            {row[0]}
                        </td>
                        {row.slice(1).map((cell, cellIndex) => (
                            <td key={cellIndex} style={{
                                color: cell < 0 ? 'red' : (cell > 0 ? 'green' : ''),
                                border: '1px solid #ddd',
                                padding: '8px',
                                backgroundColor: 'white'
                            }}
                            >
                                {(cell > 0 ? "+" : "") + cell + " points"}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export function PayoffMatrix({ role }) {
    const consumerData = [
        ['Reward', 'Advertised Quality : Low', 'Advertised Quality : High'],
        ['Actual Quality : Low', value_lo - price_lo, value_lo - price_hi],
        ['Actual Quality : High', value_hi - price_lo, value_hi - price_hi],
    ];

    const producerData = [
        ['Reward', 'Advertised As : Low', 'Advertised As : High'],
        ['Produced Quality : Low', price_lo - cost_lo, price_hi - cost_lo],
        ['Produced Quality : High', price_lo - cost_hi, price_hi - cost_hi],
    ];

    const data = role === "consumer" ? consumerData : producerData;

    return <PayoffTable columnNames={data[0]} rows={data.slice(1)} />;
}
