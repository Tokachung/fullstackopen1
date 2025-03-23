const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    console.log('secret is', process.env.SECRET)

    const user = await User.findOne({ username }) // Search for user from database
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash) // Check the password against password hash

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    console.log('user is', user)

    const userForToken = {
        username: user.username,
        id: user._id,
        name: user.name
    }

    // Set an expiry for the token of 3600 seconds (1 hour)
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

    console.log('token is', token)
    console.log('user for token is', userForToken)
    
    response.status(200).send({ token, username: user.username, name: user.name })

})

module.exports = loginRouter