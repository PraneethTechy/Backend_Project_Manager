import express from 'express';
import { createProject, deleteProject, getAllProjects } from '../controllers/project.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js'; 

const router = express.Router();

// All routes require authentication
router.post('/create', verifyToken, createProject);
router.get('/allprojects', verifyToken, getAllProjects);
router.delete('/delete/:projectId', verifyToken, deleteProject);

export default router;
