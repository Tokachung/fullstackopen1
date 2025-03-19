const Note = require('../models/note')

const initialNotes = [
    {
      content: 'HTML is easy',
      important: false,
      id: 1
    },
    {
      content: 'Browser can execute only JavaScript',
      important: true,
      id: 2
    }
]

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon'})
    await note.save()
    await note.deleteOne()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

module.exports = {
    initialNotes,
    nonExistingId,
    notesInDb
}