const booksController = require("../../controllers/books");
const { reqUserFromToken } = require("../../libs/jwt");

module.exports = ({ Router }) =>
  new Router()
    .use("*", reqUserFromToken)
    .get("/all", booksController.getAllBooks)
    .get("/:bookId", booksController.getBookById)
    .post("/new", booksController.createBook)
    .put("/:bookId", booksController.updateBook)
    .delete("/:bookId", booksController.deleteBook);
