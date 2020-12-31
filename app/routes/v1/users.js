const usersController = require("../../controllers/users");
const { reqUserFromToken } = require("../../libs/jwt");

module.exports = ({ Router }) =>
  new Router()
    .post("/register", usersController.registerUser)
    .post("/login", usersController.loginUser)
    .use("*", reqUserFromToken)
    .get("/profile", usersController.getCurrentUser);
