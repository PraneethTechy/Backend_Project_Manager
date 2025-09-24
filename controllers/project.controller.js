import Project from '../models/project.model.js';
import User from '../models/user.model.js';
import Todo from '../models/todo.model.js';
// Create Project
export const createProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;

    if (!projectName || !description) {
      return res.status(400).json({ message: 'Project name and description are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const nameExist = await Project.findOne({ projectName });
    if (nameExist) {
      return res.status(400).json({ message: "This name already exists for another project" });
    }

    const newProject = new Project({ projectName, description, user: user._id });
    const savedProject = await newProject.save();

    // Push project ID to user's projects array
    user.projects.push(savedProject._id);
    await user.save();

    res.status(201).json({ message: "Project created successfully", projectId: savedProject._id });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove project reference from user's projects array
    await User.findByIdAndUpdate(deletedProject.user, { $pull: { projects: projectId } });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get All Projects for Logged-in User
export const getAllProjects = async (req, res) => {
  try {
    const userId = req.userId;

    const projects = await Project.find({ user: userId }).populate('todos');

    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
