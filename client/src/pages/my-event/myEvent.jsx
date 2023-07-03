import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Select from "react-select";
import { BiSearch } from "react-icons/bi";
import { useModal, Modal, Button } from "@nextui-org/react";
import { RiMailFill } from "react-icons/ri";
import { AiOutlineCloseCircle } from "react-icons/ai";
import dayjs from "dayjs";

import { ExportToExcel } from "../../components/ui";
import {
  getOrderbyId,
  updateCancelEvent,
} from "../../features/order/orderSlice";
import "./myEvent.css";
import OpenIcon from "../../assets/icon-open.png";
import { Table, SendEmail } from "../../components/my-event";
import notify from "../../utils/notify";
import { openModalSendEmail } from "../../features/order/orderSlice";
import {
  cancelEvent,
  confirmEventCompeleted,
} from "../../features/events/eventSlice";

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
  const { setVisible, bindings } = useModal();
  const [statusSelected, setStatusSelected] = useState(orderStatusOption[0]);
  const [sortSelected, setSortSelected] = useState(orderSortOption[0]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(50);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selected, setSelected] = useState([]);

  const { orders, isLoading, isSuccess, isError } = useSelector(
    (state) => state.order
  );
  const isSuccessEvent = useSelector((state) => state.event.isSuccess);
  const rows = [];
  for (let i = 0; i < orders.length; i++) {
    let status;
    if (orders[i].isRefund) {
      status = "Đã hoàn tiền";
    } else if (orders[i].isJoined) {
      status = "Đã tham gia";
    } else if (orders[i].isPaid) {
      status = "Đã thanh toán";
    } else {
      status = "Đang xử lí";
    }
    rows.push({
      no1: i + 1,
      timeOrder: dayjs(orders[i]?.createdAt).format("ddd ,DD/MM/YYYY, hh:mm "),
      orderId: orders[i]?._id,
      status: status,
      eventStatus: orders[i]?.event?.status,
      name: orders[i]?.user?.name,
      email: orders[i]?.user?.email,
      timeBegin: orders[i]?.event.timeBegin,
    });
  }

  const handleChangeSort = (selectedOption) => {
    setSortSelected(selectedOption);
  };
  const hanleChangeStatus = (selectedOption) => {
    setStatusSelected(selectedOption);
  };
  const handleClickSendMailAll = () => {
    dispatch(openModalSendEmail("all"));
  };
  const handleCancleEvent = () => {
    dispatch(cancelEvent(id));
  };
  const handleConfirmCompletedEvent = () => {
    dispatch(confirmEventCompeleted(orders[0]?.event._id));
  };
  useEffect(() => {
    if (isSuccess) {
      notify("Thay đổi trạng thái của đơn hàng thành công", "success");
    }
  }, [isSuccess]);
  const handleClickSendEmailSelect = () => {
    dispatch(openModalSendEmail("select"));
  };
  const OpenModalCancelEvent = () => {
    setVisible(true);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowPerPage = (option) => {
    setRowPerPage(option.target.value);
    setPage(0);
  };
  useEffect(() => {
    if (isError) {
      notify("Thay đổi trạng thái của đơn hàng thất bại", "error");
    }
  }, [isError]);
  useEffect(() => {
    if (isSuccessEvent) {
      dispatch(updateCancelEvent());
      notify("Huỷ sự kiện thành công");
    }
  }, [isSuccessEvent]);
  useEffect(() => {
    if (id) {
      dispatch(
        getOrderbyId({
          id,
          keyword: searchKeyword,
          sort: sortSelected?.value,
          status: statusSelected?.value,
          page: page,
          limit: rowsPerPage,
        })
      );
    }
  }, [id, searchKeyword, sortSelected, statusSelected, page, rowsPerPage]);
  useEffect(() => {
    console.log(orders);
  }, [orders]);
  return (
    <>
      {orders && orders.length > 0 && (
        <div className="my-event" key={orders._id}>
          <div className="my-event-header">
            <img src={orders[0]?.event?.banner} alt="" />
            <div className="my-event-header-info">
              <div className="my-event-header-status">
                {orders[0]?.event.status === "Public" && (
                  <img src={OpenIcon} alt="" />
                )}
                <span
                  className={`${
                    orders[0]?.event.status === "Canceled"
                      ? "my-event-header-status-cancel"
                      : ""
                  }`}
                >
                  {orders[0]?.event.status === "Public"
                    ? "Công khai"
                    : orders[0]?.event.status === "Canceled"
                    ? "Đã Huỷ"
                    : ""}
                </span>
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
                <span>Địa chỉ: </span>
                <p className="my-event-header-address">
                  {orders[0]?.event.location.address}{" "}
                  {orders[0]?.event.location.ward.name}{" "}
                  {orders[0]?.event.location.district.name}{" "}
                  {orders[0]?.event.location.province.name}
                </p>
              </div>
              <div className="my-event-header-info-sold">
                <span style={{ fontWeight: 700 }}>Đã bán:</span>
                <div>
                  <span>{orders.length}</span>
                  <span> / </span>
                  <span>{orders[0]?.event.limitUser}</span>
                </div>
              </div>
              <div className="my-event-header-info-fee">
                <span>Phí: </span>
                <span>
                  {orders[0].event.fee > 0
                    ? `${orders[0].event.fee}đ`
                    : "Miễn phí"}
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
                  ? "Đang bán"
                  : "Ngừng bán"}
              </span>
            </div>
            {orders &&
            orders.length > 0 &&
            orders[0]?.event?.status === "Public" &&
            new Date(orders[0]?.event.timeEnd).getTime() >
              new Date().getTime() ? (
              <button
                className="my-event-header-btn-cancel"
                onClick={OpenModalCancelEvent}
              >
                Huỷ sự kiện này
              </button>
            ) : (
              <button
                color="primary"
                onClick={handleConfirmCompletedEvent}
                className="my-event-header-btn-confirm"
              >
                Xác nhận sự kiện đã hoàn thành
              </button>
            )}
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
          <ExportToExcel data={rows} />
          <Table
            rows={rows}
            idEvent={id}
            selected={selected}
            setSelected={setSelected}
            page={page}
            rowPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowPerPage={handleChangeRowPerPage}
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
      <Modal {...bindings} closeButton width={500}>
        <div className="modal-cancel-event">
          <AiOutlineCloseCircle className="close-circle-icon" />
          <h3>Bạn có chắc chắn ?</h3>
          <p>
            Bạn có thực sự chắc chắn muốn huỷ bỏ sự kiện này? Quá trình này
            không thể hoàn tác.
          </p>
          <div className="modal-cancel-event-btns">
            <Button onClick={() => setVisible(false)}>Không</Button>
            <Button color="error" onClick={handleCancleEvent}>
              Chắc chắn
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MyEvent;
