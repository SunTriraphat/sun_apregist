import React from "react";
import Navbar from "../../components/navBar/Navbar";
import MenuDash from "../../components/menuDash/MenuDash";
import DealerCard from "../../components/DealerCard";

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
            dealer: "BYD susco beyond2",
            sunday: "37",
            lmg: "41",
            muangThai: "25",
            navakij: "2",
            tokioMarine: "13",
            viryah: "221",
            total: "337",
        },
        {
            dealer: "BYD susco beyond3",
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
            <div className="p-10 bg-gray-50 h-screen">
                <MenuDash />
                <div className="flex gap-5">
                    <h1 className="text-3xl text-gray-800 mb-2 font-bold text-start">
                        Top Dealers
                    </h1>
                </div>
                <div className="w-full grid gap-6">
                    <DealerCard
                        title="Top 10 Dealers"
                        dealers={dealers}
                        gradient="bg-gradient-to-r from-amber-500 to-amber-400"
                    />
                    <DealerCard
                        title="Eastern"
                        dealers={dealers}
                        gradient="bg-gradient-to-r from-violet-500 to-violet-400"
                    />
                    <DealerCard
                        title="Northeastern"
                        dealers={dealers}
                        gradient="bg-gradient-to-r from-violet-500 to-violet-400"
                    />
                    <DealerCard
                        title="Northern"
                        dealers={dealers}
                        gradient="bg-gradient-to-r from-violet-500 to-violet-400"
                    />
                    <DealerCard
                        title="Southern"
                        dealers={dealers}
                        gradient="bg-gradient-to-r from-violet-500 to-violet-400"
                    />
                    <DealerCard
                        title="Western & Northcentral"
                        dealers={dealers}
                        gradient="bg-gradient-to-r from-violet-500 to-violet-400"
                    />
                </div>
            </div>
        </>
    );
}

export default TopDealers;
