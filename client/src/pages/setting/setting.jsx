import React from "react";
import { SlideBar } from "../../components";
import { Route, Routes } from "react-router-dom";
import { Profile, Management, Personal } from "./index";
import "./index.css";
const Setting = () => {
  return (
    <div className="setting">
      <SlideBar />
      <Routes>
        <Route path="profile" element={<Profile />} />
        <Route path="management" element={<Management />} />
        <Route path="personal" element={<Personal />} />
      </Routes>
    </div>
  );
};

export default Setting;
