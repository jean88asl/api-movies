require("express-async-errors")

const database = require("./database/sqlite")

const AppError = require("./utils/AppError")
const uploadConfig = require("./configs/upload")

const express = require("express")

const routes = require("./routes")

const app = express()

// indicando que as respostas das requisições serão no formato json
app.use(express.json())

// exibindo os arquivos estáticos
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

// usando as rotas do arquivo index.js que fica na pasta routes
app.use(routes)

database()

app.use(( error, request, response, next ) => {
    if(error instanceof AppError) {
       return response.status(error.statusCode).json({
          status: "error",
          message: error.message
       })
    }

    //logando o erro, para um possível debug
    console.log(error)
 
    // Logando erro no nosso lado
    return response.status(500).json({
       status: "error",
       message: "Internal server error",
    })
 })

const PORT = 3333

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

