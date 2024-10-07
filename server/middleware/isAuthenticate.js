const {verifyToken} = require('../helpers/jwt')
const {User} = require('../models')

async function isAuthenticate(req,res,next) {
    try {
        let access_token =req.headers.authorization
        if (!access_token) {
            throw {name:'invalid-tokena'}
        }
        let [Bearer, token] = access_token.split(' ')
        if (Bearer !== 'Bearer') {
            throw {name:'invalid-tokenb'}
        }
        let payload = verifyToken(token)
        // console.log(payload,'payload');
        let user = await User.findByPk(payload.id)
        // console.log(user,'user');
        if (!user) {
            throw {name:'invalid-tokenc'}
        }
        // console.log(user,'user');
        req.user = {
            id:user.id
        }
        next()
    } catch (error) {
        // console.log(error);
        next(error)
    }
}
module.exports = isAuthenticate