const { TodoList, User, Category } = require('../models')
const { Op } = require('sequelize')
class TodosController {
    static async createTodo(req, res, next) {
        const { title, description, dueDate, CategoryId } = req.body
        try {
            const { id } = req.user
            // console.log(id,title,description,dueDate,CategoryId);
            let status = 'pending'
            const todo = await TodoList.create({ title, description, status, dueDate, UserId: id, CategoryId })
            res.status(201).json(todo)
        } catch (error) {
            next(error)
        }
    }
    static async getTodosPending(req, res, next) {
        const { id } = req.user
        try {
            const todos = await TodoList.findAll({ where: { UserId: id, status: 'pending' }, include : Category})
            console.log(todos);
            res.status(200).json(todos)
        } catch (error) {
            next(error)
        }
    }
    static async getPastTodos(req, res, next) {
        const { id } = req.user
        try {
            const todos = await TodoList.findAll({ where: { UserId: id, dueDate: { [Op.lt]: new Date() } } ,include : Category})
            res.status(200).json(todos)
        } catch (error) {
            next(error)
        }
    }
    static async getTodosByCategory(req, res, next) {
        const { id } = req.user
        const { categoryId } = req.query
        try {
            const todos = await TodoList.findAll({ where: { UserId: id, CategoryId: categoryId } })
            res.status(200).json(todos)
        } catch (error) {
            next(error)
        }
    }
    static async updateTodo(req, res, next) {
        console.log(req.params,'update');
        const { id } = req.user
        const { title, description, status, dueDate, categoryId } = req.body
        try {
            const todo = await TodoList.update({ title, description, status, dueDate, categoryId }, { where: { UserId: id, id: req.params.id } })
            res.status(200).json(todo)
        } catch (error) {
            next(error)
        }
    }
    static async deleteTodo(req, res, next) {
        const { id } = req.user
        try {
            const todo = await TodoList.destroy({ where: { UserId: id, id: req.params.id } })
            res.status(200).json(todo)
        } catch (error) {
            next(error)
        }
    }
    static async getAllTodos(req, res, next) {
        const { id } = req.user
        const {status} = req.query
        try {
            let todos
            if (status) {
                todos = await TodoList.findAll({ where: { UserId: id , status } ,include : Category})
                
            }else{
                todos = await TodoList.findAll({ where: { UserId: id } ,include : Category})
            }
            console.log(todos,'allllllll');
            res.status(200).json(todos)
        } catch (error) {
            next(error)
        }
    }
    static async getTodosByStatus(req, res, next) {
        const { id } = req.user
        const { status } = req.query
        try {
            const todos = await TodoList.findAll({ where: { UserId: id, status } })
            res.status(200).json(todos)
        } catch (error) {
            next(error)
        }
    }
    static async createCategory(req, res, next) {
        const { id } = req.user
        const { name } = req.body
        try {
            const category = await Category.create({ name, UserId: id })
            res.status(201).json(category)
        } catch (error) {
            next(error)
        }
    }
    static async getCategories(req, res, next) {
        const { id } = req.user
        try {
            const categories = await Category.findAll({ where: { UserId: id } })
            res.status(200).json(categories)
        } catch (error) {
            next(error)
        }
    }
    static async getTodosById(req, res, next) {
        const { id } = req.user
        const { todoId } = req.params
        try {
            const todo = await TodoList.findByPk(todoId, { where: { UserId: id } })
            res.status(200).json(todo)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = TodosController