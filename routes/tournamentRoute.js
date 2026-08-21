const express = require('express')
const router = express.Router()
const { createTournament, deleteTournament, updateTournament, joinTournament, seeTournament, seeTeam } = require('../controllers/tournamentController')
// US-8
router.post('/create', createTournament)
// US-9
router.patch('/update/:id', updateTournament)
// US-10
router.delete('/delete/:id', deleteTournament)
// US-11
router.post('/join/:id', joinTournament)
// US-12
router.get('/all', seeTournament)
// US-13
router.get('/team', seeTeam)
module.exports = router