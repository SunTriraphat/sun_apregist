"use client";
import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import numeral from "numeral";
import Swal from 'sweetalert2';
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
  Spinner,
  Tooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent
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
  "document",
  "registration",
  "registration_book",

  "actions",
];

export const EditIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

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
  const [loadingModal, setLoadingModal] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "dealer_code",
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailData, setDetailData] = useState({
    vin_no: '',
    document: '',
    registration: '',
    registration_book: '',
    remark: ''
  });


  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  let showData = useSelector((state) => state.showData.showData);

  useEffect(() => {
    fetchData();
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

  const openModal = async (vin_no) => {

    try {
      // const response = await axios.get(`${API_URL}showData`);
      // const response = await axios.get(`${API_URL}getdata_main`);
      const response = await axios.post(`${API_URL}getdetail_data`, { vin: vin_no }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('response detail', response);
      if (response.data.length > 0) {
        setDetailData(response.data[0]);
      } else {
        setDetailData({ 'vin_no': vin_no });
      }

      // setIsLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];


    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">


            <button
              onClick={() => openModal(item["vin_no"])}
              className="text-lg text-default-400 cursor-pointer active:opacity-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-default-500"
              aria-label="Edit user"
            >
              <EditIcon />
            </button>


          </div>
        );
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
  };

  const handleSubmit = async (e) => {
    await setLoadingModal(true)
    e.preventDefault();

    // Collect form data using FormData API
    const form = e.target;
    const formData = new FormData(form);

    // Convert FormData to JSON
    const formJSON = Object.fromEntries(formData.entries());
    console.log('JSON.stringify(formJSON)', JSON.stringify(formJSON));

    try {
      const response = await fetch(`${API_URL}detail_edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formJSON),
      });


      if (response.ok) {
        form.reset(); // Reset the form after successful submission
        // setIsLoading(true)
        await fetchData()

        Swal.fire({
          title: 'Success',
          // text: 'The form has been submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setIsModalOpen(false);
      } else {
        Swal.fire({
          title: 'Failed',
          text: 'There was an issue with the submission. Please try again',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        setIsModalOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    } finally {
      setLoadingModal(false)
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetailData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  return (
    <div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} size={"md"} hideCloseButton={true} onClose={closeModal}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูล</ModalHeader>
                <ModalBody>
                  <form id="modalForm" onSubmit={handleSubmit}>
                    <Input label="ส่งเอกสาร"
                      type="text"
                      value={detailData.document ? detailData.document : ''}
                      id="document"
                      name="document"
                      onChange={handleChange}
                      className="mb-4"
                    />
                    <Input label="ทะเบียน"
                      type="text"
                      value={detailData.registration ? detailData.registration : ''}
                      id="registration"
                      name="registration"
                      onChange={handleChange}
                      className="mb-4"
                    />
                    <Input label="เล่มทะเบียน"
                      type="text"
                      value={detailData.registration_book ? detailData.registration_book : ''}
                      id="registration_book"
                      name="registration_book"
                      onChange={handleChange}
                      className="mb-4"
                    />
                    <Input label="หมายเหตุ"
                      type="text"
                      value={detailData.remark ? detailData.remark : ''}
                      id="remark"
                      name="remark"
                      onChange={handleChange}
                      className="mb-4"
                    />
                    <Input
                      type="hidden"
                      id="vin_no"
                      name="vin_no"
                      value={detailData.vin_no ? detailData.vin_no : ''}
                    />

                  </form>
                </ModalBody>
                <ModalFooter>
                  {
                    loadingModal ? (
                      <Button isLoading color="primary">
                        Loading
                      </Button>
                    ) :
                      <>
                        <Button color="danger" variant="light" onPress={onClose} disabled={loadingModal}>
                          Close
                        </Button>
                        <Button color="primary" type="submit" form="modalForm" disabled={loadingModal}>
                          Submit
                        </Button>
                      </>

                  }


                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      {data.length > 0 && isLoading == false ?
        <CustomTable
          columns={headerColumns}
          data={data}
          renderFunction={renderCell}
          rowsPerPage={10}
          searchInColumn={true}
          defaultColumn={columns[1].key}
          topContent={"ตรวจสอบการจดทะเบียน"}

        /> : <div className="flex h-screen justify-center items-center">
          <Spinner size="lg" label="Loading...." />
        </div>
      }
    </div>
  );
}


