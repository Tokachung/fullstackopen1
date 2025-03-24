import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import './index.css'
import loginService from './services/login'
import Footer from './components/Footer'

// Now instead of giving notes as a prop from main, we are defining it within app as an axios call.
const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) // This is the user object once returned from the db
  const [errorMessage, setErrorMessage] = useState(null) // This is to hold the error message

  // Create a helper function to generate the form
  const loginForm = () => {
    return (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
    );
  }

  const noteForm = () => {
    return (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange}/>
      <button type="submit">save</button>
    </form>
    );
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    // Attempt to log in the user by sending credentials to the backend via the login service
    try {
      const user = await loginService.login({
        username, password
      })
      
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      // After successful login, store the valid JWT token in noteService for authenticated requests
      noteService.setToken(user.token) 
      
      setUser(user) // Update the application's user state

      // Clear the fields in the login table
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes=> {
        setNotes(initialNotes)
      })
      .catch(error => {
        console.log('fail')
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const toggleImportanceOf = (id) => {

    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote=> {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
    })
    .catch(error => {
      console.log('the error was', error)
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  
  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1)
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })    
  }

  const handleNoteChange = (event) => {
    console.log(event.target)
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {user === null ? 
        loginForm() : 
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>  
      } 


      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
          key={note.id} 
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      
    <Footer/> 
    </div>
    
  )
}

export default App