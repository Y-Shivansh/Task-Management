import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 1,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'lapsed'],
    default: 'pending',
  },
  actualCompletionTime: {
    type: Date,
  },
},{timestamps: true});

const Task = mongoose.model("Task", taskSchema);
export default Task;