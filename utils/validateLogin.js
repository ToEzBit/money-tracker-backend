const bcrypt = require("bcryptjs");
const { User } = require("../models");

module.exports = async (username, password) => {
  const errorObj = {};
  if (!username || !password) {
    errorObj.message = "username or password is require";
    errorObj.statusCode = 400;
    return errorObj;
  }

  const user = await User.findOne({ where: { username } });

  if (!user) {
    errorObj.message = "username or password is invalid";
    errorObj.statusCode = 400;
    return errorObj;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    errorObj.message = "username or password is invalid";
    errorObj.statusCode = 400;
    return errorObj;
  }
};
