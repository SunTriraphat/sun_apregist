"use client";
import Navbar from "../../components/Navbar";
import { useState } from "react";

export default function Page() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dateType, setDateType] = useState("coverage_date");
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        // Simulate data fetching
        setTimeout(() => {
            console.log({
                start_date: startDate,
                end_date: endDate,
                date_type: dateType,
            });
            setData(["Report Item 1", "Report Item 2"]); // Example data
            setIsLoading(false); // Stop loading
        }, 2000); // Simulate a 2-second delay
    };

    return (
        <>
            <Navbar />
            <div className="p-10 bg-gray-50 min-h-screen">
                <div className="max-w-full bg-white p-6 rounded-lg shadow-md">
                    {/* Form Section */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-wrap items-end gap-4"
                    >
                        {/* Dropdown */}
                        <div className="flex flex-col">
                            <label htmlFor="dateType" className="text-sm font-medium text-gray-700">
                                เลือกประเภทวันที่
                            </label>
                            <select
                                id="dateType"
                                value={dateType}
                                onChange={(e) => setDateType(e.target.value)}
                                className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="coverage_date">วันที่คุ้มครอง</option>
                                <option value="import_date">วันที่นำเข้า</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div className="flex flex-col">
                            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                                วันที่เริ่มต้น
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col">
                            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                                วันที่สิ้นสุด
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                ) : null}
                                {isLoading ? "กำลังโหลด..." : "ดึงรายงาน"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Report Section */}
                <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800">ผลการค้นหารายงาน</h2>
                    {data.length > 0 ? (
                        <ul className="mt-4 text-gray-700">
                            {data.map((item, index) => (
                                <li key={index} className="mb-2">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 mt-4">ยังไม่มีข้อมูลรายงานในขณะนี้...</p>
                    )}
                </div>
            </div>
        </>
    );
}
