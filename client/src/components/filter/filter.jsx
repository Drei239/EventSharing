import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "./filter.css";
import { components } from "react-select";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdPriceCheck } from "react-icons/md";
import { CgSortAz } from "react-icons/cg";
import { RiVidiconLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  CategoryFilter,
  feeFilter,
  formFilter,
  locationFil,
  sortFilter,
} from "../../data/filter";
import { CustomSelect } from "../ui/select";
const createCustomControl =
  (iconComponent) =>
  ({ children, ...props }) => {
    return (
      <components.Control {...props}>
        <span className="icon">{iconComponent}</span>
        {children}
      </components.Control>
    );
  };
const CustomControl1 = createCustomControl(<FiMapPin />);
const CustomControl2 = createCustomControl(<BsFillGrid3X3GapFill />);
const CustomControl3 = createCustomControl(<RiVidiconLine />);
const CustomControl4 = createCustomControl(<MdPriceCheck />);
const CustomControl5 = createCustomControl(<CgSortAz />);
const Filter = () => {
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState({
    value: {},
    label: "Tất cả các ngày",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [request, setRequest] = useState(false);
  const [filter, setFilter] = useState({
    category: "",
    sort: "",
    fee: "",
    type: "",
    location: "",
  });
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
  useEffect(() => {
    if (request) {
    }
    setRequest(true);
  }, []);
  return (
    <div className="filter">
      <div className="categories">
        <div className="select">
          <CustomSelect
            options={locationFil}
            defaultValue={locationFil[0]}
            components={{ Control: CustomControl1 }}
          />
        </div>
        <div className="select">
          <CustomSelect
            options={CategoryFilter}
            defaultValue={CategoryFilter[0]}
            components={{ Control: CustomControl2 }}
          />
        </div>
        <div className="select">
          <CustomSelect
            options={formFilter}
            defaultValue={formFilter[0]}
            components={{ Control: CustomControl3 }}
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
          <CustomSelect
            options={feeFilter}
            defaultValue={feeFilter[0]}
            components={{ Control: CustomControl4 }}
          />
        </div>
        <div className="select">
          <CustomSelect
            options={sortFilter}
            defaultValue={sortFilter}
            components={{ Control: CustomControl5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
