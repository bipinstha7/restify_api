const errors = require('restify-errors')
const rjwt = require('restify-jwt-community')
const config = require('../config')

const Customer = require('../models/Customer')

module.exports = server => {
	// Get Customers
	server.get('/customers', async (req, res, next) => {
		try {
			const customers = await Customer.find({})
			res.send(customers)
			next()
		} catch (err) {
			return next(new errors.InvalidContentError(err))
		}
	})

	// Add Customer
	server.post('/customers', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"))
		}

		// const { name, email, balance } = req.body

		// const customer = new Customer({
		//     name,
		//     email,
		//     balance
		// })

		try {
			// const newCustomer = await customer.save()
			await Customer.create(req.body)
			res.send(201)
			next()
		} catch (err) {
			return next(new errors.InternalError(err.message))
		}
	})

	// Get Single Customers
	server.get('/customers/:id', async (req, res, next) => {
		try {
			const customer = await Customer.findById(req.params.id)
			res.send(customer)
			next()
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no customer with id ${req.params.id}`))
		}
	})

	// Update Customer
	server.put('/customers/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"))
		}

		try {
			const customer = await Customer.findByIdAndUpdate(req.params.id, req.body)
			res.send(200)
			next()
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no customer with id ${req.params.id}`))
		}
	})

	// Delete Customer
	server.del('/customers/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
		try {
			const customer = await Customer.findByIdAndDelete(req.params.id)
			res.send(204)
			next()
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no customer with id ${req.params.id}`))
		}
	})
}
