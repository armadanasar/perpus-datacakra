const {
  models: { "book-lending": BookLending },
  mongoose: {
    Types: { ObjectId },
  },
} = require("../models");

exports.getAll = async (params) => {
  try {
    const { limit, skip, userId } = params;

    const query = {};

    if (userId) {
      query.lender_user = ObjectId.createFromHexString(userId);
    }

    const [lendings, total] = await Promise.all([
      BookLending.find(query)
        .sort({ updated_at: "desc" })
        .limit(Number(limit))
        .skip(Number(limit) * Number(skip)),
      BookLending.count(query),
    ]);

    return { total, lendings };
  } catch (err) {
    throw err;
  }
};

exports.getOneById = async (lendingId) => {
  try {
    const bookLending = await BookLending.findOne({
      _id: ObjectId.createFromHexString(lendingId),
    });

    if (!bookLending) throw new Error("no such lending");

    return bookLending;
  } catch (err) {
    throw err;
  }
};

exports.getOneByQuery = async (query) => {
  try {
    console.log("hasil", query);

    const bookLending = await BookLending.findOne(query);

    if (!bookLending) throw new Error("no such lending");

    return bookLending;
  } catch (err) {
    throw err;
  }
};

exports.getLendingStatus = async (query) => {
  try {
    const bookLending = await BookLending.aggregate([
      { $match: { ...query } },
      {
        $addFields: {
          overdue: {
            $cond: {
              if: { $gte: [new Date(), "$expected_return_date"] },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);

    if (!bookLending) throw new Error("no such lending");

    return bookLending;
  } catch (err) {
    throw err;
  }
};

exports.returnLending = async (lendingId) => {
  try {
    const lending = await exports.getOneById(lendingId);

    if (lending.returned)
      throw new Error("cannot return lend already returned book");

    const updatedLending = await exports.updateById(lendingId, {
      returned: true,
      returned_at: Date.now(),
    });

    if (!updatedLending) throw new Error("cannot update book");

    return updatedLending;
  } catch (err) {
    throw err;
  }
};
exports.updateById = async (lendingId, data) => {
  try {
    const updatedLending = await BookLending.findByIdAndUpdate(lendingId, data);

    if (!updatedLending) throw new Error("cannot update book");

    return updatedLending;
  } catch (err) {
    throw err;
  }
};

exports.createLending = async (bookLendingInput) => {
  try {
    const newBookLending = await new BookLending(bookLendingInput).save();

    if (!newBookLending) throw new Error("cannot save book lending");

    return newBookLending;
  } catch (err) {
    throw err;
  }
};
