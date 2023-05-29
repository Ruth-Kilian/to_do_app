const Task = require("../models/taskSchema");

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    // retrieves all tasks accociated with the authenticated user
    const tasks = await Task.find({ user: req.user._id });
    // queries the model and returns an array of the task objects
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a task
exports.createTask = async (req, res) => {
  try {
    // task title must be in the body
    const { title } = req.body;

    // creates a new instance of the model with the title and authenticated user's ID
    const task = new Task({
      title,
      user: req.user._id,
    });

    // saved to database
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    // task ID is specified in the request parameters
    const { id } = req.params;
    const { title, completed } = req.body;

    // finds the task and edits it to the new title
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    // task ID (id) is specified in the request parameters
    const { id } = req.params;

    // removes by id
    const deletedTask = await Task.findByIdAndRemove(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Toggle a task to true of false
exports.toggleTask = async (req, res) => {
  try {
    // task ID (id) is specified in the request parameters
    const { id } = req.params;
    const { completed } = req.body;

    // finds by id and toggles the false to true and vice versa
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed }, // Only update the 'completed' field not the title
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
