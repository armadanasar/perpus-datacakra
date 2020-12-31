const bookLendingController = require("../../controllers/book-lending");
const { reqUserFromToken } = require("../../libs/jwt");

module.exports = ({ Router }) =>
  new Router()
    .use("*", reqUserFromToken)
    .get("/all", bookLendingController.getAllLendings)
    .get("/status/:lendingId", bookLendingController.getLendingInfo)
    .post("/lend", bookLendingController.lendBook)
    .post("/return/:lendingId", bookLendingController.returnBook);
