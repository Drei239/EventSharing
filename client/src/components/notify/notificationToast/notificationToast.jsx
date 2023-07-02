import React from "react";
import { toast } from "react-toastify";
import "./notificationToast.css";

export const notificationToast = (noti) => {
  return toast(
    <div className="notification-toast">
      <img src={noti.avatar} alt="" />
      <div>
        <p className="notification-toast-content">
          {noti.name} <span>{noti.content}</span>
        </p>
        <span className="notification-toast-time">Vài giây trước</span>
      </div>
    </div>,
    {
      position: "bottom-left",
      autoClose: 10000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }
  );
};
