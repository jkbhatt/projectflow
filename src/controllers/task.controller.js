import { Task } from "../models/task.model.js";

// Get all tasks for a project
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Tasks fetched",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      project: req.params.projectId,
      assignedTo: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created",
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status: req.body.status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated",
      data: task,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};