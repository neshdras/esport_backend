const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully')
    } catch (err) {
        console.error('Unable to connect to database: ', err)
    }
}
module.exports = { sequelize, connectDB }