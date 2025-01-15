import React from 'react';

const data = [
    { insurance: 'LMG', amount: 265, netPremium: '14,540,718' },
    { insurance: 'VIB', amount: 2468, netPremium: '53,235,000' },
    { insurance: 'Tokio', amount: 345, netPremium: '8,039,238' },
    { insurance: 'Total', amount: 3380, netPremium: '75,814,957.85' },
];

function NetInsurance() {
    return (
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
                    {data.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 text-sm py-3 px-4  rounded-lg shadow-sm  transition-all">
                            <div className="text-center">{item.insurance}</div>
                            <div className="text-center">{item.amount}</div>
                            <div className="text-center">{item.netPremium}</div>
                        </div>
                    ))}
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
                    {data.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 text-sm py-3 px-4  rounded-lg shadow-sm  transition-all">
                            <div className="text-center">{item.insurance}</div>
                            <div className="text-center">{item.amount}</div>
                            <div className="text-center">{item.netPremium}</div>
                        </div>
                    ))}
                </div>

            </div>
            <div className="bg-[#f0fdf4] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
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
                </div>
            </div>
        </div>
    );
}

export default NetInsurance;
