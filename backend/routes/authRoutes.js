const express = require("express");
const router = express.Router();

// middleware
const {
  gmailUserMiddleware,
  authenticateUserMiddleware,
} = require("../middleware/middleware");

// controllers
const userController = require("../controllers/userController");

// POST request to register a new user
router.post("/register", gmailUserMiddleware, userController.register);

// POST request to login a user
router.post("/login", gmailUserMiddleware, userController.login);

router.put(
  "/change",
  authenticateUserMiddleware,
  userController.changePassword
);

module.exports = router;
