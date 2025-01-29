const express = require('express');
const router = express.Router();
const Todo = require('../models/todoModel');

// Add a ToDo
router.post('/', async (req, res, next) => {
    try {
        const todo = await Todo.create(req.body);
        
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        next(err);
    }
});

// Fetch all ToDos
router.get('/', async (req, res, next) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        next(err);
    }
});

// Fetch a specific ToDo
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) return res.status(404).json({ message: 'ToDo not found' });
        res.json(todo);
    } catch (err) {
        next(err);
    }
});

// Edit a ToDo
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(id, { title, description }, { new: true });
        if (!updatedTodo) return res.status(404).json({ message: 'ToDo not found' });
        res.json(updatedTodo);
    } catch (err) {
        next(err);
    }
});

// Remove a ToDo
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) return res.status(404).json({ message: 'ToDo not found' });
        res.json({ message: 'ToDo deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
