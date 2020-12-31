const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const $NAME = "Book";
const $SCHEMA = new Schema(
  {
    isbn: { type: String, required: true, unique: true },
    title: { type: String, sparse: true, required: true },
    author: String,
    publisher: String,
    pages: Number,
    description: String,
    user: { type: ObjectId, ref: "User" },
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
