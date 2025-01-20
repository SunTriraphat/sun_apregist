import React, { useEffect, useState } from "react";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function BYDPage() {
    const [dataSource, setDataSource] = useState([]);
    const [totals, setTotals] = useState(0);
    const [modelData, setModelData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const router = useRouter();
    // State for start and end dates
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchData = async (startDate, endDate) => {
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            // เรียก API พร้อมส่ง params
            const response = await axios.get(`${API_URL}getbyd_summary`, { params });

            // การกรองข้อมูล
            const filteredData = response.data.filter((item) => {
                const itemDate = new Date(item.date);
                return (
                    (!startDate || itemDate >= new Date(startDate)) &&
                    (!endDate || itemDate <= new Date(endDate))
                );
            });

            setDataSource(filteredData);

            const total = filteredData.reduce(
                (sum, currentObject) => sum + currentObject.count,
                0
            );
            setTotals((prev) => ({ ...prev, byd: total }));

        } catch (error) {
            console.error("Error fetching BYD data:", error);
        }
    };


    console.log("startDate", startDate);

    const fetchModelData = async () => {
        try {
            const response = await axios.get(`${API_URL}getbyd_model`);
            setModelData(response.data);
        } catch (error) {
            console.error("Error fetching BYD model data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchModelData();
    }, []);

    const handleDateRangeChange = (value) => {
        setDateRange(value);
        fetchData(value[0], value[1]);
    };

    // Chunking function (you may want to modify it based on your data)
    const chunkData = (data, columns) => {
        const chunked = [];
        for (let i = 0; i < data.length; i += columns) {
            chunked.push(data.slice(i, i + columns));
        }
        return chunked;
    };

    const chunkedData = chunkData(dataSource, 7);


    const marketShare = [
        { x: "Bkk & Greater Bangkok", y: 52, text: "Bkk & Greater Bangkok: 52% " },
        { x: "Eastern", y: 13, text: "Eastern: 13%" },
        { x: "Northeastern", y: 10, text: "Northeastern: 10%" },
        { x: "Northern", y: 9, text: "Northern: 9%" },
        { x: "Southern", y: 6, text: "Southern: 6%" },
        { x: "Western & Northcentral", y: 10, text: "Western & Northcentral: 10%" },
    ];

    const top = [
        { dealer: "Byd susco beyone", cont: 337 },
        { dealer: "Byd Jinlong Motors", cont: 306 },
        { dealer: "Byd Metromobile", cont: 236 },
    ];

    const colors = [
        "bg-gradient-to-r from-violet-500 to-violet-400",
        "bg-gradient-to-r from-green-500 to-green-400",
        "bg-gradient-to-r from-pink-500 to-pink-400",
    ];

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

    console.log("modelData", modelData);

    return (
        <>
            <div className="grid grid-cols-2 gap-6 bg-gray-50">

                {/* Left column */}
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <PieChart
                        dataSource={dataSource}
                        title="สัดส่วนการแจ้งประกันภัย BYD"
                    />
                    <div className="grid grid-rows-2 gap-6">
                        {chunkedData.map((row, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-7 gap-4 py-4 px-6">
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
                                <p>{new Intl.NumberFormat().format(totals.byd)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="p-6  bg-white border border-gray-200 rounded-lg shadow-lg">
                    <PieChart dataSource={marketShare} title="Market Share" />

                    <PieChart dataSource={marketShare} title="Market Share" />
                    <div className="flex space-x-5 py-2">
                        <div className="font-semibold text-gray-500 text-lg flex items-center">
                            Top 3 Dealers
                        </div>
                        <Link href="/topDealers" className="button-link">
                            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white p-2 flex justify-center items-center w-28 duration-300 ease-in-out hover:bg-blue-800">
                                Read more <MdNavigateNext />
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-4">
                        {top.map((tops, index) => (
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
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <PieChart dataSource={modelData} title="Model" />
                </div>

                {/* Bar Chart */}
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <BarChart dataSource={transformedData} title="Model Chart" />
                </div>
            </div>
        </>
    );
}

export default BYDPage;
