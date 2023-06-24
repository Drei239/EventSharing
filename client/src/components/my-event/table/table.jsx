import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Table from "@mui/material/Table";
import { alpha } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import Tooltip from "@mui/material/Tooltip";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Checkbox } from "@mui/material";
import {
  updateOneOrder,
  updateRequest,
} from "../../../features/order/orderSlice";
import { IoMdMore } from "react-icons/io";
import Select from "react-select";
import "./table.css";
import EmptyIcon from "../../../assets/empty-icon.svg";

const options = [
  "Chuyển tất cả order đã chọn thành trạng thái đang xử lí",
  "Chuyển tất cả order đã chọn thành trạng thái đã thanh toán",
  "Chuyển tất cả order đã chọn thành trạng thái đã tham gia",
  "Chuyển tất cả order đã chọn thành trạng thái đã hoàn tiền",
];
function EnhancedTableToolbar(props) {
  const {
    numSelected,
    open,
    anchorEl,
    onOpenMenu,
    onCloseMenu,
    handleSelectMenu,
  } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Orders
        </Typography>
      )}
      {numSelected > 0 ? (
        <div>
          <button className="my-event-more-icon" onClick={onOpenMenu}>
            <IoMdMore />
          </button>
          <Menu
            id="basic-menu"
            open={open}
            onClose={onCloseMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            anchorEl={anchorEl}
          >
            {options.map((item, index) => {
              return (
                <MenuItem onClick={() => handleSelectMenu(index)} key={index}>
                  {item}
                </MenuItem>
              );
            })}
          </Menu>
        </div>
      ) : (
        <Tooltip title="Filter list">
          {/* <IconButton>
            <FilterListIcon />
          </IconButton> */}
          <div></div>
        </Tooltip>
      )}
    </Toolbar>
  );
}
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
    label: "Đang xử lí",
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

const TableMyEvent = ({ rows, idEvent }) => {
  const { countDocument } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [rowSelect, setRowSelect] = useState([]);
  const open = Boolean(anchorEl);
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleSelectMenu = (index) => {
    let data;
    if (index === 0) {
      data = selected.reduce((arr, item) => {
        return [
          ...arr,
          { orderId: item, isPaid: false, isJoined: false, isRefund: false },
        ];
      }, []);
    } else if (index === 1) {
      data = selected.reduce((arr, item) => {
        return [
          ...arr,
          { orderId: item, isPaid: true, isJoined: false, isRefund: false },
        ];
      }, []);
    } else if (index === 2) {
      data = selected.reduce((arr, item) => {
        return [
          ...arr,
          { orderId: item, isPaid: true, isJoined: true, isRefund: false },
        ];
      }, []);
    } else {
      data = selected.reduce((arr, item) => {
        return [
          ...arr,
          { orderId: item, isPaid: false, isJoined: false, isRefund: true },
        ];
      }, []);
    }
    console.log(data);
    if (data) {
      dispatch(updateRequest({ id: idEvent, data: data }));
    }
    setAnchorEl(null);
  };
  const onSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row?.orderId);
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
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowPerPage = (event) => {
    setRowPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeStatusOrder = (selectedOption, id, index) => {
    const updateItems = [...rowSelect];
    updateItems[index] = selectedOption;
    setRowSelect(updateItems);
    dispatch(updateOneOrder({ status: selectedOption.value, id: id }));
  };
  useEffect(() => {
    console.log(selected);
  }, [selected]);
  useEffect(() => {
    if (rows) {
      const row =
        rows &&
        rows.reduce((arr, row) => {
          if (row.isRefund) {
            return [...arr, statusOption[3]];
          } else if (row.isJoined) {
            return [...arr, statusOption[2]];
          } else if (row.isPaid) {
            return [...arr, statusOption[1]];
          } else {
            return [...arr, statusOption[0]];
          }
        }, []);
      setRowSelect(row);
    }
  }, [rows]);
  return (
    <div className="my-event-table">
      <EnhancedTableToolbar
        open={open}
        anchorEl={anchorEl}
        numSelected={selected.length}
        onOpenMenu={handleOpenMenu}
        onCloseMenu={handleCloseMenu}
        handleSelectMenu={handleSelectMenu}
      />
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                indeterminate={
                  selected.length > 0 && selected.length < rows.length
                }
                checked={rows.length > 0 && selected.length === rows.length}
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
        {countDocument > 0 ? (
          <TableBody>
            {rows.map((row, index) => {
              return (
                <>
                  {row.name && (
                    <TableRow
                      key={row._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() => handleClick(row.orderId)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selected.indexOf(row.orderId) !== -1}
                          inputProps={{
                            "aria-labelledby": `enhanced-table-checkbox-${index}`,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.no1}
                      </TableCell>
                      <TableCell>
                        {dayjs(row.timeOrder).format("ddd ,DD/MM/YYYY, hh:mm ")}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell align="left">
                        <Select
                          className="my-event-filter-select"
                          options={statusOption}
                          value={rowSelect[index]}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              height: "30px",
                              width: 150,
                            }),
                          }}
                          onChange={(e) =>
                            handleChangeStatusOrder(e, row?.orderId, index)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        ) : (
          <div className="my-event-table-empty">
            <img src={EmptyIcon} alt="" />
            <p>Không có Order nào </p>
          </div>
        )}
      </Table>

      {countDocument > 0 ? (
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={countDocument}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowPerPage}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default TableMyEvent;
