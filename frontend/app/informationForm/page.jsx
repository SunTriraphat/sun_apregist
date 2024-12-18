"use client";
import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import numeral from "numeral";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Spinner
} from "@nextui-org/react";
import { PlusIcon } from "./Pluslcon";
import { VerticalDotsIcon } from "./VerticalDotslcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { addShowData } from "../store/slice/showDataSlice";
import CustomTable from "../../components/CustomTable";
import { Link } from "next/link"

const statusColorMap = {
  Done: "success",
  Progress: "primary",
  Rejected: "danger",
  Hold: "default",
};

const INITIAL_VISIBLE_COLUMNS = [
  "DateTimeUtc",
  "policy_no",
  "start_date",
  "end_date",
  "brand",
  "Model",
  "vin_no",
  "InsuranceProvider",
  "stock",
  "payment_month",
  "date_recieved",
  "remark",
  // "actions",
];


export default function App() {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState();

  const [totalRecord, setTotalRecord] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "dealer_code",
    direction: "ascending",
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();



  useEffect(() => {
    fetchData();
  }, [dispatch, API_URL]);

  useEffect(() => {
    setFilterValue(filterValue)
  }, [filterValue]);


  const formatDateToDMY = (date) => {
    if (!date) return ""; // Handle cases where the date might be undefined
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const addOneYearAndFormat = (date) => {
    console.log('date', !date);

    if (!date) {
      return "";
    } else {
      const inputDate = new Date(date); // Parse the input date
      console.log('inputDate', inputDate, date);
      // inputDate.setFullYear(inputDate.getFullYear() + 1); // Add one year
      // return formatDateToDMY(inputDate); // Format using the existing function
    }
  };


  const fetchData = async () => {

    try {
      // const response = await axios.get(`${API_URL}showData`);
      // const response = await axios.get(`${API_URL}getdata_main`);

      const response = await axios.post(`${API_URL}getall_data`);
      console.log('response', response);

      setData(response.data);
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.key)
    );
  }, [visibleColumns]);

  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "vin_no":
        return <a style={{ textDecoration: 'underline' }} href={`/carDetail?vin=${cellValue}`}>{cellValue}</a>
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[cellValue] || "default"}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  }

  return (
    <div className="">

      {data.length > 0 ?
        <CustomTable
          columns={headerColumns}
          data={data}
          renderFunction={renderCell}
          rowsPerPage={10}
          searchInColumn={true}
          defaultColumn={columns[6].key}
          topContent={"ตรวจสอบการแจ้งประกันภัย/ชำระเบี้ย"}
        /> :
        <div className="flex h-screen justify-center items-center">
          <Spinner size="lg" label="Loading...." />
        </div>

      }

    </div>


  );
}


