const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.post("/", transactionController.create);
router.patch("/:transactionId", transactionController.update);
router.delete("/:transactionId", transactionController.delete);
router.get("/", transactionController.getAll);
router.get("/date", transactionController.getByDate);
router.get("/:transactionId", transactionController.getOne);

module.exports = router;
