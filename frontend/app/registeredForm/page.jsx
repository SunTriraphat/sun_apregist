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

const statusColorMap = {
  Done: "success",
  Progress: "primary",
  Rejected: "danger",
  Hold: "default",
};

const INITIAL_VISIBLE_COLUMNS = [
  "DateTimeUtc",
  "vin_no",
  "policy_no",
  "start_date",
  "end_date",
  "DealershipName",
  "insurance",
  "stock",
  "account",
  "date_payment",
  "date_recieved",
  "remark",
  "date_accounted",
  "billing",
  "status",
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
  let showData = useSelector((state) => state.showData.showData);

  useEffect(() => {
    fetchData(1);
  }, [dispatch, API_URL]);



  const fetchData = async (page) => {
    try {
      // const response = await axios.get(`${API_URL}showData`);
      // const response = await axios.get(`${API_URL}getdata_main`);
      const response = await axios.post(`${API_URL}getall_data`);
      setData(response.data);
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.key)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...showData];


    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.vin_no.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredData = filteredData.filter((item) =>
        Array.from(statusFilter).includes(item.status)
      );
    }

    return filteredData;
  }, [showData, filterValue, statusFilter]);





  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];


    switch (columnKey) {
      case "vin_no":
        return <a style={{ textDecoration: 'underline' }} href={`/carDetail?vin=${cellValue}`}>{cellValue}</a>
      case "document":
      case "policy_no":
      case "DEALER CODE":
      case "brand":
      case "model":
      case "dealer_name":
      case "vin_no":
      case "insurance":
      case "stock":
      case "account":
      case "date_payment":
      case "date_recieved":
      case "remark":
      case "date_accounted":
      case "billing":
        return cellValue;
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
  };







 
  return (

    <div>

      {data.length > 0 ?
        <CustomTable
          columns={headerColumns}
          data={data}
          renderFunction={renderCell}
          rowsPerPage={10}
          searchInColumn={true}
          defaultColumn={columns[1].key}
          topContent={"ตรวจสอบการจดทะเบียน"}
        /> :  <div className="flex h-screen justify-center items-center">
        <Spinner size="lg" label="Loading...." />
      </div>
      }

    </div>



  );
}


