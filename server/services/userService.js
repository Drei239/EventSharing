const User = require("../models/userModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const resMes = require("../validators/responsiveMessages");
const tokenModel = require("../models/tokenModel");
const fs = require("fs");
const ejs = require("ejs");

const emailTemplate = fs.readFileSync("./views/forgotPassword.ejs", "utf-8");
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
//
const forgotPassword = async (email) => {
  const checkEmail = await userModel.findOne({ email: email });
  if (!checkEmail) {
    throw Error(resMes.userError.ERR_1);
  }
  let token = await tokenModel.findOne({ userId: checkEmail?._id });
  if (!token) {
    token = await tokenModel.create({
      userId: checkEmail._id,
      token: crypto.randomBytes(20).toString("hex"),
    });
  } else {
    token.token = crypto.randomBytes(20).toString("hex");
    token.createdAt = new Date();
    await token.save();
  }
  const link = `${process.env.FRONTEND_HOST}/newPass/${checkEmail._id}/${token.token}`;
  const renderedTemplate = await ejs.render(emailTemplate, {
    link: link,
  });
  await sendEmail({
    to: email,
    content: renderedTemplate,
    subject: "Yêu cầu thay đổi mật khẩu",
  });
  return token;
};
const resetPassword = async (userId, token, newPassword) => {
  const userRequest = await userModel.findById(userId);
  if (!userRequest) {
    throw Error(resMes.userError.ERR_2);
  }
  const checkToken = await tokenModel.findOne({
    userId: userId,
    token: token.toString(),
  });
  if (!checkToken) {
    throw Error(resMes.userError.ERR_2);
  }
  userRequest.password = newPassword;
  await userRequest.save();
  await tokenModel.findByIdAndDelete(checkToken._id);
  return userRequest;
};
module.exports = {
  updateUserService,
  getPersonalUser,
  ratingUser,
  highlightUser,
  forgotPassword,
  resetPassword,
};
