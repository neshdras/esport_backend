const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
require('dotenv').config()
const { sequelize, connectDB } = require('./config/database')
const startServer = async () => {
    await connectDB()
    await sequelize.sync({alter: false})
    console.log('Table sync')
}
startServer()
// app.use(
//     helmet({
//         contentSecurityPolicy: false,
//         crossOriginRessoucePolicy: { policy: "cross-origin" }
//     })
// )
const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/userRoute')
const tournamentRoutes = require('./routes/tournamentRoute')
const adminRoutes = require('./routes/adminRoute')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15*60*1000, // femetre de 15min,
    limit: 100, // Max 100 requete par créneau
    message: { status: 429, error: 'Trop de requete, réessayez plus tard'}
})

app.use(limiter)
app.use(express.json())
const corsOption = {
    origin: 'http://localhost:3000'
}
app.use(cors(corsOption))
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/tournament', tournamentRoutes)
app.use('/api/v1/admin', adminRoutes)
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon api rest')
})
app.listen(port, ()=>{
    console.log(`Serveur start on http://localhost:${port}`)
})