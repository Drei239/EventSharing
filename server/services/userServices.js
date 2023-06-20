const userModel = require("../models/userModel");

const updateUserService = async (id, data) => {
  const newUser = await userModel
    .findByIdAndUpdate(
      id,
      {
        name: data?.name,
        gender: data?.gender,
        birthDay: data?.birthDay,
        description: data?.descripiton,
        avatar: data?.avatar,
        phone: data.phone,
      },
      { new: true }
    )
    .select("name gender birthDay description avatar phone email");
  return newUser;
};
const getPersonalUser = async (id) => {
  const user = await userModel
    .findById(id)
    .select("birthDay gender name description avatar phone email");
  return user;
};
module.exports = { updateUserService, getPersonalUser };