"use client";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import CustomTableClassic from "../../components/CustomTableClassic";
import ExcelJS from "exceljs";

export default function Page() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dateType, setDateType] = useState("coverage_date");
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        { key: "DateTimeUtc", label: "DateTimeUtc" },
        { key: "EffectiveDateStart", label: "EffectiveDateStart" },
        { key: "Model", label: "Model" },
        { key: "SubModel", label: "SubModel" },
        { key: "PolicyStatus", label: "PolicyStatus" },
        { key: "InsuranceProvider", label: "InsuranceProvider" },
        { key: "Vin", label: "Vin" },
        { key: "Color", label: "Color" },
        { key: "CustomerFirstName", label: "CustomerFirstName" },
        { key: "CustomerLastName", label: "CustomerLastName" },
        { key: "DealershipName", label: "DealershipName" },
    ];

    // ฟังก์ชันดึงข้อมูลรายงาน
    const handleFetchReport = async (type) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}report/query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate,
                    query_type: dateType,
                }),
            });

            if (!response.ok) {
                throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
            }

            const result = await response.json();
            setData(result);

            if (type === "xlsx") {
                await generateExcel(result);
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
        } finally {
            setIsLoading(false);
        }
    };

    // ฟังก์ชันสร้างไฟล์ Excel
    const generateExcel = async (reportData) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Report");

        // เพิ่มหัวตาราง
        worksheet.columns = columns.map((col) => ({
            header: col.label,
            key: col.key,
            width: 20,
        }));

        // เพิ่มข้อมูลในตาราง
        reportData.forEach((item) => {
            worksheet.addRow(item);
        });

        // สร้างไฟล์ Excel
        const buffer = await workbook.xlsx.writeBuffer();

        // ดาวน์โหลดไฟล์ Excel
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    return (
        <>
            <Navbar />
            <div className="p-10 bg-gray-50 min-h-screen">
                <div className="max-w-full bg-white p-6 rounded-lg shadow-md">
                    {/* Form Section */}
                    <form
                        onSubmit={(e) => e.preventDefault()}
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

                        {/* Preview Button */}
                        <div>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleFetchReport("preview")}
                                className={`inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                ดูตัวอย่าง
                            </button>
                        </div>

                        {/* Download XLSX Button */}
                        <div>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleFetchReport("xlsx")}
                                className={`inline-flex items-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                ดาวน์โหลด XLSX
                            </button>
                        </div>
                    </form>
                </div>

                {/* Report Section */}
                <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800">ผลการค้นหารายงาน</h2>
                    {data.length > 0 ? (
                        <CustomTableClassic data={data} columns={columns} />
                    ) : (
                        <p className="text-gray-600 mt-4">ยังไม่มีข้อมูลรายงานในขณะนี้...</p>
                    )}
                </div>
            </div>
        </>
    );
}
