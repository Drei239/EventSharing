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
const userService = {
  updateUser,
};
export default userService;
