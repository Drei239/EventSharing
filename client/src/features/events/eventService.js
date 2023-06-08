import axios from "axios";
import { base_url } from "../../utils/base_url";
import queryString from "query-string";
const getAllEvent = async (search) => {
  const response = await axios.get(
    `http://localhost:3002/events/getFilter?${search ? search : ""}`
  );
  return response.data;
};
const eventService = {
  getAllEvent,
};
export default eventService;
