const express = require('express')
const fs = require('fs').promises
const path = require('path')
const router = express.Router()

const todosFile = path.join(__dirname, '../data/todos.json')

//Helper function to read todos
async function readTodos() {
    try {
        const todos = await fs.readFile(todosFile, 'utf-8')
        return JSON.parse(todos)
    } catch (error) {
        return []
    }
}
async function writeTodos(todos) {
    await fs.writeFile(todosFile, JSON.stringify(todos, null, 2))
}

//Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await readTodos()
        res.json({
            success: true,
            data: todos,
            count: todos.length
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch todos'
        })
    }
})

//get one todo
router.get('/:id', async (req, res) => {
    try {
        const todos = await readTodos()
        const todo = todos.find(t => t.id === req.params.id)
        if (!todo) {
            return res.status(404).json({
                success: false,
                error: "Todo not found"
            })
        }
        res.json({
            success: true,
            data: todo,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch todo'
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body
        //validation
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            })
        }
        const todos = await readTodos()
        const newTodo = {
            id: Date.now().toString(),
            title: title,
            description: description,
            completed: false,
            createdAt: new Date().toISOString()
        }
        todos.push(newTodo)
        await writeTodos(todos)
        res.status(201).json({
            success: true,
            data: newTodo,
            message: 'Todo Created successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create todo'
        })
    }
})

//update a todo
router.put('/:id', async (req, res) => {
    try {
        const todos = await readTodos()
        const todoIndex = todos.findIndex(t => t.id === req.params.id)
        if (todoIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Todo not found'
            })
        }
        const { title, description, completed } = req.body
        if (title !== undefined) todos[todoIndex].title = title.trim()
        if (description !== undefined) todos[todoIndex].description = description.trim()
        if (completed !== undefined) todos[todoIndex].completed = completed
        todos[todoIndex].updatedAt = new Date().toISOString()
        await writeTodos(todos)
        res.status(200).json({
            success: true,
            data: todos[todoIndex],
            message: 'Updated successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update todo'
        })
    }
})

//delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const todos = await readTodos()
        const index = todos.findIndex(t => t.id === req.params.id)
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Todo not found'
            })
        }
        const deletedTodo = todos.splice(index, 1)[0]
        await writeTodos(todos)
        res.status(200).json({
            success: true,
            data: deletedTodo,
            message: 'Todo deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete todo'
        })
    }
})

module.exports = router;