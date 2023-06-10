const Joi = require('joi');

const registerValidate = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(24).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    phone: Joi.number().required(),
    birthDay: Joi.date().required(),
  });
  const { error } = schema.validate(data);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};


const updateUserValidate = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6). max(24).required(),
    phone: Joi.number(),
    birthDay: Joi.date(),
    isAdmin: Joi.string().valid('user', 'admin').default('user'),
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
    refreshToken: Joi.string().required().label('Refresh Token'),
  });
  const { error } = schema.validate(data);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

module.exports = { registerValidate, loginValidate, updateUserValidate, refreshTokenBodyValidation };