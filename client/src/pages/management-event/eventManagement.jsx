import React, { useEffect, useState } from "react";
import "./eventManagement.css";
import {
  AiOutlineSearch,
  AiOutlineUnorderedList,
  AiOutlineCalendar,
  AiFillEdit,
  AiFillDelete,
  AiFillEye,
  AiOutlineBarChart,
} from "react-icons/ai";
import locale from "dayjs/locale/vi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { getAllEventofUser } from "../../features/events/eventSlice";
import en from "dayjs/locale/en";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
dayjs.locale(locale);
const eventTypeOption = [
  {
    label: "Nháp",
    value: "draft",
  },
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Đã Huỷ",
    value: "cancel",
  },
  {
    label: "Hoàn tất",
    value: "completed",
  },
  {
    label: "Tất cả",
    value: "all",
  },
];

const EventManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.event);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [selectType, setSelectType] = useState("list");
  const [status, setStatus] = useState("draft");
  const [search, setSearch] = useState("");
  const handleChangeSelect = (selectedOption) => {
    setStatus(selectedOption.value);
  };
  const modifiedEvents =
    events &&
    events.reduce((arr, item) => {
      return [
        ...arr,
        {
          ...item,
          start: new Date(item.timeBegin),
          end: new Date(item.timeEnd),
        },
      ];
    }, []);
  function renderEventContent(eventInfo) {
    return (
      <>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleClickSummary = (id) => {
    navigate(`/my-events/${id}`);
  };
  useEffect(() => {
    if (userInfo) {
      dispatch(
        getAllEventofUser({
          id: `${userInfo?._id}`,
          status: status,
          keyword: search,
        })
      );
    }
  }, [userInfo, status, search, dispatch]);
  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);
  useEffect(() => {
    console.log(events);
  }, [events]);
  // const handleSelectEvent = (event) => {
  //   console.log(event);
  // };

  return (
    <div className="management-events">
      <h2>Management Events</h2>
      <div className="management-events-filter">
        <div className="management-events-filter-search">
          <AiOutlineSearch className="management-events-filter-search-icon" />
          <input
            type="text"
            placeholder="Search events"
            value={search}
            onChange={handleChangeSearch}
          />
        </div>
        <div className="management-events-filter-type">
          <div
            className={`management-events-filter-type-list management-events-filter-type-item ${
              selectType === "list" &&
              "management-events-filter-type-item-select"
            }`}
            onClick={() => setSelectType("list")}
          >
            <AiOutlineUnorderedList className="management-events-filter-type-icon" />
            <span>List</span>
          </div>
          <div
            className={`management-events-filter-type-calendar management-events-filter-type-item ${
              selectType === "calendar" &&
              "management-events-filter-type-item-select"
            }`}
            onClick={() => setSelectType("calendar")}
          >
            <AiOutlineCalendar className="management-events-filter-type-icon" />
            <span>Calendar</span>
          </div>
        </div>
        <div className="management-events-filter-type">
          <Select
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: "#00abe1",
                padding: "0 10px",
                borderRadius: "25px",
                zIndex: 8,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "white", // Màu chữ cho giá trị đơn lẻ
              }),
            }}
            onChange={handleChangeSelect}
            options={eventTypeOption}
            defaultValue={eventTypeOption[0]}
          />
        </div>
        <Link to="/create-event" className="management-events-create-btn">
          Create Event
        </Link>
      </div>
      {selectType === "list" ? (
        <div className="management-events-list">
          <div className="management-events-list-header">
            <div>Event</div>
            <div>Gross</div>
            <div>Status</div>
          </div>
          <div className="management-events-list-items">
            {events &&
              events.length > 0 &&
              events.map((item, index) => {
                return (
                  <div className="management-events-list-item " key={index}>
                    <div className="management-events-list-item-info">
                      {/* <div className="management-events-list-item-info-1">
                        <span>
                          {dayjs(item.timeBegin).locale(en).format("MMM")}
                        </span>
                        <span>{dayjs(item.timeBegin).format("DD")}</span>
                      </div> */}
                      {/* <div className="management-events-list-item-info-2">
                        <img src={item.banner} alt="" />
                      </div> */}
                      <div className="management-events-list-item-info3">
                        <span>{item.title}</span>
                        <span>
                          {item?.location?.province
                            ? item.location.province.name
                            : ""}
                        </span>
                        <span>
                          {dayjs(item.timeBegin).format(
                            "[Thứ] d, Ngày DD [tháng] MM [năm] YYYY"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="management-events-list-item-gross">
                      {item.fee > 0 ? `${item.fee}.000 đ` : "free"}
                    </div>
                    <div className="management-events-list-item-status">
                      {item.status}
                    </div>
                    <div className="management-events-list-item-tool">
                      {" "}
                      {item.status === "Public" && (
                        <button className="management-events-list-item-btn-view">
                          <AiFillEye />
                        </button>
                      )}
                      {(item.status === "Public" ||
                        item.status === "completed") && (
                        <button
                          className="management-events-list-item-btn-summary"
                          onClick={() => handleClickSummary(item._id)}
                        >
                          <AiOutlineBarChart />
                        </button>
                      )}
                      {item.status === "draft" && (
                        <button className="management-events-list-item-btn-edit">
                          <AiFillEdit />
                        </button>
                      )}
                      {(item.status === "draft" ||
                        item.status === "completed") && (
                        <button className="management-events-list-item-btn-delete">
                          <AiFillDelete />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="management-events-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height={600}
            initialView="dayGridMonth"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={modifiedEvents}
            eventContent={renderEventContent}
          />
        </div>
      )}
    </div>
  );
};

export default EventManagement;
