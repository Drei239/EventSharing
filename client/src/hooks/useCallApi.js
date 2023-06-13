import axios from "axios";

const UseCallApi = async ({ method, url, data }) => {
  try {
    const response = await axios({
      method: method || "GET",
      url: url,
      data: data,

      //   withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error("Có lỗi xảy ra trong quá trình gọi API");
    }
    return response.data;
  } catch (err) {
    if (err.response) {
      const { status, message } = err.response;
      console.error(`Mã trạng thái lỗi:${status}`);
      console.error("Thông điệp lỗi", message);
    } else {
      console.error("Lỗi gọi API:", err.message);
    }
  }
};
export default UseCallApi;
