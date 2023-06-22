const User = require("../models/userModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

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
const ratingUser = async ({ id, comments, youId }) => {
  const { star, comment, image } = comments;
  const checkUser = await orderModel.find({ user: youId }).populate("event");
  if (checkUser.length === 0) {
    throw Error("Bạn không có quyền đánh giá");
  } else {
    const checkAuthor = await checkUser.filter(
      (item) => item.event.isCreator === id
    );
    if (!checkAuthor) {
      throw Error("Bạn không có quyền đánh giá");
    }

    const findUser = await userModel.findById(id);
    if (youId === id) {
      throw Error("Bạn không thể đánh giá chính bạn");
    }
    const user =
      findUser.userRating.length > 0 &&
      findUser.userRating.find(
        (rating) => rating?.postedBy == youId.toString()
      );
    if (user) {
      await userModel.updateOne(
        { _id: id, userRating: { $elemMatch: user } },
        {
          $set: {
            "userRating.$.star": star,
            "userRating.$.comment": comment,
            "userRating.$.time": Date.now(),
            "userRating.$.img": image || user.img,
          },
        },
        { new: true }
      );
    } else {
      await userModel.findByIdAndUpdate(id, {
        $push: { userRating: { star, comment, postedBy: youId } },
      });
    }
    const getUpdateRating = await userModel.findById(id);
    const ratingLength = getUpdateRating?.userRating?.length || 0;
    const sumRating =
      getUpdateRating?.userRating?.reduce((total, num) => {
        return total + num.star;
      }, 0) || 0;
    const updateRating2 = await userModel.findByIdAndUpdate(
      id,
      { totalRating: sumRating / ratingLength || 0 },
      { new: true }
    );
    return updateRating2;
  }
};
const highlightUser = async () => {
  const user = userModel.find().sort("-totalRating").limit(5);
  return user;
};
module.exports = {
  updateUserService,
  getPersonalUser,
  ratingUser,
  highlightUser,
};
