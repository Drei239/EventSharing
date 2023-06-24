import React from "react";
import { NavLink } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";
import { AiFillSetting } from "react-icons/ai";
// import { motion } from 'framer-motion';

import "./slideBar.css";

const SlideBar = () => {
  return (
    <div className="slideBar">
      <h2 className="slideBar-title">Cài đặt</h2>
      <div className="slideBar-items">
        <NavLink
          to="profile"
          className={({ isActive }) =>
            isActive ? "slideBar-item-active" : "slideBar-item"
          }
        >
          <BsFillPersonFill className="slideBar-item-icon" />
          <span className="slideBar-item-text">Chỉnh sửa hồ sơ</span>
        </NavLink>
        <NavLink
          to="personal"
          className={({ isActive }) =>
            isActive ? "slideBar-item-active " : "slideBar-item"
          }
        >
          <IoDocumentText className="slideBar-item-icon" />
          <span className="slideBar-item-text">Thông tin cá nhân</span>
        </NavLink>
        <NavLink
          to="management"
          className={({ isActive }) =>
            isActive ? "slideBar-item-active " : "slideBar-item"
          }
        >
          <AiFillSetting className="slideBar-item-icon" />
          <span className="slideBar-item-text">Quản lí tài khoản</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SlideBar;
