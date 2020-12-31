const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const {
  Types: { ObjectId },
} = require("mongoose");

const {
  createBook,
  deleteBook,
  updateBook,
  getAll,
  getOneById,
} = require("../data_access/books");
const UserDAOS = require("../data_access/users");
const { validateBySchema } = require("../utils/validator");

const createBookBodySchema = Joi.object().keys({
  isbn: Joi.string().required(),
  title: Joi.string().required(),
  author: Joi.string(),
  publisher: Joi.string(),
  pages: Joi.number(),
  description: Joi.string(),
});

const updateBookBodySchema = Joi.object().keys({
  isbn: Joi.string(),
  title: Joi.string(),
  author: Joi.string(),
  publisher: Joi.string(),
  pages: Joi.number(),
  description: Joi.string(),
});

const bookParamsSchema = Joi.object().keys({
  bookId: Joi.objectId().required(),
});

const getAllBooksParamsSchema = Joi.object().keys({
  limit: Joi.number().default(10),
  skip: Joi.number().default(0),
  q: Joi.string().trim().allow(""),
});

exports.createBook = async (req, res, next) => {
  try {
    const user = await UserDAOS.verifyUser(req.user._id);
    if (!user) throw new Error("you need to be admin to do this!");

    const body = await validateBySchema(req.body, createBookBodySchema);
    body.user = ObjectId(req.user._id);

    const book = await createBook(body);

    return res.json(book);
  } catch (err) {
    return next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const user = await UserDAOS.verifyUser(req.user._id);
    if (!user) throw new Error("you need to be admin to do this!");

    const { bookId } = await validateBySchema(req.params, bookParamsSchema);
    const body = await validateBySchema(req.body, updateBookBodySchema);

    const updatedBook = await updateBook(bookId, body);

    return res.json(updatedBook);
  } catch (err) {
    return next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const user = await UserDAOS.verifyUser(req.user._id);
    if (!user) throw new Error("you need to be admin to do this!");

    const { bookId } = await validateBySchema(req.params, bookParamsSchema);

    const deletionResult = await deleteBook(bookId);

    return res.json(deletionResult);
  } catch (err) {
    return next(err);
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const params = await validateBySchema(req.query, getAllBooksParamsSchema);

    const queryResult = await getAll(params);

    return res.json(queryResult);
  } catch (err) {
    return next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const { bookId } = await validateBySchema(req.params, bookParamsSchema);

    const book = await getOneById(bookId);

    return res.json(book);
  } catch (err) {
    return next(err);
  }
};
