const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const $NAME = "BookLending";
const $SCHEMA = new Schema(
  {
    book_id: { type: ObjectId, ref: "Book" },
    lender_user: { type: ObjectId, ref: "User" },
    lending_date: { type: Date, default: Date.now, required: true },
    expected_return_date: { type: Date, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

$SCHEMA.plugin(require("mongoose-deep-populate")(require("mongoose")));
$SCHEMA.plugin(require("mongoose-delete"), {
  overrideMethods: "all",
});

module.exports = require("mongoose").model($NAME, $SCHEMA);
