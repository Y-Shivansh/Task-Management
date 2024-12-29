import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { verifyUserToken } from './middleware/user.middleware.js';

const app = express();
const corsOption = {
    origin: ["http://localhost:5174", "https://op-task-manager.vercel.app"],
}
app.use(express.json());
app.use(cors(corsOption));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

app.use("/api/v1/auth", userRoutes);
app.use(verifyUserToken)
app.use("/api/v1/tasks", taskRoutes);
export default app;