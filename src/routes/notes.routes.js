const { Router } = require("express")

const MovieNotesController = require('../controllers/MovieNotesController')
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const movieNotesRoutes = Router()
const movieNotesController = new MovieNotesController()

// Usando o middleware em todas as rotas
movieNotesRoutes.use(ensureAuthenticated)

movieNotesRoutes.post('/', movieNotesController.create)
movieNotesRoutes.get('/', movieNotesController.index)
// O ID está relacionado as notas e não ao ID do usuário
movieNotesRoutes.get('/:id', movieNotesController.show)
movieNotesRoutes.delete('/:id', movieNotesController.delete)

module.exports = movieNotesRoutes