import UseCallApi from "../../hooks/useCallApi";

const getAllNotify = async () => {
  const notify = UseCallApi({
    url: "/notify/get-all",
  });
  return notify;
};
const notifyService = {
  getAllNotify,
};
export default notifyService;
