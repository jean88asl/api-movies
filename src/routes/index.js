const { Router } = require("express")

const usersRoutes = require("./users.routes")
const movieNotesRoutes = require("./notes.routes")
const tagsRoutes = require("./tags.routes")

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/notes", movieNotesRoutes)
routes.use("/tags", tagsRoutes)

module.exports = routes