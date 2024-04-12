const knex = require("../database/knex")
const { compare } = require("bcryptjs")

const AppError = require("../utils/AppError")

const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")
 
class SessionsController {
    async create(request, response) {
        const { email, password } = request.body

        const user = await knex("users").where({ email }).first()

        // return console.log(user)

        if(!user){
            throw new AppError("E-mail e/ou senha incorretos", 401)
        }

        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched) {
            throw new AppError("E-mail e/ou senha incorretos", 401)
        }

        // adicionando o token a resposta da requisição
        const {secret, expiresIn} = authConfig.jwt
        const token = sign({}, secret, {
            subject: String(user.id), expiresIn
        })

        return response.json({ user, token })
    }
}

module.exports = SessionsController