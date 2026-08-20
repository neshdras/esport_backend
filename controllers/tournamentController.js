const { QueryTypes } = require("sequelize")
const { sequelize } = require("../config/database")

//US-8
exports.createTournament = async (req, res) => {
    try {
        const { name, game, date, rule, organizer } = req.body
    
        if(!name  || !game || !date || !rule || !organizer)
            return res.status(400).json({message: "Please provide the information ask for"})
    
        const existingTournament = await sequelize.query('SELECT COUNT(*) FROM "Tournaments" WHERE name_tournament = :name AND game_tournament = :game', {
            type: QueryTypes.SELECT,
            replacements: {name, game}
        })
        
        if(existingTournament[0].count == 1)
            return res.status(400).json({message: "This tournament already exist"})
        
        await sequelize.query('insert into "Tournaments"(name_tournament, game_tournament, date_tournament, rule_tournament, fk_id_user) values (:name, :game, :date, :rule, :organizer)', {
            type: QueryTypes.INSERT,
            replacements: {name, game, date, rule, organizer}
        })
        const queryTournament = await sequelize.query('select * from "Tournaments" where game_tournament = :game and name_tournament = :name', {
            type: QueryTypes.SELECT,
            replacements: {name, game}
        })
        const tournament = queryTournament[0]
        res.status(201).json({
            message: "Tournament is create successfuly",
            tournament
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

//US-9
exports.updateTournament = async (req, res) => {
    const idTournament = req.params.id
    const {name, game, date, rule, idOrganizer} = req.body

    const queryTournament = await sequelize.query('SELECT name_tournament as name, game_tournament as game, date_tournament as date, rule_tournament as rule FROM "Tournaments" WHERE id_tournament = :idTournament AND fk_id_user = :idOrganizer ', {
        type: QueryTypes.SELECT,
        replacements: {idTournament, idOrganizer}
    })
    
    const tournament = queryTournament[0]
    if(tournament == null)
        return res.status(404).json({message: "Tournament not found"})

    if(name != null)
        tournament.name = name
    if(game != null)
        tournament.game = game
    if(date != null)
        tournament.date = date
    if(rule != null)
        tournament.rule = rule

    const existingTournament = await sequelize.query('SELECT COUNT(*) FROM "Tournaments" WHERE name_tournament = :name AND game_tournament = :game', {
        type: QueryTypes.SELECT,
        replacements:{game: tournament.game, name: tournament.name}
    })
    if(existingTournament[0].count == 1)
        return res.status(400).json({message: "Tournament already exist"})

    await sequelize.query('UPDATE "Tournaments" set name_tournament = :name, game_tournament = :game, date_tournament = :date, rule_tournament = :rule WHERE id_tournament = :id', {
        type: QueryTypes.UPDATE,
        replacements:{
            id: idTournament,
            name: tournament.name,
            game: tournament.game,
            date: tournament.date,
            rule: tournament.rule
        }
    })
    res.status(201).json({message: "Toournament update successfuly", tournament})
}

//US-10
exports.deleteTournament = async (req, res) => {
    try {
        
        const idTournament = req.params.id
        const idOrganizer = req.body.organizer
        const existingTournament = await sequelize.query('SELECT COUNT(*) FROM "Tournaments" WHERE id_tournament = :idTournament AND fk_id_user = :idOrganizer', {
        type: QueryTypes.SELECT,
        replacements: {idTournament, idOrganizer}
    })
        
    if(existingTournament[0].count != 1)
        return res.status(404).json({message: "Tournament not found"})
    
    await sequelize.query('DELETE FROM "Tournaments" WHERE id_tournament = :idTournament', {
        type:QueryTypes.DELETE,
        replacements:{idTournament}
    })
    res.status(200).json({message: "Tournament was remove"})
} catch (err) {
    res.status(500).json({message: err.message})
}
}

//US-11
exports.joinTournament = async (req, res) => {
    try {
        const {idTeam} = req.body
        const idTournament = req.params.id
    
        const existingTournament = await sequelize.query('SELECT name_tournament AS name, COUNT(*) FROM "Tournaments" WHERE id_tournament = :idTournament GROUP BY id_tournament', {
                type: QueryTypes.SELECT,
                replacements: {idTournament}
            })
            
        if(existingTournament[0].count =! 1)
            return res.status(404).json({message: "Tournament not found"})
    
        const existingTeam = await sequelize.query('SELECT  COUNT(*) FROM "Teams" WHERE id_team = :idTeam', {
                type: QueryTypes.SELECT,
                replacements: {idTeam}
            })
            
        if(existingTeam[0].count != 1)
            return res.status(404).json({message: "Team not found"})
    
        await sequelize.query('INSERT INTO "Tournaments_has_Teams" VALUES (:idTournament, :idTeam)',{
            type: QueryTypes.INSERT,
            replacements:{idTeam, idTournament}
        })
        res.status(200).json({message: `Team add to ${existingTournament[0].name}`})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

//US-12
exports.seeTournament = async (req, res) => {
    try {
        const date = new Date().toISOString()
        const today = date.split("T")[0]
    
        const allTournament = await sequelize.query('SELECT * FROM "Tournaments" WHERE date_tournament > :date', {
            type: QueryTypes.SELECT,
            replacements:{date: today}
        })
        res.status(200).json(allTournament)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

//US-13
exports.seeTeam = async (req, res) => {
    try {
        const { idOrganizer } = req.body
        const getTeam = await sequelize.query('select t.name_team, c.name_tournament, c.game_tournament from "Tournaments" as c inner join  "Tournaments_has_Teams" as tu on c.id_tournament = tu.fk_id_tournament inner join "Teams" as t on tu.fk_id_team = t.id_team where c.fk_id_user = :idOrganizer order by c.id_tournament', {
            type: QueryTypes.SELECT,
            replacements: {idOrganizer}
        })
        res.status(200).json(getTeam)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}