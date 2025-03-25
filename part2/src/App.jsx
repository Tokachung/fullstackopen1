import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import './index.css'
import loginService from './services/login'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

// Now instead of giving notes as a prop from main, we are defining it within app as an axios call.
const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) // This is the user object once returned from the db
  const [errorMessage, setErrorMessage] = useState(null) // This is to hold the error message
  const noteFormRef = useRef()

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
    let loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    loggedUserJSON = null
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // Login related
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token) 
      
      setUser(user) 
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel='login' >
          <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
      
        </Togglable>
      </div>
    )
  }
  
  // Adding a note new note and display new notes.
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })    
  }

  const noteForm = () => {
    return(
      <div>
        <Togglable buttonLabel='new note' ref={noteFormRef}>
          <NoteForm createNote={addNote} />
        </Togglable>
      </div>
    )
  }

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

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {user === null ? loginForm() : 
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