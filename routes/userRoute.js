const express = require('express')
const router = express.Router()
const { profile, createTeams, addPlayer, deletePlayer, joinTeam } = require('../controllers/userController')

router.patch('/update/:id', profile)
router.post('/team', createTeams)
router.post('/team/:id', addPlayer)
router.post('/join', joinTeam)
router.delete('/team/:id', deletePlayer)

module.exports = router