const { isEmail } = require('validator');
const mongoose = require('mongoose');
require('mongoose-type-url');

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
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: mongoose.SchemaTypes.Url,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: isEmail,
        isAsync: false,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    toJSON: {
      transform: omitV,
    },
  },
);

module.exports = mongoose.model('user', userSchema);
