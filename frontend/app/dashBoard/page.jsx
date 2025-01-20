"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BYDPage from "./Byd";
import DenzaPage from "./Denza";
import NetInsurance from "./NetInsurance";
import { format } from "date-fns";
import { DatePicker, InputGroup, SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "./style.css";

const Page = () => {
    const [totals, setTotals] = useState({ byd: 0, denza: 0 });
    const [selectedOption, setSelectedOption] = useState("BYD");
    const today = format(new Date(), "yyyy-MM-dd")
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState();

    const handleSubmit = () => {
        console.log("Start Date:", startDate, "End Date:", endDate);
    };

    const brand = [
        { value: "BYD", label: "BYD" },
        { value: "Denza", label: "Denza" },
    ];

    useEffect(() => {
        handleSubmit()
    }, [today])
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
                                    const formattedDate = date ? format(date, "yyyy-MM-dd") : null;
                                    setStartDate(formattedDate);
                                    console.log("Start Date Updated:", formattedDate);
                                }}
                                block
                                appearance="subtle"
                                style={{ width: 160 }}
                            />

                            <InputGroup.Addon>ถึง</InputGroup.Addon>
                            <DatePicker
                                format="yyyy-MM-dd"
                                value={endDate ? new Date(endDate) : null}
                                onChange={(date) => {
                                    const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : null;
                                    setEndDate(formattedDate);
                                    console.log("End Date Updated:", formattedDate);
                                    handleSubmit();
                                }}
                                block
                                appearance="subtle"
                                style={{ width: 160 }}
                            />
                        </InputGroup>
                    </div>
                </div>
                {selectedOption === "BYD" && (
                    <BYDPage startDate={startDate} endDate={endDate} setTotals={setTotals} />
                )}
                {selectedOption === "Denza" && <DenzaPage setTotals={setTotals} />}
                <NetInsurance />
            </div>
        </>
    );
};

export default Page;
