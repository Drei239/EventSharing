import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheck2All } from "react-icons/bs";
import { notificationToast } from "./notificationToast/notificationToast";
import { getAllNotify } from "../../features/notification/notifySlice";
import NotifyItem from "./notifyItem/notifyItem";
import "./notify.css";
const Notify = ({ closeNotify }) => {
  const dispatch = useDispatch();
  const { notify, isLoading, isSuccess } = useSelector((state) => state.notify);
  const { isLogin } = useSelector((state) => state.user);
  useEffect(() => {
    if (isLogin) {
      dispatch(getAllNotify());
    }
  }, [isLogin]);
  useEffect(() => {
    notificationToast({
      avatar:
        "https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg",
      content: "đã đăng kí sự kiện của bạn",
      name: "Hào Nguyễn",
    });
  }, []);
  useEffect(() => {
    console.log(notify);
  }, [notify]);
  return (
    <div className="notification">
      <button className="notification-close-btn" onClick={() => closeNotify()}>
        <AiOutlineClose />
      </button>
      <h3>Notifications</h3>
      <div className="notification-items">
        <NotifyItem
          avatar="https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg"
          content="đã đăng kí sự kiện của bạn"
          name="Hào Nguyễn"
        />
        <NotifyItem
          avatar="https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg"
          content="đã đăng kí sự kiện của bạn"
          name="Hào Nguyễn"
        />
        <NotifyItem
          avatar="https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg"
          content="đã đăng kí sự kiện của bạn"
          name="Hào Nguyễn"
        />
      </div>
      <div className="notification-footer">
        <div className="notification-footer-mark">
          <BsCheck2All style={{ fontSize: "20px" }} />
          <span>Mask all as read</span>
        </div>
      </div>
    </div>
  );
};

export default Notify;
