import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Select, { components } from "react-select";
import yup, { number } from "yup";
import dayjs from "dayjs";
import { month } from "../../../data/data";
import DatePicker from "react-datepicker";
import { Radio } from "@nextui-org/react";
import { object } from "yup";
import "react-datepicker/dist/react-datepicker.css";
import "./personal.css";
const groupStyles = {
  border: `2px dotted #161f6d`,
  borderRadius: "5px",
  background: "#f2fcff",
};

const Group = (props) => (
  <div style={groupStyles}>
    <components.Group {...props} />
  </div>
);

const Personal = () => {
  const validateSchema = object().shape({
    year: number()
      .min(1903, "Năm sinh phải lớn hơn 1903")
      .max(dayjs().year(), "Năm sinh của bạn không được lớn hơn năm hiện tại"),
    day: number()
      .min(1, "Ngày sinh không hợp lệ")
      .max(dayInMonth, "Ngày sinh không hợp lệ"),
  });
  const formik = useFormik({
    initialValues: {
      day: null,
      month: null,
      year: null,
      gender: "female",
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  var dayInMonth =
    formik.values.year && formik.values.month
      ? dayjs(
          `${formik.values.year}-${formik.values.month.value + 1}`
        ).daysInMonth()
      : 31;

  const handleChangeMonth = (selectOption) => {
    formik.setFieldValue("month", selectOption);
    formik.setFieldValue("day", null);
  };
  const handleChangeGender = (option) => {
    console.log(option);
    formik.setFieldValue("gender", option);
  };
  const handleClearBirthday = async () => {
    formik.setFieldValue("day", null);
    formik.setFieldValue("month", null);
    formik.setFieldValue("year", null);
  };

  return (
    <div className="personal">
      <h2>Personal info</h2>
      <p className="personal-info">
        Completing this imfomation helps with your group recommendations. It
        will not appear on your public profile
      </p>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label className="birthday-label">Birthday</label>
          <p>Your birthday is not visible to others</p>
          <div className="birthday-select">
            <input
              name="year"
              value={formik.values.year}
              onChange={formik.handleChange}
              type="number"
              min={1903}
              max={dayjs().year()}
              placeholder="Year"
            />
            <Select
              name="month"
              value={formik.values.month}
              options={month}
              defaultValue={month[0]}
              components={{ Group }}
              onChange={handleChangeMonth}
              className="birth-select-month"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? "grey" : "gray",
                  paddingLeft: "10px",
                  height: "40px",
                }),
              }}
              placeholder="Month"
            />
            <input
              type="number"
              min={1}
              name="day"
              max={dayInMonth}
              value={formik.values.day}
              onChange={formik.handleChange}
              placeholder="Day"
            />
          </div>
          <button
            type="reset"
            className="clear-birthday-btn"
            onClick={handleClearBirthday}
          >
            Clear
          </button>
        </div>
        <div className="form-gender-item">
          <label className="personal-label-gender">Gender</label>
          <Radio.Group
            size="sm"
            value={formik.values.gender}
            onChange={handleChangeGender}
            name="gender"
          >
            <Radio value="female">Female</Radio>
            <Radio value="male">Male</Radio>
            <Radio value="non-binary">Non-Binary</Radio>
            <Radio value="not-answer">I'd prefer not to answer</Radio>
          </Radio.Group>
        </div>
        <button className="personal-submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Personal;
