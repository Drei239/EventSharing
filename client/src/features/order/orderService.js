import UseCallApi from "../../hooks/useCallApi";

const getOrderbyId = async ({ id, keyword, sort, page, limit, status }) => {
  const orders = await UseCallApi({
    url: `/orders/event/${id}?keyword=${keyword ? keyword : ""}&sort=${
      sort ? sort : ""
    }&page=${page ? page : 1}&limit=${limit ? limit : 10}&status=${
      status ? status : ""
    }`,
  });
  return orders;
};
const updateOneOrder = async (id, status) => {
  const orders = await UseCallApi({
    url: `orders/update/${id}?status=${status}`,
    method: "PUT",
  });
  return orders;
};
const updateRequest = async (id, data) => {
  const orders = await UseCallApi({
    url: `orders/event/${id}/updateRequest`,
    method: "PUT",
    data: data,
  });
  return orders;
};
const orderService = {
  getOrderbyId,
  updateOneOrder,
  updateRequest,
};
export default orderService;
