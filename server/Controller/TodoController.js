import Task from "../Model/ToDoModel.js";

export const getAllTodos = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized. User ID missing.' });
    }

    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    console.log('create todo');
    const userId = req.user._id;
    console.log('USER ID:' + req.user);
    // Validation
    if (!title || !dueDate) {
      return res.status(400).json({ success: false, error: 'Title and due date are required.' });
    }

    if (!userId) {
      return res.status(400).json({ success: false, error: 'Unauthorized. User ID missing.' });
    }

    const newTask = new Task({ title, dueDate, user: userId });
    await newTask.save();
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateTodo = async (req, res) => {
    try {
        const { title, dueDate } = req.body;

        // Allow only specific fields to be updated
        const updateFields = {};
        if (title) updateFields.title = title;
        if (dueDate) updateFields.dueDate = dueDate;

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }
        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
