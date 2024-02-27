const { Router } = require("express")
const UserController = require('../controllers/UsersController')

const usersRoutes = Router()

const userController = new UserController()

usersRoutes.post('/', userController.create)
usersRoutes.put('/:id', userController.update)
usersRoutes.delete('/:id', userController.delete)

module.exports = usersRoutes