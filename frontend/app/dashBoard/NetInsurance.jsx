import React, { useEffect, useState } from "react";
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;
function NetInsurance({ startDate, endDate, option }) {
    const [insuranceData, setInsuranceData] = useState([]);
    const [insuranceDenza, setInsuranceDenza] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log("startDate", startDate);
    console.log("endDate", endDate);
    const fetchData = async () => {
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await axios.get(`${API_URL}getbyd_summary`, { params });
            const premiumData = response.data.premium;
            setInsuranceData(premiumData);

        } catch (error) {
            console.error("Error fetching BYD data:", error);
        } finally {
            setLoading(false);
        }
    };

    console.log("option", option);
    const fetchDataDenza = async () => {
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await axios.get(`${API_URL}getdenza_summary`, { params });
            const premiumData = response.data.premium;
            console.log("premiumDataDanza", premiumData);
            setInsuranceDenza(premiumData);

        } catch (error) {
            console.error("Error fetching BYD data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDataDenza();
    }, []);




    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <>
            {option === "BYD" ? (<> <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg mt-10">
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 p-8">
                        {/* First Section */}

                        <div className="bg-[#fef2f2] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <p className="font-bold text-2xl text-center mb-4 ">Voluntary</p>
                            <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                                <div className="text-center">Insurance</div>
                                <div className="text-center">Amount</div>
                                <div className="text-center">Net Premium</div>
                            </div>
                            <div className="mt-4 space-y-4">

                                {Object.entries(insuranceData).map(([key, data], index) => (
                                    <div key={index}>
                                        <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                                            <div className="text-center">{key.replace(/_/g, " ")}</div>
                                            <div className="text-center">{data.amount}</div>
                                            <div className="text-center">
                                                {new Intl.NumberFormat().format(data.total_pre)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all mt-4">
                                    <div className="text-center font-semibold">รวมทั้งหมด</div>
                                    <div className="text-center font-semibold">
                                        {Object.values(insuranceData).reduce((acc, item) => acc + item.amount, 0)}
                                    </div>
                                    <div className="text-center font-semibold">
                                        {new Intl.NumberFormat().format(
                                            Object.values(insuranceData).reduce((acc, item) => acc + item.total_pre, 0)
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#fffbeb] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <p className="font-bold text-2xl text-center mb-4 ">Compulsory</p>
                            <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                                <div className="text-center">Insurance</div>
                                <div className="text-center">Amount</div>
                                <div className="text-center">Net Premium</div>
                            </div>
                            <div className="mt-4 space-y-4">
                                {Object.entries(insuranceData).map(([key, data], index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all"
                                    >
                                        <div className="text-center">{key.replace(/_/g, " ")}</div>
                                        <div className="text-center">{data.amount}</div>
                                        <div className="text-center">
                                            {new Intl.NumberFormat().format(data.total_prb)}
                                        </div>
                                    </div>
                                ))}
                                <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                                    <div className="text-center font-semibold">รวมทั้งหมด</div>
                                    <div className="text-center font-semibold">
                                        {Object.values(insuranceData).reduce((acc, item) => acc + item.amount, 0)}
                                    </div>
                                    <div className="text-center font-semibold">
                                        {new Intl.NumberFormat().format(
                                            Object.values(insuranceData).reduce((acc, item) => acc + item.total_prb, 0)
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="bg-[#f0fdf4] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <p className="font-bold text-2xl text-center mb-4 ">Ew</p>
                            <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                                <div className="text-center">Insurance</div>
                                <div className="text-center">Amount</div>
                                <div className="text-center">Net Premium</div>
                            </div>
                             <div className="mt-4 space-y-4">
                            {data.map((item, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 text-sm py-3 px-4  rounded-lg shadow-sm  transition-all">
                                    <div className="text-center">{item.insurance}</div>
                                    <div className="text-center">{item.amount}</div>
                                    <div className="text-center">{item.netPremium}</div>
                                </div>
                            ))}  
                        </div> */}
                    </div>
                </>
            </div></>) : (
                <> <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg mt-10">
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 p-8">


                            <div className="bg-[#fef2f2] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                                <p className="font-bold text-2xl text-center mb-4 ">Voluntary</p>
                                <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                                    <div className="text-center">Insurance</div>
                                    <div className="text-center">Amount</div>
                                    <div className="text-center">Net Premium</div>
                                </div>
                                <div className="mt-4 space-y-4">

                                    {Object.entries(insuranceDenza).map(([key, data], index) => (
                                        <div key={index}>
                                            <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                                                <div className="text-center">{key.replace(/_/g, " ")}</div>
                                                <div className="text-center">{data.amount}</div>
                                                <div className="text-center">
                                                    {new Intl.NumberFormat().format(data.total_pre)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all mt-4">
                                        <div className="text-center font-semibold">รวมทั้งหมด</div>
                                        <div className="text-center font-semibold">
                                            {Object.values(insuranceDenza).reduce((acc, item) => acc + item.amount, 0)}
                                        </div>
                                        <div className="text-center font-semibold">
                                            {new Intl.NumberFormat().format(
                                                Object.values(insuranceDenza).reduce((acc, item) => acc + item.total_pre, 0)
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#fffbeb] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                                <p className="font-bold text-2xl text-center mb-4 ">Compulsory</p>
                                <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                                    <div className="text-center">Insurance</div>
                                    <div className="text-center">Amount</div>
                                    <div className="text-center">Net Premium</div>
                                </div>
                                <div className="mt-4 space-y-4">
                                    {Object.entries(insuranceDenza).map(([key, data], index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all"
                                        >
                                            <div className="text-center">{key.replace(/_/g, " ")}</div>
                                            <div className="text-center">{data.amount}</div>
                                            <div className="text-center">
                                                {new Intl.NumberFormat().format(data.total_prb)}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                                        <div className="text-center font-semibold">รวมทั้งหมด</div>
                                        <div className="text-center font-semibold">
                                            {Object.values(insuranceDenza).reduce((acc, item) => acc + item.amount, 0)}
                                        </div>
                                        <div className="text-center font-semibold">
                                            {new Intl.NumberFormat().format(
                                                Object.values(insuranceDenza).reduce((acc, item) => acc + item.total_prb, 0)
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="bg-[#f0fdf4] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <p className="font-bold text-2xl text-center mb-4 ">Ew</p>
                            <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                                <div className="text-center">Insurance</div>
                                <div className="text-center">Amount</div>
                                <div className="text-center">Net Premium</div>
                            </div>
                             <div className="mt-4 space-y-4">
                            {data.map((item, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 text-sm py-3 px-4  rounded-lg shadow-sm  transition-all">
                                    <div className="text-center">{item.insurance}</div>
                                    <div className="text-center">{item.amount}</div>
                                    <div className="text-center">{item.netPremium}</div>
                                </div>
                            ))}  
                        </div> */}
                        </div>
                    </>
                </div></>
            )}

        </>
    );
}

export default NetInsurance;
