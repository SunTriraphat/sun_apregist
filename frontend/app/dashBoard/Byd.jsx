import React, { useEffect, useState } from "react";
import PieChart from "../../components/charts/PieChart";
import {
    ChartComponent,
    SeriesCollectionDirective,
    SeriesDirective,
    Inject,
    ColumnSeries,
    Category,
    DataLabel,
} from "@syncfusion/ej2-react-charts";
import BarChart from "../../components/charts/BarChart";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function BYDPage() {
    const [dataSource, setDataSource] = useState([]);
    const [totals, setTotals] = useState(0);
    const [modelData, setModelData] = useState([]); // State สำหรับเก็บข้อมูลจาก getbyd_model

    // ฟังก์ชันสำหรับเรียก API และอัพเดตสถานะ
    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}getbyd_summary`);
            setDataSource(response.data);
            const total = response.data.reduce(
                (sum, currentObject) => sum + currentObject.count,
                0
            );
            setTotals((prev) => ({ ...prev, byd: total }));
        } catch (error) {
            console.error("Error fetching BYD data:", error);
        }
    };

    // ฟังก์ชันสำหรับดึงข้อมูลจาก getbyd_model API
    const fetchModelData = async () => {
        try {
            const response = await axios.get(`${API_URL}getbyd_model`);
            setModelData(response.data); // เก็บข้อมูลที่ได้จาก API
        } catch (error) {
            console.error("Error fetching BYD model data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchModelData(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล model
    }, []);

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

    const data = [
        { x: "Q1", y: 30, color: "red" },
        { x: "Q2", y: 50, color: "green" },
        { x: "Q3", y: 70, color: "blue" },
        { x: "Q4", y: 90, color: "purple" },
    ];
    return (
        <>
            <div className="grid grid-cols-2 gap-6">
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
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <PieChart dataSource={marketShare} title="Market Share" />
                </div>
            </div>

            {/* Section to display the model data in a PieChart */}
            <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <PieChart dataSource={modelData} title="Model" />
                </div>

                {/* Bar Chart */}
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">

                    <BarChart dataSource={modelData} title="Model Chart" />
                </div>
            </div>
        </>
    );
}

export default BYDPage;
