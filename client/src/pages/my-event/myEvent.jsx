import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getOrderbyId } from "../../features/order/orderSlice";
import Select from "react-select";
import { BiSearch } from "react-icons/bi";
import { useModal } from "@nextui-org/react";
import { RiMailFill } from "react-icons/ri";
import dayjs from "dayjs";
import "./myEvent.css";
import OpenIcon from "../../assets/icon-open.png";
import { Table, SendEmail } from "../../components/my-event";
import notify from "../../utils/notify";
import { openModalSendEmail } from "../../features/order/orderSlice";
const orderStatusOption = [
  {
    label: "Tất cả đơn hàng",
    value: "all",
  },
  { label: "Đã Thanh toán", value: "paid" },
  { label: "Chưa thanh toán", value: "unpaid" },
  { label: "Đã hoàn tiền", value: "refund" },
  { label: "Đã tham gia", value: "joined" },
];

const orderSortOption = [
  {
    label: "Mới nhất",
    value: "-createdAt",
  },
  {
    label: "Cũ nhất",
    value: "createdAt",
  },
];

const MyEvent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [statusSelected, setStatusSelected] = useState(orderStatusOption[0]);
  const [sortSelected, setSortSelected] = useState(orderSortOption[0]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selected, setSelected] = useState([]);

  const { orders, isLoading, isSuccess, isError } = useSelector(
    (state) => state.order
  );
  const rows = [];
  for (let i = 0; i < orders.length; i++) {
    rows.push({
      key: i + 1,
      no1: i + 1,
      timeOrder: orders[i]?.createdAt,
      orderId: orders[i]?._id,
      isPaid: orders[i]?.isPaid,
      isRefund: orders[i]?.isRefund,
      isJoined: orders[i]?.isJoined,
      status: orders[i]?.event.status,
      ...orders[i]?.user,
    });
  }
  const openMoreSelect = () => {};

  const handleChangeSort = (selectedOption) => {
    setSortSelected(selectedOption);
  };
  const hanleChangeStatus = (selectedOption) => {
    setStatusSelected(selectedOption);
  };
  const handleClickSendMailAll = () => {
    dispatch(openModalSendEmail("all"));
  };
  useEffect(() => {
    if (isSuccess) {
      notify("Thay đổi trạng thái của đơn hàng thành công", "success");
    }
  }, [isSuccess]);
  const handleClickSendEmailSelect = () => {
    dispatch(openModalSendEmail("select"));
  };
  useEffect(() => {
    if (isError) {
      notify("Thay đổi trạng thái của đơn hàng thất bại", "error");
    }
  }, [isError]);
  useEffect(() => {
    if (id) {
      dispatch(
        getOrderbyId({
          id,
          keyword: searchKeyword,
          sort: sortSelected?.value,
          status: statusSelected?.value,
        })
      );
    }
  }, [id, searchKeyword, sortSelected, statusSelected]);
  useEffect(() => {
    console.log(orders);
  }, [orders]);
  return (
    <>
      {orders && orders.length > 0 && (
        <div className="my-event" key={orders._id}>
          <div className="my-event-header">
            <img src={orders[0]?.event.banner} alt="" />
            <div className="my-event-header-info">
              <div className="my-event-header-status">
                <img src={OpenIcon} alt="" />
                <span>{orders[0]?.event.status}</span>
              </div>
              <h3>{orders[0]?.event.title}</h3>
              <div className="my-event-header-info-time">
                <span>Thời gian diễn ra sự kiện: </span>
                <div>
                  <span>
                    {dayjs(orders[0]?.event.timeBegin).format(
                      "ddd ,DD/MM/YYYY, hh:mm "
                    )}
                  </span>
                  <span> - </span>
                  <span>
                    {dayjs(orders[0]?.event.timeEnd).format(
                      "ddd ,DD/MM/YYYY, hh:mm "
                    )}
                  </span>
                </div>
              </div>
              <div className="my-event-header-address">
                <span>Address: </span>
                <p className="my-event-header-address">
                  {orders[0]?.event.location.address}{" "}
                  {orders[0]?.event.location.ward.name}{" "}
                  {orders[0]?.event.location.district.name}{" "}
                  {orders[0]?.event.location.province.name}
                </p>
              </div>
              <div className="my-event-header-info-sold">
                <span style={{ fontWeight: 700 }}>Sold:</span>
                <div>
                  <span>{orders.length}</span>
                  <span> / </span>
                  <span>{orders[0]?.event.limitUser}</span>
                </div>
              </div>
              <div className="my-event-header-info-fee">
                <span>Fee: </span>
                <span>
                  {orders[0].event.fee > 0 ? `${orders[0].event.fee}đ` : "free"}
                </span>
              </div>
            </div>
            <div className="my-event-header-status-sale">
              <span
                className={`${
                  new Date(orders[0]?.event?.timeEndSignup).getTime() <
                  new Date().getTime()
                    ? "my-event-header-status-sale-on"
                    : "my-event-header-status-sale-end"
                } `}
              ></span>
              <span
                className={` ${
                  new Date(orders[0]?.event?.timeEndSignup).getTime() <
                  new Date().getTime()
                    ? "my-event-header-status-sale-on-text"
                    : "my-event-header-status-sale-end-text"
                }`}
              >
                {new Date(orders[0]?.event?.timeEndSignup).getTime() <
                new Date().getTime()
                  ? "On Sale"
                  : "Sale Ended"}
              </span>
            </div>
          </div>
          <div className="my-event-filter">
            <Select
              className="my-event-filter-select"
              options={orderStatusOption}
              value={statusSelected}
              onChange={hanleChangeStatus}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  height: "30px",
                }),
              }}
            />
            <Select
              className="my-event-filter-select"
              options={orderSortOption}
              value={sortSelected}
              onChange={handleChangeSort}
            />
            <div className="my-event-filter-search ">
              <input
                type="text"
                placeholder="Name/ Email/ Phone Number"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button>
                <BiSearch />
              </button>
            </div>
          </div>

          <Table
            rows={rows}
            idEvent={id}
            selected={selected}
            setSelected={setSelected}
          />
          <div className="my-event-send-email">
            <RiMailFill className="my-event-send-email-icon" />
            <span>Gửi mail đến</span>
            <span
              className="my-event-send-email-all"
              onClick={handleClickSendMailAll}
            >
              Tất cả
            </span>
            {selected && selected.length > 0 && (
              <span
                className="my-event-send-email-selected"
                onClick={handleClickSendEmailSelect}
              >
                Email đã chọn
              </span>
            )}
          </div>
          <SendEmail selected={selected} />
        </div>
      )}
    </>
  );
};

export default MyEvent;
