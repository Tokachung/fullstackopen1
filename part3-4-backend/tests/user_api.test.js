const { test, describe, beforeEach, after } = require('node:test')
const User = require('../models/user')
const helper = require('./test_helper')
const assert = require('node:assert')
mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

// Save one user into the db
describe('when there is already one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('password', 10)
        const user = new User({ username: 'root', passwordHash , name: 'root user'})
        
        await user.save()
        console.log('added new user')
    })
    

    test('creating a new user successfully adds the user', async () => {
        // Fetch the existing users
        usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'Allan Xu Gaming',
            user: 'Allan Xu',
            password: 'MarvelRivals123!'
        }

        await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

        usersAtEnd = await helper.usersInDb()

        const usernames = usersAtEnd.map(u => u.username)

        assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)
        assert(usernames.includes('Allan Xu Gaming'))
    })

    test.only('if username is already taken, does not add the user', async () => {
        usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            user: 'Amelia Smith',
            password: 'password1'
        }
        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)

        usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})

// Creating a new user successfully adds the user
