import axios from 'axios';
import { base_url } from '../../utils/base_url';
import dayjs from 'dayjs';
import UseCallApi from '../../hooks/useCallApi';
const getAllEvent = async (search) => {
  const data = await UseCallApi({
    method: 'GET',
    url: `/events/getFilter?${search ? search : ''}`,
  });
  return data;
};

const getEventById = async (eventId) => {
  const response = await axios.get(
    `http://localhost:3002/events/get/${eventId}`
  );
  return response.data;

  // return response;
};
const updateEvent = async ({}) => {
  const data = await UseCallApi({
    method: 'PUT',
    url: `/events/update`,
  });
  return data;
};
const getHighlightEvent = async () => {
  const data = await UseCallApi({
    method: 'GET',
    url: `/events/highlight`,
  });

  return data;
};
const getNewEvent = async (page) => {
  const data = await UseCallApi({
    method: 'GET',
    url: `/events/getFilter?sort=timeBegin&timeEndSignup[gte]=${dayjs().format(
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
    )}&page=${page ? page : 1}&limit=4`,
  });

  return data;
};
const getRegisteredEvent = async () => {
  const data = await UseCallApi({
    method: 'GET',
    url: '/events/registered-event',
  });
  return data;
};
const getJoinedEvent = async () => {
  const data = await UseCallApi({
    url: '/events/joined-event',
  });
  return data;
};
const getAllEventofUser = async (id, status, keyword) => {
  const data = await UseCallApi({
    url: `/events/user/${id}?status=${status}&keyword=${keyword}`,
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
};
export default eventService;
