import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheck2All } from "react-icons/bs";
import { notificationToast } from "./notificationToast/notificationToast";
import notifyIcon from "../../assets/notifycation-icon.svg";
import {
  getAllNotify,
  markAllNotify,
  markByIdNotify,
} from "../../features/notification/notifySlice";
import NotifyItem from "./notifyItem/notifyItem";
import "./notify.css";
const Notify = ({ closeNotify, isOpenNotify }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const timeRef = useRef();
  const { notify, isLoading, isSuccess, countDocument } = useSelector(
    (state) => state.notify
  );
  const { isLogin } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [notifyType, setNotifyType] = useState("all");
  useEffect(() => {
    if (isLogin) {
      dispatch(getAllNotify({ page, notifyTypeRead: notifyType }));
    }
  }, [isLogin, page, notifyType]);
  useEffect(() => {
    setPage(1);
  }, [notifyType]);
  const handleClickEvent = async (notifyItem) => {
    await dispatch(markByIdNotify(notifyItem._id));
    if (notifyItem.notifyType === "new-order") {
      navigate(`/my-event/${notifyItem?.eventId}`);
    } else if (notifyItem.notifyType === "new-comment") {
      navigate(`/event/${notifyItem?.commentId?.event}`);
    }
  };
  const markReadAll = () => {
    dispatch(markAllNotify());
  };

  const handleScroll = () => {
    if (isLoading || notify.length === 0) return;
    if (
      scrollRef.current.scrollHeight - scrollRef.current.scrollTop <=
      scrollRef.current.clientHeight + 20
    ) {
      setPage(page + 1);
    }
  };
  useEffect(() => {
    if (notify && page > 1) {
      const newData = [...new Set([...data, ...notify])];
      setData(newData);
    } else {
      setData(notify);
    }
  }, [notify]);

  useEffect(() => {}, [data]);
  return (
    <>
      {isOpenNotify && (
        <div
          className={`notification ${countDocument > 0 && "notifycation-new"}`}
        >
          <button
            className="notification-close-btn"
            onClick={() => closeNotify()}
          >
            <AiOutlineClose />
          </button>
          <h3>Thông báo</h3>
          <div className="notification-type">
            <button
              className={`notification-type-btn ${
                notifyType === "all" && "notification-type-select"
              }`}
              onClick={() => setNotifyType("all")}
            >
              Tất cả
            </button>
            <button
              onClick={() => setNotifyType("unRead")}
              className={`notification-type-btn ${
                notifyType === "unRead" && "notification-type-select"
              } `}
            >
              Chưa đọc
            </button>
          </div>
          <div
            className="notification-items"
            onScroll={handleScroll}
            ref={scrollRef}
          >
            {data &&
              data.length > 0 &&
              data.map((item, index) => {
                console.log(item.createdAt);
                return (
                  <div key={item._id} onClick={() => handleClickEvent(item)}>
                    <NotifyItem
                      avatar={item?.notifyFrom?.avatar}
                      content={item?.content}
                      name={item?.notifyFrom?.name}
                      comment={item?.commentId?.comment}
                      notifyType={item?.notifyType}
                      isReadMessage={item?.isReadMessage}
                      time={item?.createdAt}
                      replyContent={item?.replyContent}
                    />
                  </div>
                );
              })}
            {data.length <= 0 && (
              <div className="notication-empty">
                <img src={notifyIcon} alt="" />
                <p>Bạn không có thông báo nào</p>
              </div>
            )}
          </div>
          <div className="notification-footer">
            <div className="notification-footer-mark" onClick={markReadAll}>
              <BsCheck2All style={{ fontSize: "20px" }} />
              <span>Mask all as read</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notify;
