const eventError = {
  ERR_1: "TẠO SƯ KIỆN MỚI THẤT BẠI!",
  ERR_2: "KHÔNG TÌM THẤY SỰ KIỆN THEO YÊU CẦU!",
  ERR_3: "CHỈ CÓ THỂ CẬP NHẬT SỰ KIỆN NHÁP!",
  ERR_4: "THỜI GIAN SỰ KIỆN KHÔNG HỢP LỆ!",
  ERR_5: "TIÊU ĐỀ SỰ KIỆN ĐÃ TỒN TẠI!",
  ERR_6: "BẠN ĐÃ REVIEW SỰ KIỆN NÀY RỒI!",
  ERR_7: "CHỈ CÓ NGƯỜI ĐÃ THAM GIA MỚI CÓ QUYỀN REVIEW SỰ KIỆN!",
  ERR_8:
    "CHỈ CÓ NGƯỜI TỔ CHỨC SỰ KIỆN MỚI CÓ QUYỀN CẬP NHẬT THÔNG TIN SỰ KIỆN!",
  ERR_9: "BẠN KHÔNG THỂ XOÁ SỰ KIỆN NÀY",
  ERR_10: "CHỈ CÓ THỂ HUỶ SỰ KIỆN ĐÃ PUBLIC",
};

const eventSucc = {
  SUC_1: "TẠO SỰ KIỆN MỚI THÀNH CÔNG!",
  SUC_2: "GET THÀNH CÔNG CÁC SỰ KIỆN PUBLIC!",
  SUC_3: "GET THÀNH CÔNG SỰ KIỆN!",
  SUC_4: "TẠO URL LINK THÀNH CÔNG",
  SUC_5: "ĐĂNG REVIEW SỰ KIỆN THÀNH CÔNG!",
  SUC_6: "CẬP NHẬT THÔNG TIN SỰ KIỆN THÀNH CÔNG!",
  SUC_7: "XOÁ SỰ KIỆN THÀNH CÔNG",
};

const orderError = {
  ERR_1: "BẠN ĐÃ ĐĂNG KÝ THAM GIA SỰ KIỆN NÀY RỒI!",
  ERR_2: "SỰ KIỆN ĐÃ ĐẠT GIỚI HẠN SỐ NGƯỜI ĐĂNG KÝ THAM GIA!",
  ERR_3: "KHÔNG TÌM THẤY DANH SÁCH NGƯỜI ĐĂNG KÝ THAM GIA SỰ KIỆN!",
  ERR_4: "KHÔNG TÌM THẤY SỰ KIỆN",
  ERR_5: "CẬP NHẬT THÔNG TIN DANH SÁCH ĐĂNG KÝ SỰ KIỆN THẤT BẠI!",
  ERR_6: "CHỈ CÓ NGƯỜI TỔ CHỨC MỚI CÓ QUYỀN CẬP NHẬT THÔNG TIN NÀY!",
  ERR_7: "BẠN KHÔNG PHẢI NGƯỜI TỔ CHỨC SỰ KIỆN",
};

const orderSucc = {
  SUCC_1: "ĐĂNG KÝ THAM GIA SỰ KIỆN THÀNH CÔNG!",
  SUCC_2: "LẤY THÀNH CÔNG DANH SÁCH NGƯỜI ĐĂNG KÝ THAM GIA SỰ KIỆN!",
  SUCC_3: "CẬP NHẬT THÔNG TIN DANH SÁCH ĐĂNG KÝ SỰ KIỆN THÀNH CÔNG!",
};

const userSucc = {
  SUC_1: "Update successfully",
  SUC_2: "Get Successfully",
};

const commentError = {
  ERR_1: "TẠO COMMENT THẤT BẠI!",
  ERR_2: "KHÔNG TÌM THẤY COMMENT!",
  ERR_3: "CHỈ NGƯỜI ĐĂNG MỚI CÓ QUYỀN CHỈNH SỬA COMMENT NÀY!",
  ERR_4: "CHỈ NGƯỜI ĐĂNG MỚI CÓ QUYỀN XOÁ COMMENT NÀY!",
};

const commentSucc = {
  SUC_1: "TẠO COMMENT THÀNH CÔNG!",
  SUC_2: "LẤY DỮ LIỆU COMMENT THÀNH CÔNG!",
  SUC_3: "CHỈNH SỬA COMMENT THÀNH CÔNG!",
  SUC_4: "XOÁ COMMENT THÀNH CÔNG!",
};

const userError = {
  ERR_1: "EMAIL NÀY CHƯA ĐĂNG KÍ TÀI KHOẢN NÀO",
  ERR_2: "INVALID LINK",
};
// const userSucc = {
//   SUC_1: "",
// };
const notifySucc = {
  SUC_1: "GET DANH DANH SÁCH THÔNG BÁO THÀNH CÔNG",
  SUC_2: "CẬP NHẬT THÔNG BÁO THÀNH CÔNG",
};
const notifyErr = {
  ERR_1: "CẬP NHẬT THÔNG BÁO THẤT BẠI",
};
module.exports = {
  eventError,
  notifySucc,
  eventSucc,
  orderError,
  orderSucc,
  userSucc,
  commentError,
  commentSucc,
  userError,
  userSucc,
  notifyErr,
};
