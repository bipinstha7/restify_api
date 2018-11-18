const restify = require('restify')
const mongoose = require('mongoose')
const config = require('./config')
// const rjwt = require('restify-jwt-community')

const server = restify.createServer()

// Middleware
server.use(restify.plugins.bodyParser())

// Protect Routes
// Protect all routes other than '/auth' 
// server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/auth']}))
// or it can be done in to only those routes which we want to protect as using it in the respective routes

server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true})
})

const db = mongoose.connection

db.on('error', err => console.log(err))

db.once('open', () => {
    require('./routes/customers')(server)
    require('./routes/users')(server)
    console.log(`Server started on port ${config.PORT}`)
})