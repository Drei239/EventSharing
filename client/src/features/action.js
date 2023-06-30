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
