const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Note = require('../models/note')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Note.deleteMany({})
    let noteObject = new Note(helper.initialNotes[0])
    await noteObject.save()
    noteObject = new Note(helper.initialNotes[1])
    await noteObject.save()
    console.log('populated db')
})

test('notes are returned as json', async () => {
    await api.get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
    console.log(response)
  
    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
})

test('a valid note can be added', async () => {

    content_string = 'async/await simplifies making async calls'
    const newNote = {
        content: content_string,
        important: true,
    }
    await api.post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    assert(contents.includes(content_string))
})


test('note without content is not added', async () => {
    const newNote = {
        important: true
    }

    await api.post('/api/notes')
        .send(newNote)
        .expect(400)

    const notesAtEnd = await helper.notesInDb()

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()

    const notesToView = notesAtStart[0]
    console.log('id', notesToView.id)
    console.log('notes at start', notesAtStart)

    const resultNote = await api
        .get(`/api/notes/${notesToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    console.log('result note', resultNote)
    
    assert.deepStrictEqual(resultNote.body, notesToView)
})

test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToDelete = notesAtStart[0]

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)
    
    const notesAtEnd = await helper.notesInDb()

    const contents = notesAtEnd.map(r => r.content)
    assert(!contents.includes(noteToDelete.content))

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})

after(async () => {
    await mongoose.connection.close()
})