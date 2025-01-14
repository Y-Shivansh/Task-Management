import Task from '../models/Task.model.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchemas.js';

// Get all tasks
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Create new task
export const newTasks = async (req, res) => {
    const { title, description, priority, startDate, endDate } = req.body;

    try {
        // createTaskSchema.parse(req.body); // Validate request body

        const task = new Task({
            title,
            description,
            priority,
            startDate,
            endDate,
            userId: req.user.userId
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update task
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, startDate, endDate, status, actualCompletionTime } = req.body;

    try {
        // updateTaskSchema.parse(req.body); // Validate request body

        let task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.startDate = startDate || task.startDate;
        task.endDate = endDate || task.endDate;
        task.status = status || task.status;
        task.actualCompletionTime = status === 'completed' ? new Date() : task.actualCompletionTime;

        await task.save();
        res.status(200).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        await Task.findByIdAndDelete(id);
        res.status(200).json({ msg: 'Task deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get task metrics
export const getMetrics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({ userId }); 
    const currentTime = new Date(); // to calculate state

    let priorityWiseStats = {}; // An object to store statistics grouped by task priority
    let totalTasks = 0; 
    tasks.forEach(task => {
      const startTime = new Date(task.startDate);
      const endTime = new Date(task.endDate);

      // Total time to finish (for both completed and pending tasks)
      const totalTime = (endTime - startTime) / (1000 * 60 * 60); // Convert ms to hours

      let timeLapsed = 0;  // Time lapsed for pending tasks.
      let balanceTime = 0; // Remaining time to complete pending tasks.

      if (task.status === "pending") { 
        timeLapsed = currentTime < startTime ? 0 : (currentTime - startTime) / (1000 * 60 * 60);
        balanceTime = currentTime > endTime ? 0 : (endTime - currentTime) / (1000 * 60 * 60);
      }

      // Group stats by priority: if priority of the task is not already in priorityWiseStats, initialize it with default values.
      if (!priorityWiseStats[task.priority]) {
        priorityWiseStats[task.priority] = { pendingTasks: 0, totalTime: 0, timeLapsed: 0, balanceTime: 0, timeToFinish: 0, completedTasks: 0 };
      }

      /*
      ex:
        priorityWiseStats[task.priority] = { 
          pendingTasks: 1, (example value)
          completedTasks: 0 
          totalTime: 0, 
          timeLapsed: 0, 
          balanceTime: 0, 
          timeToFinish: 0,
      };
      */

      // Accumulate stats
      priorityWiseStats[task.priority].totalTime += totalTime;
      priorityWiseStats[task.priority].timeLapsed += timeLapsed;
      priorityWiseStats[task.priority].balanceTime += balanceTime;
      priorityWiseStats[task.priority].timeToFinish += totalTime;

      // Increment task counts based on status
      if (task.status === "pending") {
        priorityWiseStats[task.priority].pendingTasks += 1;
      } else if (task.status === "completed") {
        priorityWiseStats[task.priority].completedTasks += 1;
      } 

      totalTasks += 1;
    });

    //  average time for completed tasks
    const completedTasks = tasks.filter(task => task.status === "completed");
    const completedTime = completedTasks.reduce((acc, task) => {
      const startTime = new Date(task.startDate);
      const actualCompletionTime =  task.actualCompletionTime ? new Date(task.actualCompletionTime) : new Date();
      return acc + (actualCompletionTime - startTime) / (1000 * 60 * 60); // Convert ms to hours
    }, 0);
    const avgTime = completedTasks.length > 0 ? completedTime / completedTasks.length : 0;

    res.status(200).json({
      priorityWiseStats,
      avgTime,
      totalTasks 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};