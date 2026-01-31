const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const { requireUniversityLocked } = require("../middleware/stageGuard");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const { universityId } = req.query;
    const filter = { userId: req.userId };

    if (universityId) {
      filter.universityId = universityId;
    }

    const tasks = await Task.find(filter).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, taskType, dueDate, universityId, priority } =
      req.body;

    const task = new Task({
      userId: req.userId,
      universityId,
      title,
      description,
      taskType,
      dueDate,
      priority,
      generatedByAI: false,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { completed, title, description, priority } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (completed !== undefined) task.completed = completed;
    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
