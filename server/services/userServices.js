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
const ratingUser = async ({ organizerId, comments, reviewerId }) => {
  const { star, comment, image } = comments;
  const checkUser = await orderModel
    .find({ user: reviewerId })
    .populate("event");
  if (checkUser.length === 0) {
    throw Error("Bạn không có quyền đánh giá");
  } else {
    const checkAuthor = await checkUser.find(
      (item) => item.event.isCreator === organizerId
    );
    if (!checkAuthor) {
      throw Error("Bạn không có quyền đánh giá");
    }

    const findUser = await userModel.findById(organizerId);
    if (reviewerId === organizerId) {
      throw Error("Bạn không thể đánh giá chính bạn");
    }
    const user =
      findUser.userRating.length > 0 &&
      findUser.userRating.find(
        (rating) => rating?.postedBy == reviewerId.toString()
      );
    if (user) {
      await userModel.updateOne(
        { _id: organizerId, userRating: { $elemMatch: user } },
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
      await userModel.findByIdAndUpdate(organizerId, {
        $push: { userRating: { star, comment, postedBy: reviewerId } },
      });
    }
    const getUpdateRating = await userModel.findById(organizerId);
    const ratingLength = getUpdateRating?.userRating?.length || 0;
    const sumRating =
      getUpdateRating?.userRating?.reduce((total, num) => {
        return total + num.star;
      }, 0) || 0;
    const updateRating2 = await userModel.findByIdAndUpdate(
      organizerId,
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