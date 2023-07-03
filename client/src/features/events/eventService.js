import dayjs from "dayjs";
import UseCallApi from "../../hooks/useCallApi";
const getAllEvent = async (search) => {
  console.log(search);
  const data = await UseCallApi({
    method: "GET",
    url: `/events/getFilter?${search ? search : ""}`,
  });
  return data;
};

const getEventById = async (eventId) => {
  const response = await UseCallApi({
    method: "GET",
    url: `/events/get/${eventId}`,
  });
  return response;
};

const updateEvent = async ({}) => {
  const data = await UseCallApi({
    method: "PUT",
    url: `/events/update`,
  });
  return data;
};
const getHighlightEvent = async () => {
  const data = await UseCallApi({
    method: "GET",
    url: `/events/highlight`,
  });

  return data;
};
const getNewEvent = async (page) => {
  const data = await UseCallApi({
    method: "GET",
    url: `/events/getFilter?sort=timeBegin&timeEndSignup[gte]=${dayjs().format(
      "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
    )}&page=${page ? page : 1}&limit=10`,
  });

  return data;
};
const getRegisteredEvent = async () => {
  const data = await UseCallApi({
    method: "GET",
    url: "/events/registered-event",
  });
  return data;
};
const getJoinedEvent = async () => {
  const data = await UseCallApi({
    url: "/events/joined-event",
  });
  return data;
};
const getAllEventofUser = async (id, status, keyword) => {
  const data = await UseCallApi({
    url: `/events/user/${id}?status=${status}&keyword=${keyword}`,
  });
  return data;
};
const removeEventDraft = async (eventId) => {
  const data = await UseCallApi({
    url: `/events/remove/${eventId}`,
    method: "DELETE",
  });
  return data;
};
const cancelEvent = async (eventId) => {
  const data = await UseCallApi({
    url: `/events/cancel/${eventId}`,
    method: "PUT",
  });
  return data;
};
const confirmCompletedEvent = async (eventId) => {
  const data = await UseCallApi({
    url: `/events/confirm-completed`,
    method: "PUT",
  });
  return data;
};
const eventService = {
  updateEvent,
  getAllEvent,
  getHighlightEvent,
  getNewEvent,
  getEventById,
  getRegisteredEvent,
  getJoinedEvent,
  getAllEventofUser,
  cancelEvent,
  removeEventDraft,
  confirmCompletedEvent,
};
export default eventService;
