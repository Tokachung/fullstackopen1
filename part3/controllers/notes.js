const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

// First two routers use modern standard of async/await
notesRouter.get('/', async (request, response, next) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1})
  
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const note = await Note.findById(request.params.id)
  console.log('operation returned the following note: ', note)
  if (note) {
    response.json(note)
  }
  else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id 
  })

  const savedNote = await note.save() // Retrieving the raw mongodb document
  console.log('saved note is', savedNote)
  
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote) // toJSON transformation is applied 
})


notesRouter.delete('/:id', async (request, response, next) => {

  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedBlog)
})

module.exports = notesRouter