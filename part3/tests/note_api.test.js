const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Note = require('../models/note')
const { initialNotes, nonExistingId, notesInDb } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Note.deleteMany({})
    let noteObject = new Note(initialNotes[0])
    await noteObject.save()
    noteObject = new Note(initialNotes[1])
    await noteObject.save()
})

test('notes are returned as json', async () => {
    await api.get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
    console.log(response)
  
    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
})

test.only('a valid note can be added', async () => {

    content_string = 'async/await simplifies making async calls'
    const newNote = {
        content: content_string,
        important: true,
    }
    await api.post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const notesAtEnd = await notesInDb()
    assert.strictEqual(notesAtEnd.length, initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    assert(contents.includes(content_string))
})


test.only('note without content is not added', async () => {
    const newNote = {
        important: true
    }

    await api.post('/api/notes')
        .send(newNote)
        .expect(400)

    const notesAtEnd = await notesInDb()

    assert.strictEqual(notesAtEnd.length, initialNotes.length)
})

after(async () => {
    await mongoose.connection.close()
})