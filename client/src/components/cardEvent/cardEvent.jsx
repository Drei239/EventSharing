import React from "react";
import "./cardEvent.css";
import dayjs from "dayjs";
import locale from "dayjs/locale/vi";
import { BsFillGrid3X3GapFill, BsCalendar3WeekFill } from "react-icons/bs";
import { BiMap, BiMoney } from "react-icons/bi";
import { GiSandsOfTime } from "react-icons/gi";
import { GrCurrency } from "react-icons/gr";
dayjs.locale(locale);
const card = ({
  title,
  banner,
  categories,
  location,
  timeBegin,
  timeEnd,
  creator,
  fee,
  hotRequest,
  timeEndSignup,
}) => {
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
    <div className="card">
      <div className="hot-event"></div>
      <img src={banner} alt="" className="card-img" />
      <div className="content-card">
        <span className="card-title" title={title}>
          {title}
        </span>
        <div>
          <span className="card-author">{creator && creator?.name}</span>
        </div>
        <div className="cardEvent-info1">
          <div className="cardEvent-info1-categories">
            {" "}
            {categories &&
              categories.map((item) => {
                return (
                  <div key={item._id}>
                    <div className="cardEvent-info1-category">{item}</div>
                  </div>
                );
              })}
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
            <span className="cardEvent-info2-item-text">{location}</span>
          </div>
          <div className="cardEvent-info2-item">
            <BiMoney className="cardEvent-info2-item-icon" />
            <span className="cardEvent-info2-item-text">
              {fee === 0 ? "free" : `${fee} đ`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default card;
