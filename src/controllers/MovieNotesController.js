const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class MovieNotesController {
    async create(request, response) {
        const {title, description, rating, tags } = request.body
        const user_id = request.user.id

        if(!title || !rating) throw new AppError("O título e nota são obrigatórios.")
        if(!tags) throw new AppError("Informe pelo menos uma Tag!")

        parseInt(rating)

        if(rating < 0 || rating > 5) {
            throw new AppError("A nota deve estar entre 0 até 5.")
        }

        const [ note_id ] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsInsert = tags.map(name => {
            return {
               note_id,
               user_id,
               name 
            }
        })

        await knex("movie_tags").insert(tagsInsert)

        response.json()
    }

    async show(request, response) {
        const { id } = request.params

        const note = await knex("movie_notes").where({ id })
        const tags = await knex("movie_tags").where({ note_id: id })


        return response.json({
            ...note,
            tags
        })
    }

    async delete(request, response) {
        const { id } = request.params

        await knex("movie_notes").where({ id }).delete()

        response.json()
    }

    async index(request, response) {
        const { title, tags } = request.query

        // pegando so dados do cabeçalho da requisição
        const user_id = request.user.id

        let notes

        if(tags) {
            const filterTags = tags.split(',').map(tag => tag.trim())

            console.log(filterTags)

            notes = await knex("movie_tags")
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.user_id"
            ])
            .where("movie_notes.user_id", user_id)
            .whereLike("movie_notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
            .orderBy("movie_notes.title")
        } else {
            notes = await knex("movie_notes")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title")
        }

        const usertags = await knex("movie_tags").where({ user_id })

        const notesWithTags = notes.map(note => {
            const noteTags = usertags.filter(tag => tag.note_id === note.id)

            return {
                ...note,
                tags: noteTags
            }

        })

        return response.json(notesWithTags)
    }
}

module.exports = MovieNotesController