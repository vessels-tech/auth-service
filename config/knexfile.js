import path from 'path'

const BASE_PATH = path.join(__dirname, '../')

const connectionString = `${process.env.DATABASE_URL}${process.env.DATABASE_URL_SSL || ''}`

// Placeholder config for setting up models
// Update for auth service
const config = {
  client: 'postgresql',
  connection: `${connectionString}`,
  pool: {
    min: 2,
    max: 10,
    afterCreate: (conn, cb) => {
      conn.query('SET timezone="UTC";', err => {
        cb(err, conn)
      })
    }
  },
  migrations: {
    directory: path.join(BASE_PATH, 'migrations'),
    schemaName: 'public',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds')
  }
}

export default config
