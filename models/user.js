const mongoose = require("mongoose");

function omitV(doc, obj) {
  delete obj.__v;
  return obj;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: omitV,
    },
  }
);

module.exports = mongoose.model("user", userSchema);
