"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";

import axios from "axios";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [disPlay, setDisPlay] = useState(false);
  const [vin, setVin] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // const searchParams = useSearchParams();
  // let vin = searchParams.get('vin');
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const vinParam = queryParams.get('vin');
    setVin(vinParam);
  }, []);

  useEffect(() => {
    if (vin) {
      fetchData(vin);
    }
  }, [API_URL, vin]);

  const fetchData = async (vin) => {
    try {
      const response = await axios.post(`${API_URL}getdata_detail`, { vin: vin }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response', response);
      setFilteredData(response.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatDateToDMY = (date) => {
    if (!date) return ""; // Handle cases where the date might be undefined
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <>
      <Navbar />

        {filteredData ? (
          <>
            <div className="m-5 pl-8">
              <h1 className="text-2xl font-bold text-gray-800">General Vehicle</h1>
              <Divider style={{ width: "20%" }} />
            </div>
            <div className="pl-8">
              <div className="bg-white pl-5 rounded">
                <div>
                  <div className="grid grid-cols-4 gap-4 mt-9">
                    <div className="mb-2 pb-2 border-b">
                      <p className="font-light text-sm text-gray-700 mb-1">
                        วันที่เบิกรถ
                      </p>
                      <p className="font-semibold">{filteredData.date}</p>
                    </div>
                    <div className="mb-2 pb-2 border-b">
                      <p className="font-light text-sm text-gray-700 mb-1">
                        Dealer
                      </p>
                      <p className="font-semibold">{filteredData.DealershipName ? filteredData.DealershipName : '-'}</p>
                    </div>
                    <div className="mb-2 pb-2 border-b">
                      <p className="font-light text-sm text-gray-700 mb-1">
                        Model
                      </p>
                      <p className="font-semibold">{filteredData.Model ? filteredData.Model : '-'}</p>
                    </div>
                    <div className="mb-2 pb-2 border-b">
                      <p className="font-light text-sm text-gray-700 mb-1">
                        Sub Model
                      </p>
                      <p className="font-semibold">{filteredData.SubModel ? filteredData.SubModel : '-'}</p>
                    </div>
                    <div className="mb-2 pb-2 border-b">
                      <p className="font-light text-sm text-gray-700 mb-1">
                        Vin No.
                      </p>
                      <p className="font-semibold">{filteredData.vin_no ? filteredData.vin_no : '-'}</p>
                    </div>
                    <div className="mb-2 pb-2 border-b">
                      <p className="font-light text-sm text-gray-700 mb-1">
                        Dealer
                      </p>
                      <p className="font-semibold">{filteredData.DealershipName ? filteredData.DealershipName : '-'}</p>
                    </div>
                    <div className="mb-2 pb-2 border-b">
                      <p className="font-light text-sm text-gray-700 mb-1">
                        Date Delivery
                      </p>
                      <p className="font-semibold">{filteredData.Date_Delivery}</p>
                    </div>
                  </div>

                  <h1 className="mt-5 text-2xl font-bold text-gray-800">Insurance Effective</h1>
                  <Divider style={{ width: "20%" }} />

                  <div className="grid grid-cols-4 gap-4 mt-9">
                    <div className="mb-2 pb-2 border-b">
                      <p className="font-light text-sm text-gray-700 mb-1">
                        ชื่อลูกค้า
                      </p>
                      <p className="font-semibold">{filteredData.CustomerFirstName} {filteredData.CustomerLastName}</p>
                    </div>
                  </div>

                  {/* More sections here as per your code */}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="pl-12">ไม่พบข้อมูลที่ตรงกับการค้นหา</div>
        )}
  
    </>
  );
}

export default Page;
