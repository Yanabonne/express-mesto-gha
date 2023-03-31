const { isURL } = require('validator');
const mongoose = require('mongoose');
require('mongoose-type-url');

function omitV(doc, obj) {
  delete obj.__v;
  return obj;
}

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: isURL,
        isAsync: false,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      ],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform: omitV,
    },
  },
);

module.exports = mongoose.model('card', cardSchema);
