import React from "react";
import { Loading, Modal } from "@nextui-org/react";
import "./loading.css";
const LoadingLayout = ({ loading }) => {
  return (
    <Modal {...loading} className="loading-layout">
      {" "}
      <Loading color="primary" type="default" size="xl" />
    </Modal>
  );
};

export default LoadingLayout;
