const router = require("express").Router();
const { createRaffle, listRaffles } = require("../controllers/raffles.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

router.post("/", auth, isAdmin, createRaffle); // solo admin
router.get("/", listRaffles); // público

module.exports = router;
