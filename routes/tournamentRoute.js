const express = require('express')
const router = express.Router()
const { createTournament, deleteTournament, updateTournament, joinTournament, seeTournament, seeTeam } = require('../controllers/tournamentController')

router.post('/create', createTournament)
router.patch('/update/:id', updateTournament)
router.delete('/delete/:id', deleteTournament)
router.post('/join/:id', joinTournament)
router.get('/all', seeTournament)
router.get('/team', seeTeam)
module.exports = router