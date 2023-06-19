import UseCallApi from "../../hooks/useCallApi";
const updateUser = async ({ id, data }) => {
  console.log(data);
  const res = await UseCallApi({
    method: "PUT",
    data: data,
    url: `/users/update/${id}`,
  });
  return res;
};
const getAllUsers = async () => {
  const data = await UseCallApi({
    method: "GET",
    url: `/users/all`,
  });
  return data;
};
const userService = {
  updateUser,
  getAllUsers,
};
export default userService;
