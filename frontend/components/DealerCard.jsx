import React from "react";

const DealerCard = ({ title, dealers, gradient }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-5">
            <h3
                className={`text-xl font-semibold text-white rounded-lg shadow-md p-6 ${gradient} hover:shadow-xl transition-shadow duration-300`}
            >
                {title}
            </h3>
            <div className="overflow-x-auto mt-10">
                <div className="grid grid-cols-8 font-semibold text-sm text-gray-600 text-center border-b border-gray-300 pb-2 mb-4">
                    <div>Dealer</div>
                    <div>Sunday</div>
                    <div>Lmg</div>
                    <div>Muang Thai</div>
                    <div>Navakij</div>
                    <div>Tokio Marine</div>
                    <div>Viryah</div>
                    <div>Total</div>
                </div>
                {dealers.map((item, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-8 text-center text-gray-700 py-2 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                    >
                        <div className="w-40 font-semibold">{item.dealer}</div>
                        <div>{item.sunday}</div>
                        <div>{item.lmg}</div>
                        <div>{item.muangThai}</div>
                        <div>{item.navakij}</div>
                        <div>{item.tokioMarine}</div>
                        <div>{item.viryah}</div>
                        <div className="text-amber-500 font-semibold">
                            {item.total}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealerCard;
