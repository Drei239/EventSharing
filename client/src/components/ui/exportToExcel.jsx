import React from "react";
import * as XLSX from "xlsx";
import { TbFileExport } from "react-icons/tb";

const ExportToExcel = ({ data }) => {
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Đặt chiều rộng cột
    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 30 },
      { wch: 25 },
      { wch: 25 },
      { wch: 40 },
      { wch: 40 },
    ];

    // Đặt chiều cao hàng
    worksheet["!rows"] = [{ hpx: 20 }, { hpx: 20 }, { hpx: 20 }];

    // Định dạng dữ liệu
    // worksheet["A2"].z = "0.00%"; // Định dạng dạng số phần trăm

    // Định dạng màu sắc và chữ
    worksheet["A1"].s = {
      fill: { fgColor: { rgb: "FFFF00" } },
      font: { bold: true },
    }; // Màu nền và chữ in đậm
    worksheet["B1"].s = { font: { color: { rgb: "FF0000" } } }; // Màu chữ đỏ

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  return (
    <button className="my-event-btn-exportExcel" onClick={exportToExcel}>
      <TbFileExport style={{ fontSize: "20px" }} />
      <span>Xuất ra Excel</span>
    </button>
  );
};

export default ExportToExcel;
