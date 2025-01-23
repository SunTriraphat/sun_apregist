import React from "react";
import Navbar from "../../components/navBar/Navbar";
import { AiOutlineCrown } from "react-icons/ai";
import Link from "next/link";
import { MdNavigateBefore } from "react-icons/md";
import MenuDash from '../../components/menuDash/MenuDash'
function TopDealers() {
    const dealers = [
        {
            dealer: "BYD susco beyond",
            sunday: "37",
            lmg: "41",
            muangThai: "25",
            navakij: "2",
            tokioMarine: "13",
            viryah: "221",
            total: "337",
        },
        {
            dealer: "BYD susco beyond",
            sunday: "37",
            lmg: "41",
            muangThai: "25",
            navakij: "2",
            tokioMarine: "13",
            viryah: "221",
            total: "337",
        },
        {
            dealer: "BYD susco beyond",
            sunday: "37",
            lmg: "41",
            muangThai: "25",
            navakij: "2",
            tokioMarine: "13",
            viryah: "221",
            total: "337",
        },
    ];

    return (
        <>
            <Navbar />

            <div className="p-10 bg-gray-50 h-screen  ">
                <div> <MenuDash /></div>
                <div className="flex gap-5  ">

                    {/* <Link href="/dashBoard" className="button-link">
                        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white p-2 flex justify-center items-center w-20 duration-300 ease-in-out hover:bg-blue-800">
                            <MdNavigateBefore />   Back
                        </div>
                    </Link> */}
                    <h1 className="text-3xl text-gray-800 mb-2  font-bold text-start">
                        Top Dealers
                    </h1>
                </div>



                {/* <div className="w-full grid grid-cols-[2fr_2fr] gap-6  "> */}
                <div className="w-full grid   gap-6  ">
                    <div className="flex flex-col">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl   font-semibold text-white rounded-lg shadow-md p-6 bg-gradient-to-r from-amber-500  to-amber-400    hover:shadow-xl transition-shadow duration-300  ">
                                Top 10 Dealers
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
                                        className={`grid grid-cols-8 text-center text-gray-700 py-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                    >
                                        <div className="w-40 font-semibold ">{item.dealer}</div>
                                        <div>{item.sunday}</div>
                                        <div>{item.lmg}</div>
                                        <div>{item.muangThai}</div>
                                        <div>{item.navakij}</div>
                                        <div>{item.tokioMarine}</div>
                                        <div>{item.viryah}</div>
                                        <div className="text-amber-500 font-semibold" >
                                            {item.total}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 mt-5">
                            <h3 className="text-xl   font-semibold text-white rounded-lg shadow-md p-6 bg-gradient-to-r from-violet-500 to-violet-400     hover:shadow-xl transition-shadow duration-300  ">
                                Eastern
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
                                        className={`grid grid-cols-8 text-center text-gray-700 py-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                    >
                                        <div className="w-40 font-semibold ">{item.dealer}</div>
                                        <div>{item.sunday}</div>
                                        <div>{item.lmg}</div>
                                        <div>{item.muangThai}</div>
                                        <div>{item.navakij}</div>
                                        <div>{item.tokioMarine}</div>
                                        <div>{item.viryah}</div>
                                        <div className="text-violet-500 font-semibold" >
                                            {item.total}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 mt-5">
                            <h3 className="text-xl   font-semibold text-white rounded-lg shadow-md p-6 bg-gradient-to-r from-violet-500 to-violet-400    hover:shadow-xl transition-shadow duration-300  ">
                                Northeastern
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
                                        className={`grid grid-cols-8 text-center text-gray-700 py-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                    >
                                        <div className="w-40 font-semibold ">{item.dealer}</div>
                                        <div>{item.sunday}</div>
                                        <div>{item.lmg}</div>
                                        <div>{item.muangThai}</div>
                                        <div>{item.navakij}</div>
                                        <div>{item.tokioMarine}</div>
                                        <div>{item.viryah}</div>
                                        <div className="text-violet-500 font-semibold" >
                                            {item.total}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 mt-5">
                            <h3 className="text-xl   font-semibold text-white rounded-lg shadow-md p-6 bg-gradient-to-r from-violet-500 to-violet-400    hover:shadow-xl transition-shadow duration-300  ">
                                Northern
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
                                        className={`grid grid-cols-8 text-center text-gray-700 py-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                    >
                                        <div className="w-40 font-semibold ">{item.dealer}</div>
                                        <div>{item.sunday}</div>
                                        <div>{item.lmg}</div>
                                        <div>{item.muangThai}</div>
                                        <div>{item.navakij}</div>
                                        <div>{item.tokioMarine}</div>
                                        <div>{item.viryah}</div>
                                        <div className="text-violet-500 font-semibold" >
                                            {item.total}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 mt-5">
                            <h3 className="text-xl   font-semibold text-white rounded-lg shadow-md p-6 bg-gradient-to-r from-violet-500 to-violet-400    hover:shadow-xl transition-shadow duration-300  ">
                                Southern
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
                                        className={`grid grid-cols-8 text-center text-gray-700 py-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                    >
                                        <div className="w-40 font-semibold ">{item.dealer}</div>
                                        <div>{item.sunday}</div>
                                        <div>{item.lmg}</div>
                                        <div>{item.muangThai}</div>
                                        <div>{item.navakij}</div>
                                        <div>{item.tokioMarine}</div>
                                        <div>{item.viryah}</div>
                                        <div className="text-violet-500 font-semibold" >
                                            {item.total}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 mt-5">
                            <h3 className="text-xl   font-semibold text-white rounded-lg shadow-md p-6 bg-gradient-to-r from-violet-500 to-violet-400    hover:shadow-xl transition-shadow duration-300  ">
                                Western & Northcental
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
                                        className={`grid grid-cols-8 text-center text-gray-700 py-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                    >
                                        <div className="w-40 font-semibold ">{item.dealer}</div>
                                        <div>{item.sunday}</div>
                                        <div>{item.lmg}</div>
                                        <div>{item.muangThai}</div>
                                        <div>{item.navakij}</div>
                                        <div>{item.tokioMarine}</div>
                                        <div>{item.viryah}</div>
                                        <div className="text-violet-500 font-semibold" >
                                            {item.total}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center text-gray-700 text-lg"> */}
                    {/* <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl   font-semibold text-white rounded-lg shadow-md p-6 bg-gradient-to-r from-amber-500  to-amber-400    hover:shadow-xl transition-shadow duration-300  ">
                            Top 10 Dealers
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
                                    className={`grid grid-cols-8 text-center text-gray-700 py-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        }`}
                                >
                                    <div className="w-40 font-semibold ">{item.dealer}</div>
                                    <div>{item.sunday}</div>
                                    <div>{item.lmg}</div>
                                    <div>{item.muangThai}</div>
                                    <div>{item.navakij}</div>
                                    <div>{item.tokioMarine}</div>
                                    <div>{item.viryah}</div>
                                    <div className="text-amber-500 font-semibold" >
                                        {item.total}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>
            </div>
            {/* </div> */}
        </>
    );
}

export default TopDealers;
