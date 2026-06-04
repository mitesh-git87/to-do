const mongoose = require('mongoose');

const taskItemSchema = new mongoose.Schema(
    {
        task: { type: String, required: true, trim: true },
        duedate: { type: String, default: "", trim: true },
        description: { type: String, default: "", trim: true },
    },
    { timestamps: true }
);

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true, unique: true },
    tasks: { type: [taskItemSchema], default: [] },
}, { timestamps: true })

const taskModel = mongoose.model("tasks" , taskSchema);

module.exports ={taskModel};