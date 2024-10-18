const express = require('express') // Using express instead of http
const app = express() // Creating an express app
const cors = require('cors')
const Note = require('./models/note') // Import the Note model from the note.js file

// Use json parser to access data
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))



require('dotenv').config()

const PORT = process.env.PORT

// Make a post request to the /api/notes route
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content == undefined) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false, // If the important field is missing, the important field will be set to false
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

// The code below defines two routes for the app. Thie first one defines an event handler to handle HTTP GET request made to the root.
// The second one defines an event handler to handle HTTP GET request made to the /api/notes route.

// When we call the get method, we pass two parameters to it. The first parameter is the route, and the second parameter is the event handler function.
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// Using Mongoose findById method
// If no matching object is found, the value of note will be null.
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })
  .catch(error => next(error))
})

// Using Mongoose findById method to delete a note
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end() // Send a 204 status code if the note is deleted
    console.log('Deleted')
  })
  .catch(error => next(error)) // If there is an error, pass it to the error handler
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// Create a PUT request to update the important field of a note
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body // Get the body of the request

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})



// Now that everything is set up, we can start placing the error handling middleware at the end of the file.
