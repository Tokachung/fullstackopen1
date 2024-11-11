// Testing mongodb connection

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.ituty.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// Define the schema for the Note model
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// Create a model for the Note schema
const Note = mongoose.model('Note', noteSchema)

// Create a new note using the Note model
const note = new Note({
  content: 'HTML is easy',
  important: true,
})

// Save the note to the database.
note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})

