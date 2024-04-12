const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class Tags {
    async show(request, response) {
        const user_id = request.user.id

        const tags = await knex("movie_tags")
        .where({user_id})
        .orderBy("name")

        response.json(tags)
    }
}

module.exports = Tags