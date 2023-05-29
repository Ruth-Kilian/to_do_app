const express = require("express");
const router = express.Router();

// middleware
const {
  authenticateUserMiddleware,
  taskLengthMiddleware,
  jsonContentTypeMiddleware,
} = require("../middleware/middleware");

// controllers
const taskController = require("../controllers/taskController");

// GET request to get all tasks
router.get("/", authenticateUserMiddleware, taskController.getAllTasks);

// POST request to add a task
router.post(
  "/",
  authenticateUserMiddleware,
  taskLengthMiddleware,
  jsonContentTypeMiddleware,
  taskController.createTask
);

// PUT request to edit a task
router.put("/:id", taskController.updateTask);

// DELETE request to delete a task
router.delete("/:id", taskController.deleteTask);

// PUT request to mark a task as complete
router.put("/:id/toggle", taskController.toggleTask);

module.exports = router;
