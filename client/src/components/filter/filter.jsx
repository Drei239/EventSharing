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
import { useLocation, useSearchParams } from "react-router-dom";
import { handleChangeEvents } from "../../features/events/eventSlice";
import { getAllCategory } from "../../features/category/categorySlice";
import {
  CategoryFilter,
  feeFilter,
  formFilter,
  locationFil,
  sortFilter,
} from "../../data/filter";
import { getEvent } from "../../features/events/eventSlice";
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
  const { categories } = useSelector((state) => state.category);
  const [selectedDate, setSelectedDate] = useState({
    value: null,
    label: "Tất cả các ngày",
  });
  const [openDate, setOpenDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleSelectChange = (value, label) => {
    setSelectedDate({ value, label });
    setOpenDate(false);
    dispatch(handleChangeEvents({ date: value }));
  };
  const newCategories = categories.reduce((total, item) => {
    return [...total, { value: item._id, label: item.categoryName }];
  }, []);
  const handleChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    console.log(dates);
    if (end !== null) {
      setSelectedDate({
        label: `${dayjs(start).format("DD/MM/YYYY")}-${dayjs(end).format(
          "DD/MM/YYYY"
        )}`,
        value: {
          from: dayjs(start).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          to: dayjs(end).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        },
      });
      dispatch(
        handleChangeEvents({
          date: {
            from: dayjs(start).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            to: dayjs(end).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          },
        })
      );
      setOpenDate(false);
    }
  };
  const handleChangeSelectLocation = (selectedOption) => {};
  const handleChangeSelectCategory = (selectedOption) => {
    dispatch(handleChangeEvents({ category: selectedOption.value }));
  };
  const handleChangeSelectType = (selectedOption) => {
    dispatch(handleChangeEvents({ type: selectedOption.value }));
  };
  const handleChangeFee = (selectedOption) => {
    dispatch(handleChangeEvents({ fee: selectedOption.value }));
  };
  const handleChangeSort = (selectedOption) => {
    dispatch(handleChangeEvents({ sort: selectedOption.value }));
  };

  useEffect(() => {
    dispatch(getAllCategory());
  }, []);
  return (
    <div className="filter">
      <div className="categories">
        <div className="select">
          <CustomSelect
            options={locationFil}
            defaultValue={locationFil[0]}
            components={{ Control: CustomControl1 }}
            // onChange={handleChangeSelectLocation}
          />
        </div>
        <div className="select">
          <CustomSelect
            options={newCategories}
            defaultValue={newCategories[0]}
            components={{ Control: CustomControl2 }}
            onChange={handleChangeSelectCategory}
          />
        </div>
        <div className="select">
          <CustomSelect
            options={formFilter}
            defaultValue={formFilter[0]}
            components={{ Control: CustomControl3 }}
            onChange={handleChangeSelectType}
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
              <li onClick={() => handleSelectChange(null, "Tất cả các ngày")}>
                Tất cả các ngày
              </li>
              <li
                onClick={() =>
                  handleSelectChange(
                    {
                      from: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                      to: dayjs()
                        .add(30, "day")
                        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
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
                      from: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                      to: dayjs()
                        .add(0, "day")
                        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
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
                      from: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                      to: dayjs()
                        .add(1, "day")
                        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
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
                      from: dayjs()
                        .startOf("week")
                        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                      to: dayjs()
                        .endOf("week")
                        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
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
            onChange={handleChangeFee}
          />
        </div>
        <div className="select">
          <CustomSelect
            options={sortFilter}
            defaultValue={sortFilter}
            components={{ Control: CustomControl5 }}
            onChange={handleChangeSort}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
