const validateCreateTransaction = require("../utils/validateCreateTransaction");
const createError = require("../utils/createError");

const { User, Transaction } = require("../models/");

exports.create = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { type, category, amount, note, date } = req.body;

    const validated = validateCreateTransaction(type, category, amount, date);

    if (validated) {
      createError(validated.message, validated.statusCode);
    }

    const user = await User.findByPk(id);

    const createdTransaction = await Transaction.create({
      type,
      category,
      amount,
      note,
      date,
      userId: id,
    });

    switch (type) {
      case "income":
        user.totalIncome = +user.totalIncome + Number(amount);
        user.totalAmount = +user.totalAmount + Number(amount);
        break;
      case "expense":
        user.totalExpense = +user.totalExpense + Number(amount);
        user.totalAmount = +user.totalAmount - Number(amount);
        break;
    }

    await user.save();

    res.json({ createdTransaction });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { transactionId } = req.params;
    const { type, category, amount, note, date } = req.body;

    const validated = validateCreateTransaction(type, category, amount, date);

    if (validated) {
      createError(validated.message, validated.statusCode);
    }

    const user = await User.findByPk(id);

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      createError("Transaction not found", 404);
    }

    if (transaction.userId !== id) {
      createError("You are not allowed to update this transaction", 403);
    }

    switch (transaction.type) {
      case "income":
        user.totalIncome = +user.totalIncome - Number(transaction.amount);
        user.totalAmount = +user.totalAmount - Number(transaction.amount);
        break;
      case "expense":
        user.totalExpense = +user.totalExpense - Number(transaction.amount);
        user.totalAmount = +user.totalAmount + Number(transaction.amount);
    }

    switch (type) {
      case "income":
        user.totalIncome = +user.totalIncome + Number(amount);
        user.totalAmount = +user.totalAmount + Number(amount);
        break;
      case "expense":
        user.totalExpense = +user.totalExpense + Number(amount);
        user.totalAmount = +user.totalAmount - Number(amount);
        break;
    }

    await transaction.update({
      type,
      category,
      amount,
      note,
      date,
    });

    await user.save();

    res.json({ transaction });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { transactionId } = req.params;

    const user = await User.findByPk(id);

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      createError("Transaction not found", 404);
    }

    if (transaction.userId !== id) {
      createError("You are not allowed to update this transaction", 403);
    }

    switch (transaction.type) {
      case "income":
        user.totalIncome = +user.totalIncome - Number(transaction.amount);
        user.totalAmount = +user.totalAmount - Number(transaction.amount);
        break;
      case "expense":
        user.totalExpense = +user.totalExpense - Number(transaction.amount);
        user.totalAmount = +user.totalAmount + Number(transaction.amount);
    }

    await transaction.destroy();

    await user.save();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { id } = req.user;

    const transactions = await Transaction.findAll({
      where: { userId: id },
      order: [["date", "DESC"]],
      attributes: ["id", "type", "category", "amount", "date", "note"],
    });

    res.json({ transactions });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { transactionId } = req.params;

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      createError("Transaction not found", 404);
    }

    if (transaction.userId !== id) {
      createError("You are not allowed to view this transaction", 403);
    }

    res.json({ transaction });
  } catch (err) {
    next(err);
  }
};

exports.getByDate = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { date } = req.query;

    const transactions = await Transaction.findAll({
      where: [{ userId: id }, { date: date }],
    });

    res.json({ transactions });
  } catch (err) {
    next(err);
  }
};
