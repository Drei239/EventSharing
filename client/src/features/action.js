// action.js
export const newConnetion = (userId) => ({
  type: "NEW_CONNECTION",
  event: "new_connection",
  data: userId,
  emit: true,
});
export const sendNotifyNewOrder = (order) => ({
  type: "NEW_ORDER",
  event: "new_order",
  data: order,
  emit: true,
});
export const sendNotifyNewComment = (comment) => ({
  type: "NEW_COMMENT",
  event: "new_comment",
  data: comment,
  emit: true,
});
export const sendNotifyReplyComment = (comment) => ({
  type: "REPLY_COMMENT",
  event: "reply_comment",
  data: comment,
  emit: true,
});
export const disconnect = (userId) => ({
  type: "DISCONNECT",
  event: "logout",
  data: userId,
  emit: true,
});
export const newConnectEvent = (eventId) => ({
  type: "NEW_CONNECT_EVENT",
  event: "connect_event",
  data: eventId,
  emit: true,
});
export const sendCommentToUserConnect = (comment) => ({
  type: "NEW_COMMENT2",
  event: "new_comment2",
  data: comment,
  emit: true,
});
export const replyCommentShowAll = (comment) => ({
  type: "REPLY_COMMENT_SHOW_ALL",
  event: "reply_comment_show_all",
  data: comment,
  emit: true,
});
