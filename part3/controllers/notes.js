const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

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
  
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid'})
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user._id 
  })

  const savedNote = await note.save() // Retrieving the raw mongodb document
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