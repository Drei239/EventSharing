import React, { useEffect, useId, useState } from "react";
import { useFormik } from "formik";
import Select, { components } from "react-select";
import { object, number } from "yup";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { Radio, useModal } from "@nextui-org/react";
import "react-datepicker/dist/react-datepicker.css";
import "./personal.css";
import { month } from "../../../data/data";
import { LoadingLayout } from "../../../components";
import { updateInfo } from "../../../features/user/userSlice";
import notify from "../../../utils/notify";
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
  const dispatch = useDispatch();
  const { isLoading, userInfo, isSuccess, message } = useSelector(
    (state) => state.user
  );
  const { setVisible, bindings } = useModal();

  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const formik = useFormik({
    initialValues: {
      day: null,
      month: null,
      year: null,
      gender: "female",
    },
    // validationSchema: validateSchema,
    onSubmit: async (values) => {
      console.log(values);
      await dispatch(
        updateInfo({
          id: userInfo._id,
          data: {
            gender: values.gender,
            birthDay: dayjs()
              .set("date", values.day)
              .set("month", values.month?.value)
              .set("year", values.year),
          },
        })
      );
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
    formik.setFieldValue("day", 1);
  };
  const handleChangeGender = (option) => {
    formik.setFieldValue("gender", option);
  };
  const handleClearBirthday = async () => {
    formik.setFieldValue("day", null);
    formik.setFieldValue("month", null);
    formik.setFieldValue("year", null);
  };
  useEffect(() => {
    if (userInfo) {
      formik.setFieldValue("gender", userInfo?.gender || "");
      formik.setFieldValue("day", dayjs(userInfo?.birthDay).date() || null);
      console.log(month[dayjs(userInfo?.birthDay).month()]);
      formik.setFieldValue(
        "month",
        month[dayjs(userInfo?.birthDay).month()] || null
      );
      formik.setFieldValue("year", dayjs(userInfo?.birthDay).year() || null);
    }
  }, [userInfo]);
  useEffect(() => {
    setVisible(isLoading);
  }, [isLoading]);
  useEffect(() => {
    if (isSuccess && requestSuccess) {
      notify("Cập nhật tài khoản thành công", "success");
    }
    setRequestSuccess(true);
  }, [isSuccess]);
  useEffect(() => {
    if (message && requestError) {
      notify(message, "error");
    }
    setRequestError(true);
  }, [message]);
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
        <button className="personal-submit" type="submit">
          Save Changes
        </button>
      </form>
      <LoadingLayout loading={bindings} />
    </div>
  );
};

export default Personal;
