import Knex from 'knex'
// @ts-ignore
import config from '../../config/knexfile'

const Db: Knex = Knex(config)

export default Db
