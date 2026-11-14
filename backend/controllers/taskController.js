const Task = require('../models/Task');
const { LocalTask } = require('../utils/localDb');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = req.app.locals.useLocalDb
      ? await LocalTask.find(query)
      : await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, category, status, dueDate } = req.body;
    const TaskModel = req.app.locals.useLocalDb ? LocalTask : Task;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await TaskModel.create({
      user: req.user._id,
      title,
      description,
      priority,
      category,
      status,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const TaskModel = req.app.locals.useLocalDb ? LocalTask : Task;
    const task = await TaskModel.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await TaskModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const TaskModel = req.app.locals.useLocalDb ? LocalTask : Task;
    const task = await TaskModel.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
