const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')

// US-1
router.post('/register', register)
// US-2
router.post('/login', login)
module.exports = router