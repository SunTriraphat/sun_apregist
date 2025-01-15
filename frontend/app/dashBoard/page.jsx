"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import BYDPage from "./Byd";
import DenzaPage from "./Denza";
import NetInsurance from "./NetInsurance";
import { DateRangePicker, Select, SelectItem, Autocomplete, AutocompleteItem } from "@nextui-org/react";


const Page = () => {
    const [totals, setTotals] = useState({ byd: 0, denza: 0 });
    const [selectedOption, setSelectedOption] = useState("BYD");
    const [selectedCountry, setSelectedCountry] = useState("US");

    const onChange = (value) => {
        setSelectedOption(value);
    };

    const brand = [
        { key: 'BYD', label: 'BYD' },
        { key: 'Denza', label: 'Denza' }
    ]


    const region = [
        { key: 'US', label: 'United States' },
        { key: 'TH', label: 'Thailand' },
    ];

    return (
        <>
            <Navbar />
            <div className="p-10 bg-gray-50">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">แดชบอร์ด</h1>

                {/* Dropdown for selecting data */}
                <div className="flex gap-24 mb-6 justify-end">
                    <div className="flex justify-end">
                        <select
                            value={selectedOption}
                            onChange={(e) => onChange(e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 p-2 text-lg text-gray-700 shadow-sm hover:border-blue-500 transition duration-200 ease-in-out w-40"
                        >
                            <option value="BYD">BYD</option>
                            <option value="Denza">Denza</option>
                        </select>
                    </div>

                    <div>
                        {/* <DateRangePicker className="max-w-xs" label="Stay duration" /> */}
                    </div>
                </div>





                {/* Display data based on selection */}
                {selectedOption === "BYD" && <BYDPage setTotals={setTotals} />}
                {selectedOption === "Denza" && <DenzaPage setTotals={setTotals} />}
                <div className="mb-5" >
                    <NetInsurance />
                </div>
            </div>
        </>
    );
};

export default Page;
