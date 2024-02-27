const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class Tags {
    async show(request, response) {
        const { id } = request.params

        const tags = await knex("movie_tags")
        .where("user_id", id)
        .orderBy("name")

        response.json(tags)
    }
}

module.exports = Tags