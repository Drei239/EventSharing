import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheck2All } from "react-icons/bs";
import { notificationToast } from "./notificationToast/notificationToast";
import {
  getAllNotify,
  markByIdNotify,
} from "../../features/notification/notifySlice";
import NotifyItem from "./notifyItem/notifyItem";
import "./notify.css";
const Notify = ({ closeNotify }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notify, isLoading, isSuccess } = useSelector((state) => state.notify);
  const { isLogin } = useSelector((state) => state.user);
  useEffect(() => {
    if (isLogin) {
      dispatch(getAllNotify());
    }
  }, [isLogin]);
  const handleClickEvent = async (notifyItem) => {
    await dispatch(markByIdNotify(notifyItem._id));
    if (notifyItem.notifyType === "new-order") {
      navigate(`/my-event/${notifyItem?.eventId}`);
    } else if (notifyItem.notifyType === "new-comment") {
      navigate(`/event/${notifyItem?.commentId?.event}`);
    }
  };
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
        {notify &&
          notify.length > 0 &&
          notify.map((item, index) => {
            return (
              <div key={item._id} onClick={() => handleClickEvent(item)}>
                <NotifyItem
                  avatar={item?.notifyFrom?.avatar}
                  content={item?.content}
                  name={item?.notifyFrom?.name}
                  comment={item?.commentId?.comment}
                  notifyType={item?.notifyType}
                  isReadMessage={item?.isReadMessage}
                />
              </div>
            );
          })}
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
