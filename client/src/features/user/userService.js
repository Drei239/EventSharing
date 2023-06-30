import UseCallApi from "../../hooks/useCallApi";
const updateUser = async ({ id, data }) => {
  const res = await UseCallApi({
    method: "PUT",
    data: data,
    url: `/users/update/${id}`,
  });
  return res;
};
const deleteUser = async (id, data) => {
  const res = await UseCallApi({
    method: "DELETE",
    data: data,
    url: `/users/delete/${id}`,
  });
};
const getHighlightUser = async () => {
  const data = await UseCallApi({
    url: "/users/highlight",
  });
  return data;
};
const forgotPasswordUser = async (email) => {
  const data = await UseCallApi({
    url: "/users/forgot-password",
    data: { email },
    method: "POST",
  });
  return data;
};
const resetPassword = async (userId, token, newPassword) => {
  const data = await UseCallApi({
    url: `/users/reset-password/${userId}/${token}`,
    data: { newPassword: newPassword },
    method: "PUT",
  });
  return data;
};
const userService = {
  updateUser,
  deleteUser,
  getHighlightUser,
  forgotPasswordUser,
  resetPassword,
};
export default userService;
