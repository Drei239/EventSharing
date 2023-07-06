import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./eventManagement.css";
import {
  AiOutlineSearch,
  AiOutlineUnorderedList,
  AiOutlineCalendar,
  AiFillEdit,
  AiFillDelete,
  AiFillEye,
  AiOutlineBarChart,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { Modal, useModal, Button, Loading } from "@nextui-org/react";
import locale from "dayjs/locale/vi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import notify from "../../utils/notify";
import EmptyIcon from "../../assets/empty.svg";

import { EmptyEvent, LoadingLayout } from "../../components";
import {
  getAllEventofUser,
  removeEventDraft,
} from "../../features/events/eventSlice";
dayjs.locale(locale);
const eventTypeOption = [
  {
    label: "Nháp",
    value: "draft",
  },
  {
    label: "Public",
    value: "Public",
  },
  {
    label: "Đã Huỷ",
    value: "Canceled",
  },
  {
    label: "Hoàn tất",
    value: "Completed",
  },
  {
    label: "Tất cả",
    value: "",
  },
];

const EventManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSuccessRemove, isError, events, isLoading, isErrorDelete } =
    useSelector((state) => state.event);
  const userInfo = useSelector((state) => state.user.userInfo);

  const { setVisible, bindings } = useModal();
  const [selectType, setSelectType] = useState("list");
  const [status, setStatus] = useState("draft");
  const [search, setSearch] = useState("");
  const [idEventDelete, setIdEventDelete] = useState(null);

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
    navigate(`/my-event/${id}`);
  };
  const handleDeleteEventDraft = () => {
    if (idEventDelete) {
      dispatch(removeEventDraft(idEventDelete));
      setVisible(false);
    }
  };
  const openModalDeleteEvent = (id) => {
    setIdEventDelete(id);
    setVisible(true);
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
    if (isSuccessRemove) {
      notify("Xoá sự kiện thành công", "success");
    }
  }, [isSuccessRemove]);
  useEffect(() => {
    if (isErrorDelete) {
      notify("Xoá sự kiện thất bại", "error");
    }
  }, [isErrorDelete]);
  return (
    <div className="management-events">
      <h2>Quản lý sự kiện</h2>
      <div className="management-events-filter">
        <div className="management-events-filter-search">
          <AiOutlineSearch className="management-events-filter-search-icon" />
          <input
            type="text"
            placeholder="Tìm sự kiện"
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
            <span>Danh sách</span>
          </div>
          <div
            className={`management-events-filter-type-calendar management-events-filter-type-item ${
              selectType === "calendar" &&
              "management-events-filter-type-item-select"
            }`}
            onClick={() => setSelectType("calendar")}
          >
            <AiOutlineCalendar className="management-events-filter-type-icon" />
            <span>Lịch</span>
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
      </div>
      {selectType === "list" ? (
        <div className="management-events-list">
          <div className="management-events-list-header">
            <div>Sự kiện</div>
            <div>Phí</div>
            <div>Trạng thái</div>
          </div>
          <div className="management-events-list-items">
            {!isLoading ? (
              events && events.length > 0 ? (
                events.map((item, index) => {
                  return (
                    <div className="management-events-list-item " key={index}>
                      <div className="management-events-list-item-info">
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
                        {item.status === "draft"
                          ? "Nháp"
                          : item.status === "Public"
                          ? "Công khai"
                          : item.status === "Canceled"
                          ? "Đã huỷ"
                          : "Đã hoàn thành"}
                      </div>
                      <div className="management-events-list-item-tool">
                        {" "}
                        {(item.status === "Public" ||
                          item.status === "Canceled" ||
                          item.status === "Completed") && (
                          <Link to={`/event/${item._id}`}>
                            <button className="management-events-list-item-btn-view">
                              <AiFillEye />
                            </button>
                          </Link>
                        )}
                        {(item.status === "Public" ||
                          item.status === "Completed" ||
                          item.status === "Canceled") && (
                          <button
                            className="management-events-list-item-btn-summary"
                            onClick={() => handleClickSummary(item._id)}
                          >
                            <AiOutlineBarChart />
                          </button>
                        )}
                        {item.status === "draft" && (
                          <Link
                            to={`/event-create-update?type=update&id=${item._id}`}
                            className="management-events-list-item-btn-edit"
                          >
                            <AiFillEdit />
                          </Link>
                        )}
                        {(item.status === "draft" ||
                          item.status === "completed") && (
                          <button
                            onClick={() => openModalDeleteEvent(item._id)}
                            className="management-events-list-item-btn-delete"
                          >
                            <AiFillDelete />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ marginTop: "50px" }}>
                  <EmptyEvent
                    icon={EmptyIcon}
                    message="Không có sự kiện nào "
                    link="/event-create-update"
                    messageLink="Tạo sự kiện"
                  />
                </div>
              )
            ) : (
              <div className="management-loading">
                <Loading size="md" />
              </div>
            )}
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

      <Modal {...bindings} closeButton width={500}>
        <div className="modal-cancel-event">
          <AiOutlineCloseCircle className="close-circle-icon" />
          <h3>Bạn có chắc chắn ?</h3>
          <p>
            Bạn có thực sự chắc chắn muốn xoá sự kiện này không ? Quá trình này
            không thể hoàn tác.
          </p>
          <div className="modal-cancel-event-btns">
            <Button onClick={() => setVisible(false)}>Không</Button>
            <Button color="error" onClick={handleDeleteEventDraft}>
              Chắc chắn
            </Button>
          </div>
        </div>
      </Modal>
      {isLoading && <LoadingLayout />}
    </div>
  );
};

export default EventManagement;
