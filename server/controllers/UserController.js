const { User } = require('../models')
const { hashPassword,comparePassword } = require('../helpers/bcrypt')
const { signToken,verifyToken } = require('../helpers/jwt')

class UserController {
    static async register(req, res, next) {
        const { fullName, email, password } = req.body
        try {
            console.log(req.body,'aaaa');
            if (!fullName || !email || !password) {
                throw {status : 400, message : 'All fields are required'}
            }
            const user = await User.create({ fullName, email, password })
            res.status(201).json(user)
        } catch (error) {
            next(error)
        }
    }
    static async login(req, res, next) {
        const { email, password } = req.body
        try {
            const user = await User.findOne({ where: { email } })
            if (!user) {
                throw {status : 400, message : 'Email/Password is incorrect'}
            }
            const isMatch = comparePassword(password, user.password)
            if (!isMatch) {
                throw {status : 400, message : 'Email/Password is incorrect'}
            }
            const token = signToken({ id: user.id })
            res.status(200).json({ token })
        } catch (error) {
            next(error)
        }
    }

    static async userLoginProfile(req, res, next) {
        const { id } = req.user
        try {
            const user = await User.findByPk(id)
            console.log(user,'useeeeerrrrrrr');
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController