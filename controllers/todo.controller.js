import Todo from '../models/todo.model.js';
import Project from '../models/project.model.js';

// Create a new Todo
export const createTodo = async (req, res) => {
  try {
    const { title, status, priority, deadline } = req.body;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const todo = new Todo({
      title,
      status,
      priority,
      deadline,
      projectId: project._id,
    });

    const savedTodo = await todo.save();

    // Add todo reference to project
    project.todos.push(savedTodo._id);
    await project.save();

    res.status(201).json(savedTodo);

  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a Todo
export const editTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const { title, status, priority, deadline } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title, status, priority, deadline },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);

  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Todos by Project
export const getTodoByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const todos = await Todo.find({ projectId });
    res.status(200).json({ projectName: project.title, todos });

  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Todo
export const deleteTodoById = async (req, res) => {
  try {
    const todoId = req.params.todoId;

    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Optionally, remove from Project.todos array
    await Project.findByIdAndUpdate(deletedTodo.projectId, {
      $pull: { todos: deletedTodo._id }
    });

    res.status(200).json({ message: 'Todo deleted successfully' });

  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
