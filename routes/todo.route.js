
import express from 'express';
import { createTodo, deleteTodoById, editTodo, getTodoByProject } from '../controllers/todo.controller.js';

const router = express.Router();

router.post('/create/:projectId', createTodo);
router.get('/project/:projectId', getTodoByProject);
router.put('/edit/:todoId', editTodo);
router.delete('/delete/:todoId', deleteTodoById);

export default router;

