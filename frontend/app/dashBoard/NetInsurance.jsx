import React, { useEffect, useState } from "react";
import axios from "axios";

const data = [
    { insurance: 'LMG', amount: 265, netPremium: '14,540,718' },
    { insurance: 'VIB', amount: 2468, netPremium: '53,235,000' },
    { insurance: 'Tokio', amount: 345, netPremium: '8,039,238' },
    { insurance: 'Total', amount: 3380, netPremium: '75,814,957.85' },
];

// const API_URL = process.env.NEXT_PUBLIC_NETINSURANCE;
// const Url = `${API_URL}api/cost/lmg/brand/get/275`;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
function NetInsurance({ startDate, endDate }) {
    const [insuranceData, setInsuranceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [voluntary, setVoluntary] = useState();
    const [compulosry, setCompulosry] = useState();
    const [error, setError] = useState(null);
    const [premium, setPremium] = useState()

    const [lmg, setLmg] = useState(null);
    const [navakij, setNavakij] = useState(null);
    const [tokioMarine, setTokioMarine] = useState(null);
    const [muangThai, setMuangThai] = useState(null);
    const [viriyah, setViriyah] = useState(null);


    console.log("insuranceData", insuranceData);

    // const [totals, setTotals] = useState({
    //     totalPre: 0,
    //     totalPrb: 0,
    //     totalItems: 0
    // });

    console.log("startDate", startDate);
    console.log("endDate", endDate);
    const fetchData = async () => {
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await axios.get(`${API_URL}getbyd_summary`, { params });
            const premiumData = response.data.premium;
            setLmg(premiumData.LMG);
            // setInsuranceData(response.data.premium);
            // setSunday(premiumData.SUNDAY);
            // setLmg(premiumData.LMG);
            // setNavakij(premiumData.NAVAKIJ);
            // setTokioMarine(premiumData.TOKIO_MARINE);
            // setMuangThai(premiumData.MUANG_THAI);
            // setViriyah(premiumData.VIRIYAH);

            console.log("response.data", response.data.premium);


        } catch (error) {
            console.error("Error fetching BYD data:", error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    console.log("LMG", lmg);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const params = {};
    //             if (startDate) params.start_date = startDate;
    //             if (endDate) params.end_date = endDate;

    //             const response = await axios.get(`${API_URL}getbyd_summary`, { params });
    //             // if (response.data.some(item => item.comp)) {
    //             //     setCompulosry("LMG");
    //             // }

    //             setInsuranceData(response.data.data);
    //             console.log("response.data net", response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             setError('Error fetching data');
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        if (insuranceData.length > 0) {
            const totalPre = insuranceData.reduce((acc, item) => acc + parseFloat(item.pre), 0);
            const totalPrb = insuranceData.reduce((acc, item) => acc + parseFloat(item.prb), 0);
            const totalItems = insuranceData.length;

            setTotals({
                totalPre: totalPre,
                totalPrb: totalPrb,
                totalItems: totalItems
            });
        }
    }, [insuranceData]);

    // if (loading) {
    //     return <div className="text-center">Loading...</div>;
    // }
    // console.log("insuranceData", insuranceData);
    // console.log("totals", totals);
    // console.log("compulosry", compulosry);

    return (
        <>
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg mt-10">

                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
                        {/* First Section */}
                        <div className="bg-[#fef2f2] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <p className="font-bold text-2xl text-center mb-4 ">Voluntary</p>
                            <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                                <div className="text-center">Insurance</div>
                                <div className="text-center">Amount</div>
                                <div className="text-center">Net Premium</div>

                            </div>
                            <div className="mt-4 space-y-4">
                                {/* Check if 'lmg' is an array before calling .map() */}
                                {Array.isArray(lmg) ? (
                                    lmg.map((item, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                                            <div className="text-center">{item.insurance}</div>
                                            <div className="text-center">{item.amount}</div>
                                            <div className="text-center">
                                                {new Intl.NumberFormat().format(item.netPremium)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center">No data available</div>
                                )}
                            </div>
                        </div>

                        {/* Placeholder for additional sections */}
                        <div className="bg-[#fffbeb] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <p className="font-bold text-2xl text-center mb-4 ">Compulosry</p>
                            <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                                <div className="text-center">Insurance</div>
                                <div className="text-center">Amount</div>
                                <div className="text-center">Net Premium</div>
                            </div>
                            <div className="mt-4 space-y-4">
                                {/* <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4  rounded-lg shadow-sm  transition-all">
                                <div className="text-center">{compulosry}</div>
                                <div className="text-center">{totals.totalItems}</div>
                                <div className="text-center"> {new Intl.NumberFormat().format(totals.totalPrb)}</div>
                            </div> */}
                            </div>

                        </div>

                        <div className="bg-[#f0fdf4] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <p className="font-bold text-2xl text-center mb-4 ">Ew</p>
                            <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                                <div className="text-center">Insurance</div>
                                <div className="text-center">Amount</div>
                                <div className="text-center">Net Premium</div>
                            </div>
                            {/* <div className="mt-4 space-y-4">
                            {data.map((item, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 text-sm py-3 px-4  rounded-lg shadow-sm  transition-all">
                                    <div className="text-center">{item.insurance}</div>
                                    <div className="text-center">{item.amount}</div>
                                    <div className="text-center">{item.netPremium}</div>
                                </div>
                            ))}
                        </div> */}
                        </div>
                    </div>
                </>


            </div>
        </>
    );
}

export default NetInsurance;
