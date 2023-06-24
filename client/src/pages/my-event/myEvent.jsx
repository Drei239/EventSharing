import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getOrderbyId } from "../../features/order/orderSlice";
import Select from "react-select";
import { BiSearch } from "react-icons/bi";
import { Progress } from "@nextui-org/react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import dayjs from "dayjs";
import "./myEvent.css";
import OpenIcon from "../../assets/icon-open.png";
import { Checkbox } from "@mui/material";
import { updateOneOrder } from "../../features/order/orderSlice";
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
const columns = [
  {
    key: "no1",
    label: "No1",
  },
  {
    key: "name",
    label: "Tên",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "phoneNumber",
    label: "Điện thoại",
  },
  {
    key: "status",
    label: "Trạng thái thanh toán",
  },
];
const statusOption = [
  {
    label: "Chưa thanh toán",
    value: "unpaid",
  },
  {
    label: "Đã thanh toán",
    value: "paid",
  },
  {
    label: "Đã tham gia",
    value: "joined",
  },
  {
    label: "Hoàn tiền",
    value: "refund",
  },
];

const MyEvent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [statusSelected, setStatusSelected] = useState(orderStatusOption[0]);
  const [sortSelected, setSortSelected] = useState(orderSortOption[0]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(10);
  const { orders, isLoading, isSuccess, isError, countDocument } = useSelector(
    (state) => state.order
  );
  const rows = [];
  for (let i = 0; i < orders.length; i++) {
    rows.push({
      key: i + 1,
      no1: i + 1,
      timeOrder: orders[i]?.createdAt,
      orderId: orders[i]?._id,
      ...orders[i]?.user,
    });
  }
  const onSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClick = (id) => {
    const selectIndex = selected.indexOf(id);
    if (selectIndex === -1) {
      setSelected((select) => [...select, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  };
  const handleChangeSort = (selectedOption) => {
    setSortSelected(selectedOption);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowPerPage = (event) => {
    setRowPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const hanleChangeStatus = (selectedOption) => {
    setStatusSelected(selectedOption);
  };
  const handleChangeStatusOrder = (selectedOption, id) => {
    dispatch(updateOneOrder({ status: selectedOption.value, id: id }));
  };
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
  useEffect(() => {
    console.log(selected);
  }, [selected]);
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

              <p className="my-event-header-address">
                {orders[0]?.event.location.address}{" "}
                {orders[0]?.event.location.ward.name}{" "}
                {orders[0]?.event.location.district.name}{" "}
                {orders[0]?.event.location.province.name}
              </p>
              <div className="my-event-header-info-sold">
                <span style={{ fontWeight: 700 }}>Sold:</span>
                <div>
                  <span>{orders.length}</span>
                  <span> / </span>
                  <span>{orders[0]?.event.limitUser}</span>
                </div>
                {/* <Progress
                  value={60}
                  color="primary"
                  size="sm"
                  // style={{ width: "200px" }}
                /> */}
              </div>
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
          <div>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < rows.length
                      }
                      checked={
                        rows.length > 0 && selected.length === rows.length
                      }
                      onChange={onSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>No1</TableCell>
                  <TableCell>Thời gian đặt hàng</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell width={100}>Phone</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <>
                    {row.name && (
                      <TableRow
                        key={row._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        onClick={() => handleClick(row._id)}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selected.indexOf(row._id) !== -1}
                            inputProps={{
                              "aria-labelledby": `enhanced-table-checkbox-${index}`,
                            }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.no1}
                        </TableCell>
                        <TableCell>
                          {dayjs(row.timeOrder).format(
                            "ddd ,DD/MM/YYYY, hh:mm "
                          )}
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell align="left">
                          <Select
                            className="my-event-filter-select"
                            options={statusOption}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                height: "30px",
                                width: 150,
                              }),
                            }}
                            onChange={(e) =>
                              handleChangeStatusOrder(e, row?.orderId)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={countDocument}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowPerPage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MyEvent;
