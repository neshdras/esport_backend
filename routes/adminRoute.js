const express = require('express')
const router = express.Router()
const { deleteTeam, statTournament, updateRole } = require('../controllers/adminController')
const { authMiddleware } = require('../middleware/authMiddleware')

// US-14
router.delete('/delete/team', authMiddleware ,deleteTeam)
// US-15
router.get('/stat', authMiddleware, statTournament)
// US-16
router.patch('/role', authMiddleware, updateRole)
module.exports = router 