import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Table from "@mui/material/Table";
import { alpha, useTheme } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import Tooltip from "@mui/material/Tooltip";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
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
// import { TablePagination } from "../../ui";

const options = [
  "Chuyển thành phần đã chọn thành đang xử lí",
  "Chuyển thành phần đã chọn thành đã thanh toán",
  "Chuyển thành phần đã chọn thành đã tham gia",
  "Chuyển thành phần đã chọn thành đã hoàn tiền",
];
function EnhancedTableToolbar(props) {
  const {
    numSelected,
    open,
    anchorEl,
    onOpenMenu,
    onCloseMenu,
    handleSelectMenu,
    rows,
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
              let requestDisable;
              if (
                rows[0].eventStatus === "Canceled" &&
                (index == 1 || index == 2)
              ) {
                requestDisable = true;
              } else {
                requestDisable = false;
              }
              return (
                <MenuItem
                  sx={{ fontSize: "12px" }}
                  disabled={requestDisable}
                  onClick={() => handleSelectMenu(index)}
                  key={index}
                >
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
    label: "Đã hoàn tiền",
    value: "refund",
  },
];

const TableMyEvent = ({ rows, idEvent, selected, setSelected }) => {
  const { countDocument } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(50);
  const [anchorEl, setAnchorEl] = useState(null);

  const [rowSelect, setRowSelect] = useState([]);
  const open = Boolean(anchorEl);
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const isOptionDisabled = (option, status) => {
    console.log(status);
    if (status === "Canceled") {
      const disableOptions = ["paid", "joined"];
      return disableOptions.includes(option.value);
    } else {
      const disableOptions = ["refund"];
      return disableOptions.includes(option.value);
    }
  };
  const handleSelectMenu = (index) => {
    let data;
    if (index === 0) {
      data = selected.reduce((arr, item) => {
        return [
          ...arr,
          {
            orderId: item,
            isPaid: false,
            isJoined: false,
            isRefund: false,
            email: rows?.find((item) => item.orderId == item.toString())?.email,
          },
        ];
      }, []);
    } else if (index === 1) {
      data = selected.reduce((arr, item) => {
        console.log(
          rows?.find((row) => row.orderId.toString() == item.toString())
        );
        return [
          ...arr,
          {
            orderId: item,
            isPaid: true,
            isJoined: false,
            isRefund: false,
            email: rows?.find(
              (row) => row.orderId.toString() == item.toString()
            )?.email,
          },
        ];
      }, []);
    } else if (index === 2) {
      data = selected.reduce((arr, item) => {
        return [
          ...arr,
          {
            orderId: item,
            isPaid: true,
            isJoined: true,
            isRefund: false,
            email: rows?.find((item) => item.orderId === item)?.email,
          },
        ];
      }, []);
    } else {
      data = selected.reduce((arr, item) => {
        return [
          ...arr,
          {
            orderId: item,
            isPaid: false,
            isJoined: false,
            isRefund: true,
            email: rows?.find((item) => item.orderId === item)?.email,
          },
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
  const handleChangeRowPerPage = (option) => {
    setRowPerPage(option.target.value);
    setPage(1);
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

  return (
    <div className="my-event-table">
      <EnhancedTableToolbar
        rows={rows}
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
                      <TableCell>{row.timeOrder}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell align="left">
                        <Select
                          className="my-event-filter-select"
                          options={statusOption}
                          value={statusOption.find(
                            (item) => item.label === row.status
                          )}
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
                          isOptionDisabled={(option) =>
                            isOptionDisabled(option, row.eventStatus)
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
          rowsPerPageOptions={[50, 100, 200]}
          component="div"
          count={countDocument}
          rowsPerPage={rowsPerPage}
          page={page}
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
