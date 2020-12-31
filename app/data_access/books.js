const mongoose = require("mongoose");
const {
  models: { book: Book },
} = require("../models");
const {
  Types: { ObjectId },
} = mongoose;

exports.getAll = async (params) => {
  try {
    const { limit, skip, q } = params;

    const query = {};

    if (q) {
      query.title = {
        $regex: new RegExp(q, "gi"),
        $ne: null,
      };
    }

    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ updated_at: "desc" })
        .limit(Number(limit))
        .skip(Number(limit) * Number(skip)),
      Book.count(query),
    ]);

    return { total, books };
  } catch (err) {
    throw err;
  }
};

exports.getOneById = async ({ bookId }) => {
  try {
    const book = await Book.findOne({
      _id: ObjectId.createFromHexString(bookId),
    });

    if (!book) throw new Error("no such book");

    return book;
  } catch (err) {
    throw err;
  }
};

exports.createBook = async (bookInput) => {
  try {
    const newBook = await new Book(bookInput).save();

    if (!newBook) throw new Error("cannot save book");

    return newBook;
  } catch (err) {
    throw err;
  }
};

exports.updateBook = async (bookId, bookUpdateInput) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: bookUpdateInput },
      { new: true }
    );

    return updatedBook;
  } catch (err) {
    throw err;
  }
};

exports.deleteBook = async (bookId) => {
  try {
    return await Book.delete({ _id: bookId });
  } catch (err) {
    throw err;
  }
};
