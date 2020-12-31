const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const $NAME = "User";
const $SCHEMA = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true,
      required: true,
    },
    full_name: { type: String },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["public", "admin"],
      default: "public",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

$SCHEMA.plugin(require("mongoose-delete"), {
  overrideMethods: "all",
});

$SCHEMA.pre("save", function presave(fun) {
  if (!this.isModified("password")) {
    fun();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      fun(err);
    }
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        fun(err);
      }
      this.password = hash;
      fun();
    });
  });
});

$SCHEMA.methods.comparePassword = function comparePassword(insertedPassword) {
  const { password } = this;

  return new Promise((resolve) => {
    bcrypt.compare(insertedPassword, password, (err, isMatch) => {
      if (err) {
        isMatch = false;
      }

      return resolve(isMatch);
    });
  });
};

$SCHEMA.set("toJSON", {
  transform: function (doc, ret, opt) {
    delete ret["password"];
    return ret;
  },
});

module.exports = require("mongoose").model($NAME, $SCHEMA);
