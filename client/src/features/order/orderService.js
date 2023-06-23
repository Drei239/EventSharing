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
const orderService = {
  getOrderbyId,
};
export default orderService;
