const express = require('express')
const router = express.Router()
const { profile, createTeams, addPlayer, joinTeam, removePlayer } = require('../controllers/userController')

router.patch('/update/:id', profile)
router.post('/team', createTeams)
router.post('/team/:id', addPlayer)
router.post('/join', joinTeam)
router.delete('/team/:id', removePlayer)

module.exports = router