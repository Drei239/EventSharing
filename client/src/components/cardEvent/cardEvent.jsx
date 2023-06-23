import React from "react";
import dayjs from "dayjs";
import locale from "dayjs/locale/vi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BsCalendar3WeekFill } from "react-icons/bs";
import { BiMap, BiMoney } from "react-icons/bi";
import { GiSandsOfTime } from "react-icons/gi";

import { Loading } from "..";
import "./cardEvent.css";
dayjs.locale(locale);
const Card = ({
  _id,
  title,
  banner,
  category,
  location,
  timeBegin,
  timeEnd,
  creator,
  fee,
  timeEndSignup,
}) => {
  const { isLoading } = useSelector((state) => state.event);
  const checkDate = (startDate, endDate) => {
    if (new Date(startDate).getTime() < new Date().getTime()) {
      return "Sắp tới";
    } else if (
      new Date(startDate).getTime() >
      new Date().getTime() <
      new Date().getTime() <
      new Date(endDate).getTime()
    ) {
      return "Đang diễn ra";
    } else if (
      new Date(timeEndSignup).getTime() > new Date().getTime() &&
      new Date().getTime() < new Date(endDate).getTime().getTime()
    ) {
      return "Hết hạn đăng kí";
    } else {
      return "Đã kết thúc";
    }
  };
  return (
    <>
      {!isLoading && (
        <Link to={`/event/${_id}`}>
          <div className="card-items">
            <div className="hot-event"></div>
            <img src={banner} alt="" className="card-img" loading="lazy" />
            <div className="content-card">
              <p className="card-title" title={title}>
                {title}
              </p>
              <div>
                <span className="card-author">{creator && creator?.name}</span>
              </div>
              <div className="cardEvent-info1">
                <div className="cardEvent-info1-categories">
                  {" "}
                  <div className="cardEvent-info1-category">
                    {category?.categoryName}
                  </div>
                </div>
              </div>
              <div className="card-calendar">
                <BsCalendar3WeekFill className="card-calendar-icon" />
                <span className="card-calendar-text">
                  {dayjs(timeBegin).format("Ngày DD [tháng] MM [năm] YYYY")}
                </span>
              </div>
            </div>
            <div className="cardEvent-info2">
              <div className="cardEvent-info2-item">
                <GiSandsOfTime className="cardEvent-info2-item-icon" />
                <span className="cardEvent-info2-item-text">
                  {checkDate(timeBegin, timeEnd)}
                </span>
              </div>
              <div className="cardEvent-info2-item">
                <BiMap className="cardEvent-info2-item-icon" />
                <span className="cardEvent-info2-item-text">
                  {location?.province ? location.province.name : ""}
                </span>
              </div>
              <div className="cardEvent-info2-item">
                <BiMoney className="cardEvent-info2-item-icon" />
                <span className="cardEvent-info2-item-text">
                  {fee === 0 ? "free" : `${fee} đ`}
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default Card;
