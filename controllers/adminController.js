const { QueryTypes } = require("sequelize")
const { sequelize } = require("../config/database")

//US-14
exports.deleteTeam = async (req, res) => {
    try {
        const { idTeam, idAdmin } = req.body
        const existingAdmin = await sequelize.query('SELECT fk_id_role as role, count( id_user) from "Users" where id_user = :idAdmin group by fk_id_role', {
            type: QueryTypes.SELECT,
            replacements: {idAdmin}
        })
        
        if(existingAdmin[0].count != 1)
            return res.status(404).json({message: "user not found"})
        if(existingAdmin[0].role != 1)
            return res.status(401).json({message: "Not authorized"})

        const existingTeam = await sequelize.query('SELECT COUNT(*) FROM "Teams" where id_team = :idTeam', {
            type: QueryTypes.SELECT,
            replacements: {idTeam}
        })
        if(existingTeam[0].count != 1)
            return res.status(404).json({message: "Team no longuer exist"})

        await sequelize.query('DELETE FROM "Teams" WHERE id_team = :idTeam', {
            type: QueryTypes.DELETE,
            replacements: {idTeam}
        })
        res.status(200).json({message: "Team delete"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

//US-15
exports.statTournament = async (req, res)=>{
    try {
        const idAdmin = req.body.idAdmin
        const existingAdmin = await sequelize.query('SELECT fk_id_role as role, count( id_user) from "Users" where id_user = :idAdmin group by fk_id_role', {
            type: QueryTypes.SELECT,
            replacements: {idAdmin}
        })
        
        if(existingAdmin[0].count != 1)
            return res.status(404).json({message: "user not found"})
        if(existingAdmin[0].role != 1)
            return res.status(401).json({message: "Not authorized"})
        const stat = await sequelize.query('select t.name_tournament as "tournament", count(p.fk_id_team) as "nb team" from "Tournaments" as t inner join "Tournaments_has_Teams" as p on t.id_tournament = p.fk_id_tournament group by t.name_tournament', {
            type: QueryTypes.SELECT})
        res.status(200).json(stat)
    } catch (err) {
        res.status(500).json({message: err.message})
        
    }
}
//US-16
exports.updateRole = async(req, res) => {
    try {
        const { idAdmin, idUser, role} = req.body
        const existingAdmin = await sequelize.query('SELECT fk_id_role as role, count( id_user) from "Users" where id_user = :idAdmin group by fk_id_role', {
            type: QueryTypes.SELECT,
            replacements: {idAdmin}
        })
        
        if(existingAdmin[0].count != 1)
            return res.status(404).json({message: "user not found"})
        if(existingAdmin[0].role != 1)
            return res.status(401).json({message: "Not authorized"})

        const existingUser = await sequelize.query('select count(*) from "Users" where id_user = :idUser', {
            type: QueryTypes.SELECT,
            replacements: {idUser}
        })
        if(existingUser[0].count != 1)
            return res.status(404).json({message: "User not found"})
        
        await sequelize.query('update "Users" set fk_id_role = :role where id_user = :idUser', {
            type: QueryTypes.UPDATE,
            replacements: {role, idUser }
        })
        res.status(200).json({message: "Role update successfully"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }


}