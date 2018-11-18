const errors = require('restify-errors')
const bcrypt = require('bcryptjs')
const User  = require('../models/User')

module.exports = server => {
    // Register User
    server.post('/register', async (req, res, next) => {
        const { email, password} = req.body

        const user = { email, password }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                // Hash Password
                user.password = hash
                 
                // Save User
                try{
                    await User.create(user)
                    res.send(201)
                    next()
                } catch(err) {
                    return next(new errors.InternalError(err.message))
                }
            })
        })
    })
}