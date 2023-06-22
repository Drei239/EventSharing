const Joi = require("joi");

const registerValidate = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  const schemaGoogle = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    avatar: Joi.string().required(),
  });
  if (data.password) {
    const { error } = schema.validate(data);
    if (error) return res.status(400).send(error.details[0].message);
    return next();
  } else {
    const { error } = schemaGoogle.validate(data);
    if (error) return res.status(400).send(error.details[0].message);
    return next();
  }
};

const updateUserValidate = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object({
    name: Joi.string(),
    avatar: Joi.string(),
    email: Joi.string().email(),
    oldPassword: Joi.string().min(6),
    newPassword: Joi.string().min(6),
    phone: Joi.number(),
    birthDay: Joi.date(),
    description: Joi.string(),
  });
  const { error } = schema.validate(data);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

const loginValidate = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(24).required(),
  });
  const { error } = schema.validate(data);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

const refreshTokenBodyValidation = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
  });
  const { error } = schema.validate(data);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

module.exports = {
  registerValidate,
  loginValidate,
  updateUserValidate,
  refreshTokenBodyValidation,
};
