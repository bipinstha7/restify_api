const bcrypt = require('bcryptjs')
const mongoose =require('mongoose')
const User = require('./models/User')

exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try{
            // Get user by email
            const user = await User.findOne({email})

            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err
                if (isMatch) {
                    resolve(user)
                } else {
                    // Password didn't match
                    reject('Incorrect Email / Password combinaton')
                }
            })
        } catch(err) {
            // Email not found
            reject('Incorrect Email / Password combinaton')
        }
    })
}