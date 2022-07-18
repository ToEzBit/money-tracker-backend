const { User } = require("../models");

module.exports = async (username, password, confirmPassword) => {
  const errorObj = {};
  if (!username || !password) {
    errorObj.message = "username or password is require";
    errorObj.statusCode = 400;
    return errorObj;
  }
  if (password !== confirmPassword) {
    errorObj.message = "password and confirm password is not match";
    errorObj.statusCode = 400;
    return errorObj;
  }
  if (password.length < 6) {
    errorObj.message = "password must be at least 6 characters";
    errorObj.statusCode = 400;
    return errorObj;
  }
  const existUsername = await User.findOne({
    where: { username: username },
  });
  if (existUsername) {
    errorObj.message = "username is already exist";
    errorObj.statusCode = 400;
    return errorObj;
  }
};
