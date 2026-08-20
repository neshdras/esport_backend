const express = require('express')
const router = express.Router()
const { createTournament, deleteTournament, updateTournament } = require('../controllers/tournamentController')

router.post('/create', createTournament)
router.patch('/update/:id', updateTournament)
router.delete('/delete/:id', deleteTournament)
module.exports = router