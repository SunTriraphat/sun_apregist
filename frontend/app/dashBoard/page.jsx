"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BYDPage from "./Byd";
import DenzaPage from "./Denza";
import NetInsurance from "./NetInsurance";
import { format, addDays, startOfMonth, endOfMonth } from "date-fns";
import { DatePicker, InputGroup, SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "./style.css";

const Page = () => {
    const [totals, setTotals] = useState({ byd: 0, denza: 0 });
    const [selectedOption, setSelectedOption] = useState("BYD");
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const [startDate, setStartDate] = useState(format(firstDayOfMonth, "yyyy-MM-dd"));
    const lastDayOfMonth = endOfMonth(today);

    const [endDate, setEndDate] = useState(format(lastDayOfMonth, "yyyy-MM-dd"));

    const handleSubmit = () => {
        console.log("Start Date:", startDate, "End Date:", endDate);
    };

    const brand = [
        { value: "BYD", label: "BYD" },
        { value: "Denza", label: "Denza" },
    ];

    useEffect(() => {
        // handleSubmit()
    }, [])
    return (
        <>
            <Navbar />
            <div className="p-10 bg-gray-50">
                <h1 className="text-3xl text-gray-800 mb-6">Dashboard</h1>
                <div className="flex items-center gap-16 mb-6">
                    <div className="flex-1 max-w-xs">
                        <label htmlFor="brand" className="text-gray-700 mb-2 block">
                            เลือกแบรนด์
                        </label>
                        <SelectPicker
                            id="brand"
                            data={brand}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            block
                            placeholder="เลือกแบรนด์"
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div className="flex-1 max-w-xs">
                        <label htmlFor="dateRange" className="text-gray-700 mb-2 block">
                            เลือกช่วงเวลา
                        </label>
                        <InputGroup className="flex items-center">
                            <DatePicker
                                format="yyyy-MM-dd"
                                value={startDate ? new Date(startDate) : null}
                                onChange={(date) => {
                                    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
                                    setStartDate(formattedDate); // กำหนดเป็น string
                                }}
                                block
                                appearance="subtle"
                                style={{ width: 160 }}
                            />

                            <DatePicker
                                format="yyyy-MM-dd"
                                value={endDate ? new Date(endDate) : null}
                                onChange={(date) => {
                                    const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : "";
                                    setEndDate(formattedDate); // กำหนดเป็น string
                                }}
                                block
                                appearance="subtle"
                                style={{ width: 160 }}
                            />

                        </InputGroup>
                        {/* <button
                            onClick={handleSubmit}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            ส่งข้อมูล
                        </button> */}
                    </div>
                </div>
                {selectedOption === "BYD" && (
                    <BYDPage startDate={startDate} endDate={endDate} setTotals={setTotals} />
                )}
                {selectedOption === "Denza" && <DenzaPage startDate={startDate} endDate={endDate} setTotals={setTotals} />}
                <NetInsurance />
            </div>
        </>
    );
};

export default Page;
