const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response, next) => {
    try {
        console.log('parsing body', request.body)
        const { username, name, password } = request.body
    
        const user = new User({
            username: username,
            name: name,
            passwordHash: await bcrypt.hash(password, 10)
        })
    
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (error) {
        // Check for MongoDB duplicate key error (E11000)
        if (error.code === 11000) {
            return response.status(400).json({ error: 'Username must be unique' })
        }
    }

})

usersRouter.post('/', async (request, response, next) => {

    console.log('parsing body', request.body)
    const { username, name, password } = request.body

    // Ensure required fields are provided
    if (!username || !password) {
        return response.status(400).json({ error: 'Username and password are required' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})


usersRouter.get('/', async (request, response, next) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = usersRouter