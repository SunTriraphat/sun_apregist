import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
} from "@nextui-org/react";

import Navbar from "./Navbar";

export default function CustomTable({ columns, data, renderFunction, rowsPerPage = 5, searchInColumn = false, defaultColumn = columns[0].key,topContent}) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(defaultColumn);
  console.log('top',topContent);
  
  // คำนวณจำนวนหน้าทั้งหมด
  const pages = Math.ceil(data.length / rowsPerPage);

  // กรองข้อมูลตามการค้นหา
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    if (searchInColumn) {
      return data.filter(item => item[selectedColumn]?.toString().toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return data.filter(item => 
        columns.some(column => item[column.key]?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  }, [searchQuery, selectedColumn, data, searchInColumn, columns]);

  // Slice data ให้ตรงกับหน้าปัจจุบัน
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [page, filteredData, rowsPerPage]);

  return (
    <div>
      <Navbar />
      <p className="ml-5 mt-5 text-lg">{topContent}</p>
      {/* Search and Column Select */}
      <div className="ml-5 mt-5 flex justify-between items-center mb-4 w-1/4">
      
      {/* <p className="ml-5 text-lg">{topContent}</p> */}
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          endContent={
            searchInColumn && (
              <div className="flex items-center">
                <label className="sr-only" htmlFor="column">Search</label>
                <select
                  id="column"
                  name="column"
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="outline-none border-0 bg-transparent text-default-400 text-small"
                >
                  {columns.map((column) => (
                    <option key={column.key} value={column.key}>{column.label}</option>
                  ))}
                </select>
              </div>
            )
          }
        />
      </div>

      <Table
        isCompact
        aria-label="Custom table with pagination"

      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={column.align || "start"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginatedData}>
          {(item) => (
            <TableRow key={item.vin_no}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {renderFunction(item, column.key)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="ml-5 flex justify-between items-center mt-4">
        <span className="text-small text-default-400">
          Showing {paginatedData.length} of {filteredData.length} items
        </span>
        <Pagination
          isCompact
          total={pages}
          page={page}
          onChange={setPage}
          showControls
          color="default"
        />
      </div>
    </div>
  );
}