const {
  models: { user: User },
  mongoose: {
    Types: { ObjectId },
  },
} = require("../models");

const { jwtSign } = require("../libs/jwt");

exports.createUser = async (createUserInput) => {
  try {
    const newUser = await new User(createUserInput).save();

    const { _id, email, role } = newUser;
    const token = jwtSign(newUser);

    return { _id, email, role, token };
  } catch (err) {
    throw err;
  }
};

exports.login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error("user not found");

    if (user.comparePassword(password)) {
      return {
        name: user.name,
        email: user.email,
        token: jwtSign(user),
      };
    } else {
      throw new Error("email or password wrong");
    }
  } catch (err) {
    throw err;
  }
};

exports.getOneById = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) throw new Error("no such user");

    return user;
  } catch (err) {
    throw err;
  }
};

exports.getOne = async (query) => {
  try {
    const user = await User.findOne(query).lean();

    return user;
  } catch (err) {
    throw err;
  }
};

exports.verifyUser = async (userId) => {
  const user = await exports.getOne({
    _id: ObjectId.createFromHexString(userId),
    role: "admin",
  });

  return user;
};
