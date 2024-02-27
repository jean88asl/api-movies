// garantido que o Node vai se virar para achar o arquivo de conexão
const path = require('path')

// Objeto de configuração principal do knex
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', "database", "database.db")
    },
    // Habilita a função de deletar em cascata
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', "database", 'knex', 'migrations')
    },
    // Propriedade padrão para trabalhar com sqlite
    useNullAsDefault: true
  },
};
