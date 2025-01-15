import React, { useEffect, useState } from "react";
import PieChart from "../../components/charts/PieChart";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function DenzaPage({ }) {
    const [denza, setDenza] = useState([]);
    const [totals, setTotals] = useState(0);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}getdenza_summary`);
            setDenza(response.data);
            const total = response.data.reduce((sum, currentObject) => sum + currentObject.count, 0);
            setTotals((prev) => ({ ...prev, denza: total }));
        } catch (error) {
            console.error("Error fetching Denza data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const chunkData = (data, columns) => {
        const chunked = [];
        for (let i = 0; i < data.length; i += columns) {
            chunked.push(data.slice(i, i + columns));
        }
        return chunked;
    };

    const chunkedDenza = chunkData(denza, 3);

    return (
        <>
            <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <PieChart dataSource={denza} title="สัดส่วนการแจ้งประกันภัย Denza" />
                    <div className="grid grid-rows-2 gap-6">
                        {chunkedDenza.map((row, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-3 gap-4 py-4 px-6">
                                {row.map((item, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-md p-4 text-gray-700 text-xs font-semibold flex flex-col items-center justify-center">
                                        <p className="text-center text-xs">{item.x}</p>
                                        <p className="text-center text-gray-500">{new Intl.NumberFormat().format(item.count)}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4 py-4 px-6 bg-gray-100 rounded-lg mt-4 justify-center items-center">
                            <div className="text-center font-semibold text-lg text-gray-700">
                                <p>Total</p>
                            </div>
                            <div className="text-center text-gray-500 font-semibold text-lg">
                                <p>{new Intl.NumberFormat().format(totals.denza)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">

                </div>
            </div>
        </>
    );
}

export default DenzaPage;
