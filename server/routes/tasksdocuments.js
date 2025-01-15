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

const tasksRouter = express.Router();

// Routes
tasksRouter.post('/', upload.single('file'), addTask);
tasksRouter.get('/count', getTasksCount);
tasksRouter.get('', getAllTasks);
tasksRouter.get('/:id', getTaskById);
tasksRouter.get('/download/:id', downloadTaskById);
tasksRouter.put('/:id', upload.single('file'), updateTask);
tasksRouter.delete('/:id', deleteTask);

export default tasksRouter;
