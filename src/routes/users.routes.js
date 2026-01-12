const express = require("express");
const router = express.Router();

const {
  createUser,
  changePassword
} = require("../controllers/users.controller");

router.post("/users", createUser);
router.post("/change-password", changePassword);

module.exports = router;
