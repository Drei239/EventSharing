import axios from "axios";
import { base_url } from "../../utils/base_url";
import dayjs from "dayjs";
import queryString from "query-string";
const getAllEvent = async (search) => {
  const response = await axios.get(
    `http://localhost:3002/events/getFilter?${search ? search : ""}`
  );
  return response.data;
};
const getHighlightEvent = async () => {
  const response = await axios.get(`http://localhost:3002/events/highlight`);
  return response.data;
};
const getNewEvent = async (page) => {
  const response = await axios.get(
    `${base_url}/events/getFilter?sort=timeBegin&timeEndSignup[gte]=${dayjs().format(
      "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
    )}&page=${page ? page : 1}&limit=4`
  );
  return response.data;
};
const eventService = {
  getAllEvent,
  getHighlightEvent,
  getNewEvent,
};
export default eventService;
