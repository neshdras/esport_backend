const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../config/database')
const { QueryTypes } = require('sequelize')

const JWT = process.env.JWT_SECRET
const JWT_EXPIRE = '24h'

const generateToken = (id) =>{
    return jwt.sign({id}, JWT, {
        expiresIn: JWT_EXPIRE
    })
}

//US1
exports.register = async (req, res) => {
    try {
        const { name, email, password} = req.body
        const picture = req.body.picture ?? null
        const role = req.body.role ?? 2
        const existingUser = await sequelize.query('SELECT COUNT(email_user) FROM "Users" WHERE email_user = :email', {
            type: QueryTypes.SELECT,
            replacements: { email}
        }) 
        if(existingUser[0].count == 1)
            return res.status(400).json({message: 'Email is already use'})
        const isPasswordOk = validator.isStrongPassword(password,{
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        if(!isPasswordOk)
            return res.status(400).json({ message: 'The password need to contain 1 lower, 1 upper, 1 number and 1 symbol and must be at least 6 characters long'})
        const isEmailOk = validator.isEmail(email)
        if(!isEmailOk)
            return res.status(400).json({message: "Please provide a valid email"})
        const isRoleOk = role === 1 || role === 2
        if(!isRoleOk)
            return res.status(400).json({message: "Please provide a valid role"})

        const hash = await bcrypt.hash(password, 15)

        await sequelize.query('INSERT INTO "Users"(name_user, email_user, pass_user, picture_user, fk_id_role) VALUES (:name, :email, :password, :picture, :role) ', {
            type: QueryTypes.INSERT,
            replacements:{name, email, password: hash, picture, role}
        })
        const userQuery = await sequelize.query('SELECT * FROM "Users" WHERE email_user = :email', {
            type: QueryTypes.SELECT,
            replacements: { email }
        })
        const user = userQuery[0]
        const token = generateToken(user.id_user)
        res.status(201).json({
            message: 'User create successfully',
            token,
            user
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}
//US2
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if(!email || !password)
            return res.status(400).json({message: "Please provide the information ask"})
        const userQuery = await sequelize.query('SELECT *,COUNT(email_user) FROM "Users" WHERE email_user = :email GROUP BY id_user', {
            type: QueryTypes.SELECT,
            replacements: {email}
        })
        const user = userQuery[0]

        if(user.count == 0)
            return res.status(401).json({message: "Invalid credentials"})
        const isMatch = await bcrypt.compare(password, user.pass_user)
        if(!isMatch)
            return res.status(401).json({message: 'Invalid credentials'})
        const token = generateToken(user.id_user)
        res.status(201).json({
            message: "Login succesfully",
            token,
            user: {
                id: user.id_user,
                name: user.name_user,
                email: user.email_user,
                picture: user.picture_user,
                role: user.fk_id_role,
            }
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}