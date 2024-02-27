exports.up = knex => knex.schema.createTable("movie_notes", table => {
    table.increments("id")
    table.text('title').notNullable()
    table.text('description')
    table.integer('rating').notNullable()
    table.integer('user_id').references("id").inTable("users").onDelete("CASCADE")
    //linha que adiciona campo de data e hora de criação e alteração dos usuários
    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable("movie_notes") 
