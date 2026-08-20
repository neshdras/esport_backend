const express = require('express')
const router = express.Router()
const { deleteTeam, statTournament, updateRole } = require('../controllers/adminController')

router.delete('/delete/team', deleteTeam)
router.get('/stat', statTournament)
router.patch('/role', updateRole)
module.exports = router 