import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "./filter.css";
import Select, { components, ControlProps } from "react-select";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdPriceCheck } from "react-icons/md";
import { CgSortAz } from "react-icons/cg";
import { RiVidiconLine } from "react-icons/ri";
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
    value:"",
    label:"Tất cả sự kiện"
  },
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
    label: "Hình thức",
    value: "",
  },
  {
    label: "Online",
    value: "on",
  },
  {
    label: "Offline",
    value: "off",
  },
];
const option4 = [
  {
    label: "Tất cả giá vé",
    value: "",
  },
  {
    label: "Có phí",
    value: "cp",
  },
  {
    label: "Miễn phí",
    value: "kp",
  },
];
const option5 = [
  {
    value: "",
    label: "Sắp xếp",
  },
  {
    value: "tg",
    label: "Mới nhất",
  },
  {
    value: "lx",
    label: "Lượt xem",
  },
  {
    value: "namea",
    label: "Tên A > Z",
  },
  {
    value: "namez",
    label: "Tên Z > A",
  },
  {
    value: "price-low",
    label: "Giá : Nhỏ đến Lớn",
  },
  {
    value: "price-high",
    label: "Giá : Lớn đến Nhỏ",
  },
];

const Control = ({ children, ...props }) => {
  return (
    <components.Control {...props}>
      <span className="icon">
        <FiMapPin />
      </span>
      {children}
    </components.Control>
  );
};
const Control3 = ({ children, ...props }) => {
  return (
    <components.Control {...props}>
      <span className="icon">
        <RiVidiconLine />
      </span>
      {children}
    </components.Control>
  );
};
const Control4 = ({ children, ...props }) => {
  return (
    <components.Control {...props}>
      <span className="icon">
        <MdPriceCheck />
      </span>
      {children}
    </components.Control>
  );
};
const Control5 = ({ children, ...props }) => {
  return (
    <components.Control {...props}>
      <span className="icon">
        <CgSortAz />
      </span>
      {children}
    </components.Control>
  );
};
const Control2 = ({ children, ...props }) => {
  return (
    <components.Control {...props}>
      <span className="icon">
        <BsFillGrid3X3GapFill />
      </span>
      {children}
    </components.Control>
  );
};

const Banner = () => {
  const [selectedDate, setSelectedDate] = useState({
    value: {},
    label: "Tất cả các ngày",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openDate, setOpenDate] = useState(false);

  const handleSelectChange = (value, label) => {
    setSelectedDate({ value, label });
    setOpenDate(false);
  };
  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);
  useEffect(() => {
    console.log(startDate);
  }, [startDate]);
  const handleChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (end !== null) {
      setSelectedDate({
        label: `${dayjs(start).format("DD/MM/YYYY")}-${dayjs(end).format(
          "DD/MM/YYYY"
        )}`,
        value: { from: start, end: end },
      });
      setOpenDate(false);
    }
  };
  return (
    <div className="filter">
      <div className="categories">
        <div className="select">
          <Select
            options={options}
            defaultValue={options[0]}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "grey" : "gray",
                paddingLeft: "10px",
              }),
            }}
            components={{ Control }}
          />
        </div>
        <div className="select">
          <Select
            options={option2}
            defaultValue={option2[0]}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "grey" : "gray",
                paddingLeft: "10px",
              }),
            }}
            components={{ Control: Control2 }}
          />
        </div>
        <div className="select">
          <Select
            options={option3}
            defaultValue={option3[0]}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "grey" : "gray",
                paddingLeft: "10px",
              }),
            }}
            components={{ Control: Control3 }}
          />
        </div>
        <div className="select2">
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
              <li onClick={() => handleSelectChange({}, "Tất cả các ngày")}>
                Tất cả các ngày
              </li>
              <li
                onClick={() =>
                  handleSelectChange(
                    {
                      from: dayjs().format("YYYY-MM-DD"),
                      to: dayjs().add(5, "day").format("YYYY-MM-DD"),
                    },
                    "Tất cả các ngày sắp tới"
                  )
                }
              >
                Tất cả các ngày sắp tới
              </li>
              <li
                onClick={() =>
                  handleSelectChange(
                    {
                      from: dayjs().format("YYYY-MM-DD"),
                      to: dayjs().add(1, "day").format("YYYY-MM-DD"),
                    },
                    "Hôm nay"
                  )
                }
              >
                Hôm nay
              </li>
              <li
                onClick={() =>
                  handleSelectChange(
                    {
                      from: dayjs().add(1, "day").format("YYYY-MM-DD"),
                      to: dayjs().add(2, "day").format("YYYY-MM-DD"),
                    },
                    "Ngày mai"
                  )
                }
              >
                Ngày mai
              </li>
              <li
                onClick={() =>
                  handleSelectChange(
                    {
                      from: dayjs().startOf("week").format("YYYY-MM-DD"),
                      to: dayjs().endOf("week").format("YYYY-MM-DD"),
                    },
                    "Tuần này"
                  )
                }
              >
                Tuần này
              </li>
              <li>
                <span>Ngày tháng tuỳ chọn</span>
                <div>
                  <DatePicker
                    className="date-picker"
                    dateFormat="dd/MM/yyyy"
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleChangeDate}
                    selectsRange
                    selectsDisabledDaysInRange
                  />
                </div>
              </li>
            </ul>
          )}
        </div>
        <div className="select">
          <Select
            options={option4}
            defaultValue={option4[0]}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "grey" : "gray",
                paddingLeft: "10px",
              }),
            }}
            components={{ Control: Control4 }}
          />
        </div>
        <div className="select">
          <Select
            isSearchable
            options={option5}
            defaultValue={option5[0]}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "grey" : "gray",
                paddingLeft: "10px",
              }),
            }}
            components={{ Control: Control5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
