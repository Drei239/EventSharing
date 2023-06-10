import React from "react";
import "./cardEvent.css";
import dayjs from "dayjs";
import { BsFillGrid3X3GapFill, BsCalendar3WeekFill } from "react-icons/bs";
import { BiMap, BiMoney } from "react-icons/bi";
import { GiSandsOfTime } from "react-icons/gi";
import { GrCurrency } from "react-icons/gr";

const card = ({
  title,
  date,
  author,
  img,
  price,
  hotRequest,
  categoryaddress,
}) => {
  return (
    <div className="card">
      <div className="hot-event"></div>
      <img src={img} alt="" className="card-img" />
      <div className="content-card">
        <span className="card-title" title={title}>
          {title}
        </span>
        <div>
          <span className="card-author">{author}</span>
        </div>
        <div className="cardEvent-info1">
          <span className="cardEvent-info1-category">Công nghệ</span>
          <div className="card-calendar">
            <BsCalendar3WeekFill className="card-calendar-icon" />
            <span className="card-calendar-text">Ngày 14 tháng 2 năm 2024</span>
          </div>
        </div>
        <div className="cardEvent-info2">
          <div className="cardEvent-info2-item">
            <GiSandsOfTime className="cardEvent-info2-item-icon" />
            <span className="cardEvent-info2-item-text">Sắp tới</span>
          </div>
          <div className="cardEvent-info2-item">
            <BiMap className="cardEvent-info2-item-icon" />
            <span className="cardEvent-info2-item-text">Paris</span>
          </div>
          <div className="cardEvent-info2-item">
            <BiMoney className="cardEvent-info2-item-icon" />
            <span className="cardEvent-info2-item-text">$ 99</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default card;
