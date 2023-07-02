import { base_url } from "../../utils/base_url";
import UseCallApi from '../../hooks/useCallApi';

const getCommentByEventId = async (eventId) => {
	const data = await UseCallApi({
		method: 'GET',
		url: `/comments/create/event/${eventId}`,
	});
	return data;
};

const CommentService = {
	getCommentByEventId,
}

import UseCallApi from "../../hooks/useCallApi";

const createComment = async (eventId, title, comment) => {
  const newComment = await UseCallApi({
    url: `/comments/create/${eventId}`,
    data: { title, comment },
    method: "POST",
  });
  return newComment;
};
const getCommentByEventId = async (eventId) => {
  const comments = await UseCallApi({
    url: `/comments/event${id}`,
    method: "GET",
  });
  return comments;
};
const updateComment = async (id, title, comment) => {
  const updateComment = await UseCallApi({
    url: `/comments/${id}`,
    data: { title, comment },
    method: "PUT",
  });
  return updateComment;
};
const replyComment = async (id, title, comment) => {
  const res = await UseCallApi({
    url: `/comments/update/${id}/reply`,
    data: { title, comment },
    method: "PUT",
  });
  return res;
};
const deleteComment = async (id) => {
  const res = await UseCallApi({
    url: `/comments/delete/${id}`,
    method: "DELETE",
  });
  return res;
};
const commentService = {
  createComment,
  getCommentByEventId,
  updateComment,
  replyComment,
  deleteComment,
};
export default commentService;
