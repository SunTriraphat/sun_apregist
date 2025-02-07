"use client";
import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Navbar from "../../components/navBar/Navbar";
import axios from "axios";
import numeral from "numeral";
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
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
  ModalContent,
  Textarea,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem
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
import CustomModal from "../../components/CustomModal";

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
  "remark_detail",
  "send_document_date",
  "registration",
  "registration_book",
  "check_file",
  "actions",
];


export default function App() {
  const [data, setData] = useState([]);
  const [province, setProvince] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState();
  const [totalRecord, setTotalRecord] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [sportsData, setSportsData] = useState(['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Rugby', 'Snooker', 'Tennis']);
  const [loadingModal, setLoadingModal] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "dealer_code",
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAlertOpen, setIsModalAlertOpen] = useState(false);
  const [detailData, setDetailData] = useState({
    vin_no: '',
    document: '',
    registration: '',
    registration_book: '',
    remark_detail: ''
  });

  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  // Filter provinces based on the search input
  const filteredProvinces = province.filter((val) =>
    val.name_th.toLowerCase().includes(searchValue.toLowerCase())
  );


  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  let showData = useSelector((state) => state.showData.showData);

  useEffect(() => {
    fetchData();
  }, [dispatch, API_URL]);

  const formatDate = (date) => {
    if (!date) return null; // Return null if date is falsy

    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0'); // Add leading zero for single digits
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero for single digits
    const year = d.getFullYear() // Get last two digits of the year

    return `${day}/${month}/${year}`;
  };

  const addOneYear = (date) => {
    if (!date) return null;

    const d = new Date(date);
    d.setFullYear(d.getFullYear() + 1); // Add 1 year to the current date
    return formatDate(d); // Format and return the new date
  };



  const fetchData = async (page) => {
    try {
      const [response, province, responseInsurance] = await Promise.all([
        axios.post(`${API_URL}getall_data`),
        axios.get(`https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json`),
        axios.get(`${API_URL}getall_insurance`)
      ]);

      if (response.data && responseInsurance.data) {
        const insuranceLookup = responseInsurance.data.reduce((acc, insurance) => {
          acc[insurance.vin_no] = insurance;
          return acc;
        }, {});

        const sortedData = response.data.map(item => {
          const matchingInsurance = insuranceLookup[item.Vin];
          return {
            ...item,
            policy_no: matchingInsurance ? matchingInsurance.policy_no : null,
            start_date: matchingInsurance ? formatDate(matchingInsurance.start_date) : null,
            end_date: matchingInsurance ? addOneYear(matchingInsurance.start_date) : null,
            payment_month: matchingInsurance ? matchingInsurance.payment_month : null,
            remark: matchingInsurance ? matchingInsurance.remark : null,
            DateTimeUtc: formatDate(item.DateTimeUtc),
            brand: 'byd'
          };
        }).sort((a, b) => {
          if (!a.start_date) return 1;
          if (!b.start_date) return -1;
          return new Date(b.start_date) - new Date(a.start_date);
        });



        setData(sortedData);
      }

      setProvince(province.data);
      console.log('province', province.data);


      setIsLoading(false);
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
      const responseFile = await axios.post(`${API_URL}getall_file`, { vin: vin_no }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.length > 0) {
        setDetailData(response.data[0]);
        setSelectedFiles(responseFile.data);
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
    setSelectedFiles([]);
    setDeleteFiles([]);
  };
  const closeModalAlert = () => {
    setIsModalAlertOpen(false);
  };


  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];


    switch (columnKey) {

      case "actions":
        return (
          <div className="relative flex items-center gap-2">

            <Button size="sm" onClick={() => openModal(item["vin_no"])} color="primary"><FontAwesomeIcon icon={faPenToSquare} size="sm" />Edit</Button>



          </div>
        );
      case "vin_no":
        return <a style={{ textDecoration: 'underline' }} href={`/carDetail?vin=${cellValue}`}>{cellValue}</a>

      case "check_file":
        return (
          <div className="relative flex items-center gap-2">
            {cellValue ? (
              <FontAwesomeIcon icon={faPaperclip} />
            ) : null}
          </div>
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
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files[]', selectedFiles[i]);
    }
    formData.append('delete_id', deleteFiles);

    Swal.fire({
      title: "ยืนยันการแก้ไขข้อมูล?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsModalOpen(true)
        try {

          const response = await axios.post(`${API_URL}detail_edit`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });


          if (response.status == 200) {
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
      } else {
        setIsModalOpen(true)
        setLoadingModal(false)
      }
    });


  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetailData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };



  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deleteFiles, setDeleteFiles] = useState([]);

  const handleFileChange = (event) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
    const files = Array.from(event.target.files); // Convert FileList to Array
    const validFiles = [];


    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `File ${file.name} exceeds the 5MB size limit.`,
          showConfirmButton: false,
          timer: 1500
        });

      } else {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
      }
    });




  };



  const removeFile = (index) => {
    // const file = selectedFiles.find((val, i) => i === index);
    // if (file.id !== undefined) {
    //   setDeleteFiles((prev) => [...prev, file.id]);
    // }
    // setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    Swal.fire({
      title: "ยืนยันการแก้ไขข้อมูล?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
      allowOutsideClick: false, // Disable closing by clicking outside
      allowEscapeKey: false, // Disable closing by pressing escape
      didOpen: () => {
        // Temporarily hide the main modal when Swal is open
        setIsModalOpen(true);
      },
      didClose: () => {
        // Reopen the main modal after Swal is closed
        setIsModalOpen(true);
      }
    }).then(async (result) => {
      const file = selectedFiles.find((val, i) => i === index);


      if (result.isConfirmed) {
        // console.log('selectedFiles',selectedFiles);

        if (file.id !== undefined) {
          setDeleteFiles((prev) => [...prev, file.id]);
        }
        // setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
      } else {
        setSelectedFiles(selectedFiles)
      }
    });


  };

  const handleDownload = async (path, name) => {
    try {
      const response = await axios.post(`${API_URL}download_file`, { path: path }, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // Ensure the response is treated as a file
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name); // Set the desired file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error:', error);
    }


    // const link = document.createElement('a');
    // link.href = file.path; // Replace `file.path` with the appropriate property if different
    // link.download = file.name;
    // link.click();
  };
  return (
    <div>
      <Navbar />

      {isModalOpen && (
        <>
          <CustomModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            size="lg"
            color="gray-100"
            footer={
              <div className="flex justify-end">
                {
                  loadingModal ? (
                    <Button isLoading color="primary">
                      Loading
                    </Button>
                  ) :
                    <>
                      <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)} disabled={loadingModal}>
                        Close
                      </Button>
                      <Button color="primary" type="submit" form="modalForm" disabled={loadingModal}>
                        Submit
                      </Button>
                    </>

                }
              </div>
            }
          >
            <form id="modalForm" onSubmit={handleSubmit} className="grid gap-4">

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label htmlFor="receive_document_date" className="block text-gray-700 font-medium mb-1">
                    รับเอกสาร:
                  </label>
                  <Input
                    type="date"
                    value={detailData.receive_document_date
                      ? new Date(detailData.receive_document_date).toISOString().split('T')[0]
                      : ''}
                    id="receive_document_date"
                    name="receive_document_date"
                    onChange={handleChange}
                    className="w-full"
                  />

                </div>

                <div>
                  <label htmlFor="receive_document_remark" className="block text-gray-700 font-medium mb-1">
                    หมายเหตุ:
                  </label>
                  <Input
                    type="text"
                    value={detailData.receive_document_remark || ''}
                    id="receive_document_remark"
                    name="receive_document_remark"
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="send_document_date" className="block text-gray-700 font-medium mb-1">
                    ส่งเอกสาร:
                  </label>
                  <Input
                    type="date"
                    value={detailData.send_document_date
                      ? new Date(detailData.send_document_date).toISOString().split('T')[0]
                      : ''}
                    id="send_document_date"
                    name="send_document_date"
                    onChange={handleChange}
                    className="w-full"
                  />
                  {/* <input type="text" id="numberInput" pattern="^[1-9]\d*$" title="Enter a positive number without leading zeros" /> */}

                </div>
                <div>
                  <label htmlFor="send_document_remark" className="block text-gray-700 font-medium mb-1">
                    หมายเหตุ:
                  </label>
                  <Input
                    type="text"
                    value={detailData.send_document_remark || ''}
                    id="send_document_remark"
                    name="send_document_remark"
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>


              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="registration" className="block text-gray-700 font-medium mb-1">
                    ทะเบียน:
                  </label>
                  <Input
                    type="text"
                    value={detailData.registration || ''}
                    id="registration"
                    name="registration"
                    onChange={handleChange}
                    className="w-full"
                   
                  />
                </div>
                <div>
                  <label htmlFor="province" className="block text-gray-700 font-medium mb-1">
                    จังหวัด:
                  </label>
                 
                  <AutoCompleteComponent
                    id="province"
                    name="province"
                    value={detailData.province || ''}
                    fields={{ value: 'name_th' }}
                    dataSource={province}
                    placeholder="ค้นหาจังหวัด"
                    allowFiltering={true}
                    onChange={handleChange}
                   
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      borderRadius: '8px',
                      // border: '1px solid #ccc',
                      padding: '8px',
                      position: 'relative',
                      backgroundColor: '#F5F5F5',
                      boxShadow: '0 0.5px 0px rgba(0, 0, 0, 0.1)',
                    }}
                    itemTemplate={(item) => (
                      <div
                        style={{
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                         border: '1px solid #ccc',
                          backgroundColor: '#F5F5F5',
                          width: '100%',
                          boxSizing: 'border-box',
                          boxShadow: '0 0.5px 0px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <span
                          style={{
                            width: '250px',
                            color: '#333',
                            fontWeight: '500',
                            paddingTop: '4px',
                            lineHeight: 'normal',
                            cursor:'pointer'
                          }}
                        >
                          {item.name_th}
                        </span>
                      </div>
                    )}
                    // popupProps={{
                    //   height: '200px', // กำหนดความสูงของ dropdown
                    //   width: 'auto',   // ความกว้างของ dropdown
                    //   position: 'absolute', // ใช้ `absolute` เพื่อกำหนดตำแหน่ง
                    // }}
                    // popupContainer={document.body} // กำหนดให้ popup แสดงใต้ input โดยไม่ทับกัน
                  />

                </div>
                <div>
                  <label htmlFor="upload" >
                    Upload
                  </label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    multiple
                    onChange={handleFileChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="remark" className="block text-gray-700 font-medium mb-1">
                    หมายเหตุ
                  </label>
                  <Textarea
                    value={detailData.remark || ''}
                    className="w-full"
                    id="remark"
                    name="remark"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">

                    <p className="text-sm text-gray-600">
                      {file.name}
                    </p>
                    <div className="flex space-x-1">

                      <Button
                        onClick={() => handleDownload(file.path, file.name)}
                        className="text-blue-500 hover:text-blue-700  bg-transparent"

                      >

                        ดาวน์โหลด
                      </Button>
                      <Button

                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 bg-transparent"
                      >
                        ลบ
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
              <Input
                type="hidden"
                id="vin_no"
                name="vin_no"
                value={detailData.vin_no || ''}
              />
            </form>
          </CustomModal>
          {/* <Modal scrollBehavior={"outside"} isOpen={isModalOpen} size={"3xl"} hideCloseButton={true} onClose={closeModal} >

            <ModalContent>
              {(onClose) => (

                <div>
                  <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูล</ModalHeader>
                  <ModalBody >

                    <form id="modalForm" onSubmit={handleSubmit} className="grid gap-4">

                      <div className="grid grid-cols-2 gap-4">

                        <div>
                          <label htmlFor="receive_document_date" className="block text-gray-700 font-medium mb-1">
                            รับเอกสาร:
                          </label>
                          <Input
                            type="date"
                            value={detailData.receive_document_date
                              ? new Date(detailData.receive_document_date).toISOString().split('T')[0]
                              : ''}
                            id="receive_document_date"
                            name="receive_document_date"
                            onChange={handleChange}
                            className="w-full"
                          />

                        </div>

                        <div>
                          <label htmlFor="receive_document_remark" className="block text-gray-700 font-medium mb-1">
                            หมายเหตุ:
                          </label>
                          <Input
                            type="text"
                            value={detailData.receive_document_remark || ''}
                            id="receive_document_remark"
                            name="receive_document_remark"
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label htmlFor="send_document_date" className="block text-gray-700 font-medium mb-1">
                            ส่งเอกสาร:
                          </label>
                          <Input
                            type="date"
                            value={detailData.send_document_date
                              ? new Date(detailData.send_document_date).toISOString().split('T')[0]
                              : ''}
                            id="send_document_date"
                            name="send_document_date"
                            onChange={handleChange}
                            className="w-full"
                          />
                          <input type="text" id="numberInput" pattern="^[1-9]\d*$" title="Enter a positive number without leading zeros" />

                        </div>
                        <div>
                          <label htmlFor="send_document_remark" className="block text-gray-700 font-medium mb-1">
                            หมายเหตุ:
                          </label>
                          <Input
                            type="text"
                            value={detailData.send_document_remark || ''}
                            id="send_document_remark"
                            name="send_document_remark"
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>


                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="registration" className="block text-gray-700 font-medium mb-1">
                            ทะเบียน:
                          </label>
                          <Input
                            type="text"
                            value={detailData.registration || ''}
                            id="registration"
                            name="registration"
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="province" className="block text-gray-700 font-medium mb-1">
                            จังหวัด:
                          </label>
                          <Autocomplete
                            className="w-full"
                            placeholder="ค้นหา..."
                            id="province"
                            name="province"
                            onChange={setSearchValue}
                            value={detailData.province || ''}
                          >
                            {filteredProvinces.map((val) => (
                              <AutocompleteItem key={val.id} value={val.id}>
                                {val.name_th}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                        </div>
                        <div>
                          <label htmlFor="upload" >
                            Upload
                          </label>
                          <Input
                            id="file"
                            name="file"
                            type="file"
                            multiple
                            onChange={handleFileChange} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="remark" className="block text-gray-700 font-medium mb-1">
                            หมายเหตุ
                          </label>
                          <Textarea
                            value={detailData.remark || ''}
                            className="w-full"
                            id="remark"
                            name="remark"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
                           
                            <p className="text-sm text-gray-600">
                              {file.name}
                            </p>
                            <div className="flex space-x-1">

                              <Button
                                onClick={() => handleDownload(file.path, file.name)}
                                className="text-blue-500 hover:text-blue-700  bg-transparent"

                              >

                                ดาวน์โหลด
                              </Button>
                              <Button

                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 bg-transparent"
                              >
                                ลบ
                              </Button>
                            </div>

                          </div>
                        ))}
                      </div>
                      <Input
                        type="hidden"
                        id="vin_no"
                        name="vin_no"
                        value={detailData.vin_no || ''}
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
                </div>
              )}
            </ModalContent>
          </Modal> */}
        </>

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


