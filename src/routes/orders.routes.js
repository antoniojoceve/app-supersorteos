const express = require("express");
const router = express.Router();
const { getAllOrders } = require("../controllers/orders.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

router.get("/orders", auth, isAdmin, getAllOrders);
router.post("/orders", auth, createOrder);


module.exports = router;
