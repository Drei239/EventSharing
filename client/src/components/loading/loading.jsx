import React from "react";
import { Loading } from "@nextui-org/react";
import "./loading.css";
const Loader = () => {
  return (
    <div className="loading">
      <Loading type="spinner" size="xl" />
    </div>
  );
};

export default Loader;
