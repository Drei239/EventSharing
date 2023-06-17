import axios from "axios";
import { base_url } from "../../utils/base_url";
import dayjs from "dayjs";
import UseCallApi from "../../hooks/useCallApi";
const getAllEvent = async (search) => {
  const data = await UseCallApi({
    method: "GET",
    url: `/events/getFilter?${search ? search : ""}`,
  });
  return data;
};

const getEventById = async (eventId) => {
  const response = await axios.get(
    `http://localhost:3002/events/get/${eventId}`
  )
  return response.data;

  // return response;
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
    )}&page=${page ? page : 1}&limit=4`,
  });

  return data;
};
const eventService = {
  getAllEvent,
  getHighlightEvent,
  getNewEvent,
  getEventById,
};
export default eventService;