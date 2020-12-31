const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("Need to set JWT Secret!");
}

const jwtSign = ({ _id, email, role }) => {
  try {
    const token = jwt.sign({ _id, email, role }, JWT_SECRET, {
      expiresIn: "365d",
    });

    return token;
  } catch (err) {
    throw err.message;
  }
};

const jwtVerify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {});
  } catch (err) {
    throw err.message;
  }
};

const reqUserFromToken = (req, res, next) => {
  try {
    const token = req.headers.authorization || req.headers.Authorization;

    req.user = jwtVerify(token);

    return next();
  } catch (err) {
    const error = new Error(err);

    error.statusCode = 401;

    return next(error);
  }
};

module.exports = {
  jwtSign,
  jwtVerify,
  reqUserFromToken,
};
