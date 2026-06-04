const express =require('express');
const taskcontroller = require('../controllers/task.controller');


const router = express.Router();


router.post('/task/create',taskcontroller.createTask);
router.get('/tasks', taskcontroller.getMyTasks);
router.post('/tasks', taskcontroller.addTaskItem);
router.patch('/tasks/:taskId', taskcontroller.updateTaskItem);
router.delete('/tasks/:taskId', taskcontroller.deleteTaskItem);

module.exports= router;