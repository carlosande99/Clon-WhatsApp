import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 4000,
    database: 'peliculas'
}


const connection = await mysql.createConnection(config)

export class MovieModel {
    static async getAll() {
        const [movies] = await connection.query(
            'SELECT * FROM movie'
        )
        return movies
    }
}