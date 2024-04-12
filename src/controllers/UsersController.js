const { hash, compare } = require("bcryptjs")

const AppError = require("../utils/AppError")
const sqliteConnection =require("../database/sqlite")

class UserController {
    async create(request, response) {
        const { name, email, password } = request.body

        const database = await sqliteConnection()

        const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserExist) {
            throw new AppError("Este usuário já está cadastrado!")
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
        )

        response.status(201).json()
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body
        const user_id = request.user.id

        const database = await sqliteConnection()

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])


        if(!user) {
            throw new AppError("Usuário não encontrado!")
        }
        
        const validatingUserEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])
        
        if(validatingUserEmail && validatingUserEmail.id !== user.id ) {
            throw new AppError("Este e-mail já está sendo utilizado!")
        }
        
        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !old_password){
            throw new AppError("Favor informe a antiga senha para poder conseguir atualizar a senha.")
        }

        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword) {
                throw new AppError("A senha antiga não confere")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
            UPDATE users SET 
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
            )

        return response.json({
            "message": "Dados Atualizados com sucesso!"
        })
    }

    async delete(request, response){
      const { email, password } = request.body
      const { id } = request.params

      const database = await sqliteConnection()
      const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

      if(!user) throw new AppError("Usuário não encontrado!")

      if(!email) throw new AppError("Favor informe o e-mail associado ao usuário!")
      if(!password) throw new AppError("Favor informe a senha do usuário.")

      const checkPassword = await compare(password, user.password)

      if(user.email === email && checkPassword) {
        await database.run("DELETE FROM users WHERE id = (?)", [id])
        return response.json()
      } else {
        throw new AppError("Dados inválidos!")
      }
    }
}

module.exports = UserController