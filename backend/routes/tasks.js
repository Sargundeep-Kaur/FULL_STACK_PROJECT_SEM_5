const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect); // All task routes are protected

router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;
