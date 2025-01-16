import express from 'express';
import { upload } from '../middlewares/multer.js';
import {
    addTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    downloadTaskById,
    getTasksCount
} from '../controllers/tasksDocuments.js';
import { roleMiddleware } from '../middlewares/autherization.js';

const tasksRouter = express.Router();



// Routes



tasksRouter.get('/count',roleMiddleware(["admin"]), getTasksCount)
tasksRouter.get('/',roleMiddleware(["admin","accountant"]), getAllTasks);
tasksRouter.get('/:id',roleMiddleware(["admin","accountant","client"]), getTaskById);
tasksRouter.get('/download/:id',roleMiddleware(["admin","accountant","client"]), downloadTaskById);
tasksRouter.post('/',roleMiddleware(["admin","accountant","client"]), upload.single('file'), addTask);
tasksRouter.put('/:id',roleMiddleware(["admin","accountant"]), upload.single('file'), updateTask);
tasksRouter.delete('/:id',roleMiddleware(["admin"]), deleteTask);

export default tasksRouter;
