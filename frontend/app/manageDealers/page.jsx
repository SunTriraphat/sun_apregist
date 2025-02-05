"use client";
import Navbar from "../../components/navBar/Navbar";
import React, { useEffect, useState, useCallback, useMemo, Suspense, use } from "react";

export default function ManageDealer() {
    const [dealers, setDealers] = useState([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        //fetch data
        const fetchDealers = async () => {

            const response = await fetch(`${API_URL}manage_dealer/list`);
            const data = await response.json();
            setDealers(data);
        };
        fetchDealers();
    }, []);
    console.log('dealers',dealers);
    

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold mb-4">Manage Dealers</h1>
                
            </div>
        </>
    );
}