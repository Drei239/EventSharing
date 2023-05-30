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
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    newPassword: Joi.string().min(6).max(24).optional(),
    phone: Joi.number().optional(),
    birthDay: Joi.date().optional(),
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

module.exports = { registerValidate, loginValidate, updateUserValidate };