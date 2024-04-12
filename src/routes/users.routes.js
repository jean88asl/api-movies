const { Router } = require("express")

const UserController = require('../controllers/UsersController')
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const usersRoutes = Router()
const userController = new UserController()

usersRoutes.post('/', userController.create)
usersRoutes.delete('/:id', userController.delete)

usersRoutes.put('/', ensureAuthenticated, userController.update)

module.exports = usersRoutes