import React, { useEffect, useState } from "react";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import Link from "next/link";
import { SelectPicker } from "rsuite";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import NetInsurance from '../dashBoard/NetInsurance'
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function BYDPage({ startDate, endDate }) {
    const [dataSource, setDataSource] = useState([]);
    const [totals, setTotals] = useState(0);
    const [modelData, setModelData] = useState([]);
    const [dataLine, setDataLine] = useState();
    const [selectedMonth, setSelectedMonth] = useState();
    const [month, setMonth] = useState();
    const [premiumNet, setPremiumNet] = useState();

    // Fetch Data
    const fetchData = async () => {
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await axios.get(`${API_URL}getbyd_summary`, { params });
            setDataSource(response.data.data);

            // console.log("response.data", response.data);

            const total = response.data.data.reduce((sum, item) => sum + item.count, 0);
            setTotals((prev) => ({ ...prev, byd: total }));
        } catch (error) {
            console.error("Error fetching BYD data:", error);
        }
    };

    // Fetch Model Data
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

    // Fetch Model Line Data
    const fetchModelLineMonth = async (month) => {
        try {
            const params = {};
            if (month) params.date_select = month;
            const response = await axios.get(`${API_URL}getbyd_model_line`, {
                params,
            });
            setDataLine(response.data);
        } catch (error) {
            console.error("Error fetching BYD model line data:", error);
        }
    };

    // Handle Date Range Changes
    useEffect(() => {
        if (startDate || endDate) {
            fetchData();
            fetchModelData();
        }
    }, [startDate, endDate]);

    // Generate Month Data
    const transformMont = (startDate, endDate) => {
        const months = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        let current = new Date(start);
        while (current <= end) {
            const formattedLabel = format(current, "MMMM yyyy", { locale: th });
            const formattedValue = format(current, "yyyy-MM");
            months.push({
                label: formattedLabel,
                value: formattedValue,
            });
            current.setMonth(current.getMonth() + 1);
        }
        return months;
    };

    // Set Month Options on Date Change
    useEffect(() => {
        if (startDate && endDate) {
            const months = transformMont(startDate, endDate);
            setSelectedMonth(months); // Update available months for selection
            if (months.length > 0) {
                setMonth(months[0].value); // Set the first month as the default selected
            }
        }
    }, [startDate, endDate]);

    // Fetch Model Line for the selected Month
    useEffect(() => {
        if (month) {
            fetchModelLineMonth(month);
        }
    }, [month]);

    const chunkData = (data, columns) => {
        const chunked = [];
        for (let i = 0; i < data.length; i += columns) {
            chunked.push(data.slice(i, i + columns));
        }
        return chunked;
    };

    const chunkedData = chunkData(dataSource, 7);

    const marketShare = [
        { x: "Bkk & Greater Bangkok", y: 52, text: "Bkk & Greater Bangkok: 52%" },
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

    const transformData = (dataLine) => {
        if (!dataLine || !Array.isArray(dataLine)) {
            return {}; // Return an empty object if no valid data is found
        }

        const transformedData = {};
        dataLine.forEach((item) => {
            const key = item.Model.toLowerCase().replace(/_/g, "");
            const dataArry = JSON.parse(item.data).sort((a, b) => {
                const weekA = parseInt(a.x.replace("week ", ""));
                const weekB = parseInt(b.x.replace("week ", ""));
                return weekA - weekB;
            });
            transformedData[key] = dataArry;
        });

        return transformedData;
    };
    const colors = [
        "bg-gradient-to-r from-blue-500 to-blue-400",
        "bg-gradient-to-r from-green-500 to-green-400",
        "bg-gradient-to-r from-purple-500 to-purple-400",
    ];
    const ModelLine = transformData(dataLine);

    const transformedData = [
        ...(ModelLine.atto3 || []).map((item) => ({ ...item, group: "atto3" })),
        ...(ModelLine.m6 || []).map((item) => ({ ...item, group: "m6" })),
        ...(ModelLine.dolphin || []).map((item) => ({ ...item, group: "dolphin" })),
        ...(ModelLine.seal || []).map((item) => ({ ...item, group: "seal" })),
        ...(ModelLine.sealion6 || []).map((item) => ({
            ...item,
            group: "sealion6",
        })),
        ...(ModelLine.sealion7 || []).map((item) => ({
            ...item,
            group: "sealion7",
        })),
    ];

    return (
        <>
            <div className="grid grid-cols-2 gap-6 bg-gray-50">
                {/* Left column */}
                {dataSource.length === 0 ? (
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg  ">
                        <div className="flex flex-col justify-center items-center h-full space-y-2">
                            <p className="text-gray-700 text-lg font-semibold text-center">
                                ไม่มีข้อมูลที่แสดงในขณะนี้
                            </p>
                            <p className="text-gray-500 text-sm text-center">
                                โปรดลองอีกครั้งในภายหลัง หรือเลือกช่วงเวลาที่แตกต่าง
                            </p>
                            <div className="flex flex-row justify-center items-end space-x-4 relative z-10 ">
                                <div className="circle animate-circle delay-0" />
                                <div className="circle animate-circle delay-1" />
                                <div className="circle animate-circle delay-2" />
                                <div className="circle animate-circle delay-3" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <PieChart
                                dataSource={dataSource}
                                title="สัดส่วนการแจ้งประกันภัย BYD"
                            />
                            <div className="grid grid-rows-2 gap-6">
                                {chunkedData.map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className="grid grid-cols-7 gap-4 py-4 px-6"
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
                                        <p>{new Intl.NumberFormat().format(totals.byd)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Right column */}
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <PieChart dataSource={marketShare} title="Market Share" />

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

            {/* Model Data */}

            <div className="grid grid-cols-2 gap-6 mt-10 h-full ">
                {modelData.length === 0 ? (
                    <>
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg h-96 flex flex-row justify-center items-center z-10">
                            <div className="grid grid-flow-row justify-center items-center   space-y-2">
                                <p className="text-gray-700 text-lg font-semibold text-center">
                                    ไม่มีข้อมูลที่แสดงในขณะนี้
                                </p>
                                <p className="text-gray-500 text-sm text-center">
                                    โปรดลองอีกครั้งในภายหลัง หรือเลือกช่วงเวลาที่แตกต่าง
                                </p>
                                <div className="flex flex-row justify-center items-end space-x-4 relative  ">
                                    <div className="circle animate-circle delay-0" />
                                    <div className="circle animate-circle delay-1" />
                                    <div className="circle animate-circle delay-2" />
                                    <div className="circle animate-circle delay-3" />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {" "}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <PieChart dataSource={modelData} title="Model" />
                        </div>
                    </>
                )}

                {/* Bar Chart */}
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <label htmlFor="dateLine" className="text-gray-700 mb-2 block">
                        เลือกช่วงเวลา
                    </label>
                    <SelectPicker
                        id="dateLine"
                        data={selectedMonth}
                        value={month}
                        onChange={(value) => {
                            setMonth(value);
                        }}
                        placeholder="เลือกช่วงเวลา"
                        style={{ width: "50%" }}
                    />
                    {transformedData.length === 0 ? (
                        <>
                            <div className="flex flex-col justify-center items-center h-full space-y-2 z-10">
                                <p className="text-gray-700 text-lg font-semibold text-center">
                                    ไม่มีข้อมูลที่แสดงในขณะนี้
                                </p>
                                <p className="text-gray-500 text-sm text-center">
                                    โปรดลองอีกครั้งในภายหลัง หรือเลือกช่วงเวลาที่แตกต่าง
                                </p>
                                <div className="flex flex-row justify-center items-end space-x-4 relative z-10 ">
                                    <div className="circle animate-circle delay-0" />
                                    <div className="circle animate-circle delay-1" />
                                    <div className="circle animate-circle delay-2" />
                                    <div className="circle animate-circle delay-3" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mt-8">
                                <BarChart dataSource={transformedData} title="Model" />
                            </div>
                        </>
                    )}
                </div>
            </div>

        </>
    );
}

export default BYDPage;
