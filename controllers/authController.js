const bcrypt = require("bcryptjs");

const createError = require("../utils/createError");
const validateRegister = require("../utils/validateRegister");
const validateLogin = require("../utils/validateLogin");
const genToken = require("../utils/genToken");

const { User } = require("../models");

exports.register = async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;

    const validated = await validateRegister(
      username,
      password,
      confirmPassword
    );

    if (validated) {
      createError(validated.message, validated.statusCode);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });

    const token = genToken({ id: createdUser.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const validated = await validateLogin(username, password);

    if (validated) {
      createError(validated.message, validated.statusCode);
    }

    const user = await User.findOne({ where: { username } });

    const token = genToken({ id: user.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
