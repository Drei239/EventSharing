import axios from "axios";
import { base_url } from "../../utils/base_url";
const getAllEvent = async () => {
  const response = await axios.get(`http://localhost:3002/events/getFilter`);
  return response.data.data;
};
const eventService = {
  getAllEvent,
};
export default eventService;
