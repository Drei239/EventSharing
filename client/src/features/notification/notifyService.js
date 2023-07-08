import UseCallApi from "../../hooks/useCallApi";

const getAllNotify = async (page, notifyTypeRead) => {
  const notify = UseCallApi({
    url: `/notify/get-all?page=${page}&notifyTypeRead=${notifyTypeRead}`,
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
const confirmNewNotify = async () => {
  const notify = UseCallApi({
    url: `/notify/confirm-new`,
    method: "PUT",
  });
  return notify;
};
const notifyService = {
  getAllNotify,
  markAllNotify,
  markNotifyById,
  confirmNewNotify,
};
export default notifyService;
