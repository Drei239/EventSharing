import UseCallApi from "../../hooks/useCallApi";

const createNewOrder = async (eventId) => {
  const newOrder = await UseCallApi({
    method: "POST",
    url: "/orders/create",
    data: { event: eventId.toString() },
  });
  return newOrder;
};
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
const sendEmail = async (data) => {
  const orders = await UseCallApi({
    url: `/orders/send-email`,
    method: "POST",
    data: data,
  });
  return orders;
};
const sendEmailAllOrder = async (data) => {
  const orders = await UseCallApi({
    url: `/orders/send-allOrder`,
    method: "POST",
    data: data,
  });
  return orders;
};
const orderService = {
  getOrderbyId,
  updateOneOrder,
  updateRequest,
  sendEmail,
  sendEmailAllOrder,
  createNewOrder,
};
export default orderService;
