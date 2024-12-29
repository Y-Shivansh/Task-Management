import express from 'express';
import { verifyUserToken } from '../middleware/user.middleware.js';
import { getTasks, newTasks, updateTask, deleteTask, getMetrics } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.post('/', newTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/metrics', getMetrics);

export default router;