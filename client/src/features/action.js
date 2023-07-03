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
