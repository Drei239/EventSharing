import React from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";
import { AiFillSetting } from "react-icons/ai";

import "./slideBar.css";
import { NavLink } from "react-router-dom";
const SlideBar = () => {
  return (
    <div className="slideBar">
      <h2 className="slideBar-title">Settings</h2>
      <div className="slideBar-items">
        <NavLink
          to="profile"
          className={({ isActive }) =>
            isActive ? "slideBar-item-active" : "slideBar-item"
          }
        >
          <BsFillPersonFill className="slideBar-item-icon" />
          <span className="slideBar-item-text">Edit Profile</span>
        </NavLink>
        <NavLink
          to="personal"
          className={({ isActive }) =>
            isActive ? "slideBar-item-active " : "slideBar-item"
          }
        >
          <IoDocumentText className="slideBar-item-icon" />
          <span className="slideBar-item-text">Personal Info</span>
        </NavLink>
        <NavLink
          to="management"
          className={({ isActive }) =>
            isActive ? "slideBar-item-active " : "slideBar-item"
          }
        >
          <AiFillSetting className="slideBar-item-icon" />
          <span className="slideBar-item-text">Account Management</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SlideBar;
