const Joi = require("joi");
const { createUser, getOneById, login } = require("../data_access/users");

const userBodySchema = Joi.object().keys({
  full_name: Joi.string().optional(),
  role: Joi.string().optional().valid("public", "admin"),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

exports.registerUser = async (req, res, next) => {
  try {
    const body = await validateBySchema(req.body, userBodySchema);

    const newUser = await createUser(body);

    return res.json(newUser);
  } catch (err) {
    return next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const body = await validateBySchema(req.body, userBodySchema);
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
