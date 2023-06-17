import React, { useState } from "react";
import { useFormik, ErrorMessage } from "formik";
import { AiFillCloseCircle } from "react-icons/ai";
import { object, string } from "yup";
import { useSelector, useDispatch } from "react-redux";
import { isValidNumber } from "libphonenumber-js";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";

import { UploadImage } from "../../../components/ui";
import "./profile.css";
import { openModal, removeImg } from "../../../features/user/userSlice";

const validateSchema = object().shape({
  phoneNumber: string().test(
    "phoneNumber",
    "Số điện thoại không hợp lệ",
    (value) => {
      if (!value) {
        return false;
      }
      return isValidNumber(value, "VN");
    }
  ),
  name: string().required("Tên là bắt buộc").max(30, "Tên tối đa 30 kí tự"),
  description: string().max(200, "Thông tin giới thiệu tối đa 200 kí tự "),
});
const Profile = () => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const imgSelect = useSelector((state) => state.user.imgSelect);
  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      description: "",
    },
    validationSchema: validateSchema,

    onSubmit: async (values) => {
      console.log(values);
    },
  });
  const openModalFunc = () => {
    dispatch(openModal());
  };
  const removeImgFuc = () => {
    dispatch(removeImg());
  };
  const remainingCharsBio = 200 - formik.values.description.length;
  const remainingChars = 30 - formik.values.name.length;

  return (
    <motion.div layout className="profile">
      <h2 className="profile-title">Edit profile</h2>
      <p className="profile-info">
        This infomation will apperar on your public profile
      </p>
      <div className="avatar-profile">
        {imgSelect && (
          <button className="remove-image-upload" onClick={removeImgFuc}>
            <AiFillCloseCircle />
          </button>
        )}
        <img
          src={
            imgSelect
              ? imgSelect
              : "https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png"
          }
          alt=""
          className="avatar-img"
        />
        <button className="btn-upload-profile" onClick={openModalFunc}>
          Upload New
        </button>
        <UploadImage />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-item">
          <label>Tên (bắt buộc)</label>
          <div
            className={`${
              formik.touched.name ? "input-err input-name" : "input-name"
            }`}
          >
            <input
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="Your Name"
              name="name"
              maxLength={30}
            />
            <span className="number-resignal">{remainingChars}</span>
          </div>
          <span className="err-text">
            {formik.touched.name && formik.errors.name}
          </span>
        </div>
        <div className="form-item">
          <span>Giới thiệu</span>
          <div className="bio-input">
            <textarea
              bordered
              maxLength={200}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Viết một chút về bản thân bạn ở đây"
            />
            <span className="number-resignal2">{remainingCharsBio}</span>
          </div>
          <span className="err-text">
            {formik.touched.description && formik.errors.description}
          </span>
        </div>
        <div className="form-item">
          <label>Số điện thoại</label>
          <div
            className={`${
              formik.touched.name ? "input-err input-name" : "input-name"
            }`}
          >
            <input
              type="text"
              onChange={formik.handleChange}
              name="phoneNumber"
              value={formik.values.phoneNumber}
              placeholder="Số điện thoại của bạn"
            />
          </div>
          <span className="err-text">
            {formik.touched.phoneNumber && formik.errors.phoneNumber}
          </span>
        </div>
        <button className="btn-submit">Save Changes</button>
      </form>
    </motion.div>
  );
};

export default Profile;
