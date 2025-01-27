import React, { useEffect, useState } from "react";
import PieChart from "../../components/charts/PieChart";
import axios from "axios";
import BarChart from "../../components/charts/BarChart";
import Link from "next/link";
import { MdNavigateNext } from "react-icons/md";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function DenzaPage({ startDate, endDate, option }) {
    const [denza, setDenza] = useState([]);
    const [totals, setTotals] = useState(0);
    const [modelData, setModelData] = useState([]);
    const [market, setMarket] = useState([]);
    const [topDealers, setTopDealers] = useState([]);
    const fetchMarketShare = async () => {
        try {
            const formData = new FormData();
            formData.append("start_date", startDate);
            formData.append("end_date", endDate);
            formData.append("brand", option);

            const response = await axios.post(`${API_URL}get_market_share`, formData);

            setMarket(response.data.marketShare);
            setTopDealers(response.data.top);
            localStorage.setItem("top", JSON.stringify(response.data.topByRegion));
            localStorage.setItem("top10", JSON.stringify(response.data.top10Dealers));
            localStorage.setItem("brand", JSON.stringify(option));
        } catch (error) {
            console.error("Error fetching BYD market share data:", error);
        }
    };
    console.log("Brand DENZA", option);

    const fetchData = async () => {
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await axios.get(`${API_URL}getdenza_summary`, {
                params,
            });
            // console.log("response.data DENZA", response.data);
            setDenza(response.data.data);
            const total = response.data.data.reduce((sum, item) => sum + item.count, 0);
            setTotals((prev) => ({ ...prev, denza: total }))
        } catch (error) {
            console.error("Error fetching Denza data:", error);
        }
    };

    const fetchModelData = async () => {
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await axios.get(`${API_URL}getbyd_model`, { params });
            setModelData(response.data);
        } catch (error) {
            console.error("Error fetching BYD model data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchModelData();
        fetchMarketShare()
    }, []);

    const dataMockup = {
        atto3: [
            { x: "Week 1", y: 6.02 },
            { x: "Week 2", y: 3.19 },
            { x: "Week 3", y: 3.28 },
            { x: "Week 4", y: 4.56 },
        ],
        m6: [
            { x: "Week 1", y: 5.32 },
            { x: "Week 2", y: 4.21 },
            { x: "Week 3", y: 4.87 },
            { x: "Week 4", y: 5.16 },
        ],
        dolphin: [
            { x: "Week 1", y: 7.12 },
            { x: "Week 2", y: 6.39 },
            { x: "Week 3", y: 5.28 },
            { x: "Week 4", y: 4.89 },
        ],
        seal: [
            { x: "Week 1", y: 8.45 },
            { x: "Week 2", y: 7.63 },
            { x: "Week 3", y: 6.91 },
            { x: "Week 4", y: 5.73 },
        ],
        sealion6: [
            { x: "Week 1", y: 9.56 },
            { x: "Week 2", y: 8.24 },
            { x: "Week 3", y: 7.89 },
            { x: "Week 4", y: 6.47 },
        ],
        selion7: [
            { x: "Week 1", y: 10.14 },
            { x: "Week 2", y: 9.63 },
            { x: "Week 3", y: 8.91 },
            { x: "Week 4", y: 7.45 },
        ],
    };

    const transformedData = [
        ...dataMockup.atto3.map((item) => ({ ...item, group: "atto3" })),
        ...dataMockup.m6.map((item) => ({ ...item, group: "m6" })),
        ...dataMockup.dolphin.map((item) => ({ ...item, group: "dolphin" })),
        ...dataMockup.seal.map((item) => ({ ...item, group: "seal" })),
        ...dataMockup.sealion6.map((item) => ({ ...item, group: "sealion6" })),
        ...dataMockup.selion7.map((item) => ({ ...item, group: "selion7" })),
    ];


    const chunkData = (data, columns) => {
        const chunked = [];
        for (let i = 0; i < data.length; i += columns) {
            chunked.push(data.slice(i, i + columns));
        }
        return chunked;
    };

    const chunkedDenza = chunkData(denza, 3);

    const colors = [
        "bg-gradient-to-r from-blue-500 to-blue-400",
        "bg-gradient-to-r from-green-500 to-green-400",
        "bg-gradient-to-r from-purple-500 to-purple-400",
    ];

    return (
        <>
            <div className="grid grid-cols-2 gap-6">
                {denza.length === 0 ? (
                    <>
                        <>
                            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg flex justify-center items-center text-xl font-semibold">
                                <div className="grid grid-flow-row justify-center items-center   space-y-2"> <p className="text-gray-700 text-lg font-semibold text-center">
                                    ไม่มีข้อมูลที่แสดงในขณะนี้
                                </p>
                                    <p className="text-gray-500 text-sm text-center">
                                        โปรดลองอีกครั้งในภายหลัง หรือเลือกช่วงเวลาที่แตกต่าง
                                    </p>
                                    <div className="flex flex-row justify-center items-end space-x-4 relative ">
                                        <div className="circle animate-circle delay-0" />
                                        <div className="circle animate-circle delay-1" />
                                        <div className="circle animate-circle delay-2" />
                                        <div className="circle animate-circle delay-3" />
                                    </div>
                                </div>
                            </div>
                        </>
                    </>
                ) : (
                    <>
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <PieChart
                                dataSource={denza}
                                title="สัดส่วนการแจ้งประกันภัย Denza"
                            />
                            <div className="grid grid-rows-2 gap-6">
                                {chunkedDenza.map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className="grid grid-cols-3 gap-4 py-4 px-6"
                                    >
                                        {row.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg shadow-md p-4 text-gray-700 text-xs font-semibold flex flex-col items-center justify-center"
                                            >
                                                <p className="text-center text-xs">{item.x}</p>
                                                <p className="text-center text-gray-500">
                                                    {new Intl.NumberFormat().format(item.count)}
                                                </p>
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
                    </>
                )}

                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <PieChart dataSource={market} title="Market Share" />
                    <PieChart dataSource={market} title="Market Share" />
                    <div className="flex space-x-5 py-2">
                        <div className="font-semibold text-gray-500 text-lg flex items-center">
                            Top Dealers
                        </div>
                        <Link href="/topDealers" className="button-link">
                            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white p-2 flex justify-center items-center w-28 duration-300 ease-in-out hover:bg-blue-800">
                                Read more <MdNavigateNext />
                            </div>
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2">
                        {topDealers.map((tops, index) => (
                            <div
                                key={index}
                                className={`${colors[index % colors.length]} text-white rounded-lg shadow-md p-6 text-sm font-semibold flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300`}
                            >
                                <p className="text-center text-base font-bold">{tops.dealer}</p>
                                <p className="text-center text-gray-200 text-lg mt-2">
                                    {tops.cont}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-10">
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <PieChart dataSource={modelData} title="Model" />
                </div> */}

                {/* Bar Chart */}
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <BarChart dataSource={transformedData} title="Model Chart" />
                </div> */}
            </div>
        </>
    );
}

export default DenzaPage;
