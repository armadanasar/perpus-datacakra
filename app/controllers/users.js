const Joi = require("joi");
const { createUser, getOneById, login } = require("../data_access/users");

const validateBody = async (body) => {
  try {
    const schema = Joi.object().keys({
      full_name: Joi.string().optional(),
      role: Joi.string().optional().valid("public", "admin"),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    const { value, error } = await schema.validate(body);

    if (error) throw error;

    return value;
  } catch (err) {
    throw err;
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const body = await validateBody(req.body);

    const newUser = await createUser(body);

    return res.json(newUser);
  } catch (err) {
    return next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const body = await validateBody(req.body);
    console.log("bodi login", body);
    const token = await login(body);

    return res.json(token);
  } catch (err) {
    return next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const { _id, email, role } = await getOneById(req.user._id);

    return res.json({ _id, email, role });
  } catch (err) {
    return next(err);
  }
};
