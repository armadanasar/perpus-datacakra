const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = mongoose;

const {
  getAll,
  returnLending,
  createLending,
  getLendingStatus,
} = require("../data_access/book-lending");
const { verifyUser } = require("../data_access/users");
const { validateBySchema } = require("../utils/validator");

const bookLendingParamsSchema = Joi.object().keys({
  lendingId: Joi.objectId().required(),
});

const bookLendingBodySchema = Joi.object().keys({
  bookId: Joi.objectId().required(),
  expected_return_date: Joi.date().min("now").required(),
});

const getAllLendingsParamsSchema = Joi.object().keys({
  limit: Joi.number().default(10),
  skip: Joi.number().default(0),
  userId: Joi.objectId(),
});

exports.getLendingInfo = async (req, res, next) => {
  try {
    const user = await verifyUser(req.user._id);
    const { lendingId } = await validateBySchema(
      req.params,
      bookLendingParamsSchema
    );

    const query = {
      _id: ObjectId.createFromHexString(lendingId),
    };

    if (!user) query.lender_user = ObjectId.createFromHexString(req.user._id);

    const lending = await getLendingStatus(query);

    if (!lending || lending.length < 1)
      return res.status(404).send("lending not found");

    return res.json(lending);
  } catch (err) {
    return next(err);
  }
};

exports.lendBook = async (req, res, next) => {
  try {
    const user = await verifyUser(req.user._id);
    if (user) throw new Error("admins cannot lend books!");

    const { bookId, expected_return_date } = await validateBySchema(
      req.body,
      bookLendingBodySchema
    );

    const newLendingData = {
      book_id: ObjectId.createFromHexString(bookId),
      lender_user: ObjectId.createFromHexString(req.user._id),
      expected_return_date: expected_return_date,
    };

    const newLending = await createLending(newLendingData);

    return res.json(newLending);
  } catch (err) {
    return next(err);
  }
};

exports.returnBook = async (req, res, next) => {
  try {
    const user = await verifyUser(req.user._id);
    if (!user) throw new Error("public cannot return books!");

    const { lendingId } = await validateBySchema(
      req.params,
      bookLendingParamsSchema
    );

    await returnLending(lendingId);

    const query = {
      _id: ObjectId.createFromHexString(lendingId),
    };

    const lending = await getLendingStatus(query);

    return res.json(lending);
  } catch (err) {
    return next(err);
  }
};

exports.getAllLendings = async (req, res, next) => {
  try {
    const user = await verifyUser(req.user._id);
    const params = await validateBySchema(
      req.query,
      getAllLendingsParamsSchema
    );

    if (!user) params.userId = req.user._id;

    const { total, lendings } = await getAll(params);

    return res.json({ total, lendings });
  } catch (err) {
    return next(err);
  }
};
