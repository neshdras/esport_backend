const { QueryTypes } = require("sequelize")
const { sequelize } = require("../config/database")
const bcrypt = require('bcryptjs')

//US4
exports.profile = async (req, res) =>{
    try {
        const id = req.params.id
        const body = req.body
        
        const query = await sequelize.query('select name_user as name, email_user as email, pass_user as password, picture_user as picture from "Users" where id_user = :id', {
            type: QueryTypes.SELECT,
            replacements:{id}
        })
        const user = query[0]
        if(user === null)
            return res.status(404).json({message: "User not find"})
        
        if(body.name != null)
            user.name = body.name

        if(body.email != undefined){
            const existingEmail = await sequelize.query('select count(email_user) from "Users" where email_user = :email', {
                type: QueryTypes.SELECT,
                replacements: {email: body.email}
            }) 
            

            if(existingEmail[0].count == 1 && !user.email)
                return res.status(400).json({message: "Email is already use"})
            
            user.email = body.email
        }

        
        const hash = body.password != null ? await bcrypt.hash(body.password, 15) : null
       
        if (hash != null) {
            user.password = hash
        }
        

        if(body.picture != null)
            user.picture = body.picture

        await sequelize.query('update "Users" set name_user = :name, email_user = :email, pass_user= :password, picture_user = :picture where id_user = :id', {
            type: QueryTypes.UPDATE,
            replacements: {
                id,
                name: user.name,
                email: user.email,
                password: user.password,
                picture: user.picture
            }
        })
        res.status(201).json({
            message: 'Profil update successfully',
            user
        })
    } catch (err) {
        res.json(500).json({message: "Server error fetching user profile", error: err.message})
    }
}
//US5
exports.createTeams = async (req, res) => {
    try {
        const { idUser, name } = req.body
        if(!idUser || !name)
            return res.status(401).json({message: "Please provide the information asked for"})
    
        const existingUser = await sequelize.query('select count(*) from "Users" where id_user= :idUser', {type: QueryTypes.SELECT, replacements:{idUser}})
        console.log(existingUser[0].count )
        if(existingUser[0].count != 1)
            return res.status(404).json({message: "User not found"})
    
            await sequelize.query('insert into "Teams"(name_team, fk_id_user) values (:name, :idUser)', {type: QueryTypes.INSERT, replacements:{name, idUser}})
    
        const query = await sequelize.query('select * from "Teams" where name_team = :name', {type:QueryTypes.SELECT, replacements: {name}})
        const team = query[0]
    
        res.status(201).json({
            message: "Congratulation, your team is created !",
            team
        })
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}
//US7 - Add player
exports.addPlayer = async (req, res) => {
    try {
        const { idCaptain, idPlayer} = req.body
        const idTeam = req.params.id
        const existingTeam = await sequelize.query('select count(*), fk_id_user as id_captain from "Teams" where id_team = :idTeam group by id_team', {type:QueryTypes.SELECT, replacements: {idTeam}})
        const team = existingTeam[0]
        if(team.count !=1)
            return res.status(404).json({message: "Team not found"})
        if(team.id_captain != idCaptain)
            return res.status(403).json({message: "Not authorized"})
        const existingPlayer = await sequelize.query('select count(id_user) from "Users" where id_user= :idPlayer',{type: QueryTypes.SELECT, replacements:{ idPlayer }})
        if(existingPlayer[0].count != 1)
            return res.status(404).json({message: "User not found"})
    
        await sequelize.query('insert into "Teams_has_Users"(fk_id_team, fk_id_user) values (:idTeam, :idPlayer)', {type: QueryTypes.INSERT, replacements:{idTeam, idPlayer}})
    
        const queryTeam = await sequelize.query('select t.name_team, u.name_user from "Teams" as t inner join "Teams_has_Users" as tu on t.id_team = tu.fk_id_team inner join "Users" as u on tu.fk_id_user = u.id_user where t.id_team = :idTeam', {type: QueryTypes.SELECT, replacements: {idTeam}})
    
        const fullTeam = queryTeam[0]
        res.status(200).json({message: "Player has been add", fullTeam})
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}
//US6
exports.joinTeam = async (req, res) => {
    try {
        const {idPlayer, idTeam} = req.body

        const existingTeam = await sequelize.query('select count(*), fk_id_user as id_captain, name_team as name from "Teams" where id_team = :idTeam group by id_team', {type:QueryTypes.SELECT, replacements: {idTeam}})
        const team = existingTeam[0]
        if(team.count !=1)
            return res.status(404).json({message: "Team not found"})

        const existingPlayer = await sequelize.query('select count(id_user) from "Users" where id_user= :idPlayer',{type: QueryTypes.SELECT, replacements:{ idPlayer }})
        if(existingPlayer[0].count != 1)
            return res.status(404).json({message: "User not found"})
    
        const isPlayerInTeam = await sequelize.query('select count(*) from "Teams_has_Users" where fk_id_team = :idTeam and fk_id_user = :idPlayer', {type: QueryTypes.SELECT, replacements:{idTeam, idPlayer}})
        if(isPlayerInTeam[0].count !=0)
            return res.status(401).json({message: "You are already in the team"})

        await sequelize.query('insert into "Teams_has_Users"(fk_id_team, fk_id_user) values (:idTeam, :idPlayer)', {type: QueryTypes.INSERT, replacements:{idTeam, idPlayer}})
    
        res.status(200).json({message: `You have been add to ${team.name}` })
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}
// US7 - delete player
exports.removePlayer = async (req, res) => {
    try {
        const { idCaptain, idPlayer} = req.body
        const idTeam = req.params.id
    
        const existingTeam = await sequelize.query('select count(*), fk_id_user as id_captain from "Teams" where id_team = :idTeam group by id_team', {type:QueryTypes.SELECT, replacements: {idTeam}})
        const team = existingTeam[0]
    
        if(team.count !=1)
            return res.status(404).json({message: "Team not found"})
    
        if(team.id_captain != idCaptain)
            return res.status(403).json({message: "Not authorized"})
    
        const existingPlayer = await sequelize.query('select count(id_user) from "Users" where id_user= :idPlayer',{type: QueryTypes.SELECT, replacements:{ idPlayer }})
    
        if(existingPlayer[0].count != 1)
            return res.status(404).json({message: "User not found"})
        
        await sequelize.query('delete from "Teams_has_users" where fk_id_team = :idTeam and fk_id_user = :idUser', {type: QueryTypes.DELETE, replacements: { idTeam, idPlayer}})
        res.json({message: "Player has been removed from the team"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }

}