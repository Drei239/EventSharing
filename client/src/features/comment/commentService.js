import UseCallApi from "../../hooks/useCallApi";
const createComment = async (eventId, title, comment) => {
  const newComment = await UseCallApi({
    url: `/comments/create/event/${eventId}`,
    data: { title, comment },
    method: "POST",
  });
  return newComment;
};
const getCommentByEventId = async (eventId) => {
  const comments = await UseCallApi({
    url: `/comments/event/${eventId}`,
    method: "GET",
  });
  return comments;
};
const updateComment = async (id, title, comment) => {
  const updateComment = await UseCallApi({
    url: `/comments/update/${id}`,
    data: { title, comment },
    method: "PUT",
  });
  return updateComment;
};
const replyComment = async (id, title, comment) => {
  const res = await UseCallApi({
    url: `/comments/update/${id}/createReply`,
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
const likeOrUnLikeComment = async (commentId, replyId) => {
  const res = await UseCallApi({
    url: `/comments/update/${commentId}/like`,
    method: "PUT",
    data: { replyId },
  });
  return res;
};
const deleteReplyComment = async (commentId, replyId) => {
  const res = await UseCallApi({
    url: `/comments/update/${commentId}/deleteReply`,
    method: "DELETE",
    data: { replyId },
  });
  return res;
};
const updateReplyComment = async (commentId, replyId, title, comment) => {
  const res = await UseCallApi({
    url: `comments/update/${commentId}/updateReply`,
    method: "PUT",
    data: { replyId, title, comment },
  });
  return res;
};
const commentService = {
  createComment,
  getCommentByEventId,
  updateComment,
  replyComment,
  deleteComment,
  updateReplyComment,
  deleteReplyComment,
  likeOrUnLikeComment,
};
export default commentService;
