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
const userService = {
  updateUser,
  deleteUser,
  getHighlightUser,
};
export default userService;
