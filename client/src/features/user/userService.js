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
const userService = {
  updateUser,
  deleteUser,
};
export default userService;
