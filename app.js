const express = require('express')
const app = express()
const port = 3000
require('dotenv').config()
const { sequelize, connectDB } = require('./config/database')
const startServer = async () => {
    await connectDB()
    await sequelize.sync({alter: false})
    console.log('Table sync')
}
startServer()
const authRoutes = require('./routes/authRoute')
app.use(express.json())
app.use('/api/v1/auth', authRoutes)
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon api rest')
})
app.listen(port, ()=>{
    console.log(`Serveur start on http://localhost:${port}`)
})