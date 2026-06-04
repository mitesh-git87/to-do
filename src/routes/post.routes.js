const express =require('express');
const userModel = require('../models/user.models');
const authController = require('../controllers/auth.controllers');
const { taskModel } = require('../models/task.models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/me', authController.me);

 
router.delete('/delete/:documentId/:taskId', async (req, res) => {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "unauthorized user"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        const { documentId, taskId } = req.params;

        const deletedTask = await taskModel.findOneAndUpdate(

            {
                _id: documentId,
                user: decoded.id
            },

            {
                $pull: {
                    tasks: {
                        _id: taskId
                    }
                }
            },

            { new: true }

        );

        return res.status(200).json({
            message: "task deleted successfully",
            data: deletedTask
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "failed to delete task"
        });

    }

});


router.get('/get', async (req, res) => {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "unauthorized user"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        const tasks = await taskModel.findOne({
            user: decoded.id
        });

        if (!tasks) {
            return res.status(404).json({
                message: "no tasks found"
            });
        }

        return res.status(200).json({
            message: "tasks fetched successfully",
            data: tasks
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "failed to fetch tasks"
        });

    }

});

router.patch('/patch/:documentId/:taskId', async (req, res) => {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "unauthorized user"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        const { documentId, taskId } = req.params;

        const { task, duedate, description } = req.body;

        const updatedTask = await taskModel.findOneAndUpdate(

            {
                _id: documentId,
                user: decoded.id,
                "tasks._id": taskId
            },

            {
                $set: {
                    "tasks.$.task": task,
                    "tasks.$.duedate": duedate,
                    "tasks.$.description": description
                }
            },

            { new: true }

        );

        return res.status(200).json({
            message: "task updated successfully",
            data: updatedTask
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "failed to update task"
        });

    }

});



module.exports = router;