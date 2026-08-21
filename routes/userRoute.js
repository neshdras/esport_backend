const express = require('express')
const router = express.Router()
const { createTeams, addPlayer, joinTeam, removePlayer, seeInfo, profileUpdate, profile } = require('../controllers/userController')
const { authMiddleware } = require('../middleware/authMiddleware')
// US-4
router.patch('/update/:id', authMiddleware, profileUpdate)
// US-5
router.post('/team', authMiddleware, createTeams)
// US-6
router.post('/join', authMiddleware, joinTeam)
// US-7
router.post('/team/:id',authMiddleware, addPlayer)
// US7
router.delete('/team/:id', authMiddleware, removePlayer)
// US-18
router.get('/info', seeInfo)
module.exports = router