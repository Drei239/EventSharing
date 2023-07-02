import UseCallApi from "../../hooks/useCallApi";

const getAllNotify = async () => {
  const notify = UseCallApi({
    url: "/notify/get-all",
  });
  return notify;
};
const markNotifyById = async (id) => {
  const notify = UseCallApi({
    url: `/notify/mark-read/${id}`,
    method: "PUT",
  });
  return notify;
};
const markAllNotify = async () => {
  const notify = UseCallApi({
    url: `/notify/mark-all`,
    method: "PUT",
  });
  return notify;
};
const notifyService = {
  getAllNotify,
  markAllNotify,
  markNotifyById,
};
export default notifyService;
