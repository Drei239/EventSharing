import React from "react";
import { useState } from "react";
import "./filter.css";
import Select, { components, ControlProps } from "react-select";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RiArrowDropDownLine } from "react-icons/ri";
const options = [
  {
    value: "all",
    label: "Tất cả địa điểm",
  },
  {
    value: "HCM",
    label: "Hồ Chí Minh",
  },
  {
    value: "HN",
    label: "Hà Nội",
  },
];
const option2 = [
  {
    value: "music",
    label: "Nhạc sống",
  },
  {
    value: "Văn hoá nghệ thuật",
    label: "culture",
  },
  {
    value: "sk",
    label: "Sân khấu",
  },
  {
    value: "Nightlife",
    label: "Nightlife",
  },
  {
    value: "Ngoài trời",
    label: "Ngoài trời",
  },
  {
    value: "",
    label: "...",
  },
];
const option3 = [
  {
    value: "31",
    label: "Tất cả các ngày",
  },
  {
    value: "coming",
    label: "Tất cả các ngày sắp tới",
  },
  {
    value: "today",
    label: "Hôm nay",
  },
  {
    value: "yesterday",
    label: "Ngày mai",
  },
  {
    value: "thisweek",
    label: "Tuần này",
  },

  { value: "datepicker", label: "Chọn ngày", type: "datepicker" },
];
const style = { cursor: "pointer" };
const Control = ({ children, ...props }) => {
  const [optionDate, setOptionDate] = useState({
    value: "",
    label: "Tất cả các ngày",
  });
  return (
    <components.Control {...props}>
      <span>
        <FiMapPin />
      </span>
      {children}
    </components.Control>
  );
};
const Banner = () => {
  const [selectedDate, setSelectedDate] = useState({
    value: "",
    label: "Tất cả các ngày",
  });
  const [openDate, setOpenDate] = useState(false);

  const handleSelectChange = (option) => {
    console.log("Tùy chọn được chọn:", option);
  };
  return (
    <div className="banner">
      <h2>NHẠC SỐNG</h2>
      <div className="categories">
        <div className="select">
          <Select
            options={options}
            isSearchable
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "grey" : "red",
                paddingLeft: "10px",
              }),
            }}
            components={{ Control }}
          />
        </div>
        <div className="select">
          <Select
            options={option2}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "grey" : "red",
              }),
            }}
          />
        </div>
        <div className="select">
          <div className="date-option" onClick={() => setOpenDate(!openDate)}>
            <MdDateRange />
            {selectedDate.label}
            <span className="icon-dropdown">
              {" "}
              <RiArrowDropDownLine />
            </span>
          </div>
          {openDate && (
            <ul className="options-date">
              <li>Tất cả các ngày</li>
              <li>Tất cả các ngày sắp tới</li>
              <li>Hôm nay</li>
              <li>Ngày mai</li>
              <li>Tuần này</li>
              <li>
                <span>Ngày tháng tuỳ chọn</span>
                <div>
                  <DatePicker dateFormat="dd/MMM/yyyy" />
                  <DatePicker dateFormat="dd/MMM/yyyy" />
                </div>
              </li>
            </ul>
          )}
        </div>
        <div className="select">
          <Select
            options={options}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "grey" : "red",
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
