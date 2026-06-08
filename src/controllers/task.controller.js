const { taskModel } = require('../models/task.models');
const jwt = require('jsonwebtoken');
 
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireUserId(req) {
    const token = req.cookies?.token;
    if (!token) return null;   
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.id;
    } catch {
        return null;   
    }
}

async function createTask(req, res) {
    const userId = requireUserId(req);
    if(!userId) {return res.status(401).json({message: "unauthorized user"})};

    const { tasks } = req.body;  
    if (!Array.isArray(tasks)) {
        return res.status(400).json({ message: "tasks must be an array" });
    }

    try{
        const task = await taskModel.findOneAndUpdate(
            { user: userId },
            { $set: { tasks } },
            { upsert: true, new: true }
        );
        return res.status(201).json({
            message:'task created successfully',
            data: task

        });
    }catch(err) {
        console.log(err);
        return res.status(500).json({message:"failed to create task"});
    }

    
}

async function getMyTasks(req, res) {
    const userId = requireUserId(req);
    if(!userId) {return res.status(401).json({message: "unauthorized user"})};

    try {
        const doc = await taskModel.findOne({ user: userId });
        if (!doc) return res.status(200).json({ message: "ok", data: { _id: null, tasks: [] } });
        return res.status(200).json({ message: "ok", data: doc });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "failed to fetch tasks" });
    }
}

async function addTaskItem(req, res) {
    const userId = requireUserId(req);
    if(!userId) {return res.status(401).json({message: "unauthorized user"})};

    const { task, duedate, description } = req.body || {};
    if (!task || typeof task !== "string" || !task.trim()) {
        return res.status(400).json({ message: "task is required" });
    }

    try {
        const doc = await taskModel.findOneAndUpdate(
            { user: userId },
            {
                $push: {
                    tasks: {
                        task: task.trim(),
                        duedate: typeof duedate === "string" ? duedate.trim() : "",
                        description: typeof description === "string" ? description.trim() : "",
                    },
                },
            },
            { upsert: true, new: true }
        );

        const created = doc.tasks[doc.tasks.length - 1];
        return res.status(201).json({ message: "created", data: { documentId: doc._id, task: created } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "failed to create task" });
    }
}

async function updateTaskItem(req, res) {
    const userId = requireUserId(req);
    if(!userId) {return res.status(401).json({message: "unauthorized user"})};

    const { taskId } = req.params;
    const { task, duedate, description } = req.body || {};

    try {
        const doc = await taskModel.findOneAndUpdate(
            { user: userId, "tasks._id": taskId },
            {
                $set: {
                    "tasks.$.task": typeof task === "string" ? task : undefined,
                    "tasks.$.duedate": typeof duedate === "string" ? duedate : undefined,
                    "tasks.$.description": typeof description === "string" ? description : undefined,
                },
            },
            { new: true }
        );

        if (!doc) return res.status(404).json({ message: "task not found" });
        return res.status(200).json({ message: "updated", data: doc });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "failed to update task" });
    }
}

async function deleteTaskItem(req, res) {
    const userId = requireUserId(req);
    if(!userId) {return res.status(401).json({message: "unauthorized user"})};

    const { taskId } = req.params;

    try {
        const doc = await taskModel.findOneAndUpdate(
            { user: userId },
            { $pull: { tasks: { _id: taskId } } },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: "task not found" });
        return res.status(200).json({ message: "deleted", data: doc });
    }catch(err) {
        console.log(err);
        return res.status(500).json({ message: "failed to delete task" });
    }

    
}

module.exports ={createTask, getMyTasks, addTaskItem, updateTaskItem, deleteTaskItem};
