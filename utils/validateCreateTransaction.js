const validator = require("validator");
module.exports = (type, category, amount, date) => {
  const categoryInComeList = ["salary", "otherIncome"];
  const categoryExpenseList = [
    "food",
    "transport",
    "rental",
    "waterBill",
    "electricityBill",
    "phoneBill",
    "gasBill",
    "internetBill",
    "otherUtilityBill",
    "homeMaintenance",
    "vehicleMaintenance",
    "medicalCheckUp",
    "insurance",
    "education",
    "houseWare",
    "personalItem",
    "pet",
    "homeServices",
    "fitness",
    "investment",
    "funMoney",
    "otherExpense",
  ];
  const errorObj = {};
  if (!type) {
    errorObj.message = "Type is require";
    errorObj.status = 400;
    return errorObj;
  }
  if (type !== "income" && type !== "expense") {
    errorObj.message = "Type is invalid";
    errorObj.status = 400;
    return errorObj;
  }
  if (!category) {
    errorObj.message = "Category is required";
    errorObj.status = 400;
    return errorObj;
  }
  if (!amount) {
    errorObj.message = "Amount is required";
    errorObj.status = 400;
    return errorObj;
  }
  if (amount <= 0) {
    errorObj.message = "Amount must be greater than 0";
    errorObj.status = 400;
    return errorObj;
  }
  if (!date) {
    errorObj.message = "Date is required";
    errorObj.status = 400;
    return errorObj;
  }
  if (!validator.isDate(date)) {
    errorObj.message = "Date is invalid";
    errorObj.status = 400;
    return errorObj;
  }
  if (type === "income") {
    if (!categoryInComeList.includes(category)) {
      errorObj.message = "Category is invalid";
      errorObj.status = 400;
      return errorObj;
    }
  }
  if (type === "expense") {
    if (!categoryExpenseList.includes(category)) {
      errorObj.message = "Category is invalid";
      errorObj.status = 400;
      return errorObj;
    }
  }
};
