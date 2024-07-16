import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const points = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0}

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(points)
  const [mostVoted, setMostVoted] = useState(0)

  const setAnecdote = () => {
    let anecdoteNumber = Math.floor(Math.random() * anecdotes.length)
    setSelected(anecdoteNumber)
  }

  const upvote = () => {
    const copy = {...votes}
    copy[selected] += 1
    console.log('copy is:', copy)
    setVotes(copy)
    computeMostVoted(copy)
  }

  function computeMostVoted(copy) {

    let values = Object.values(copy)
    console.log('values array is', values)
    let maxVotes = values[0]
    let maxVotesIndex = 0

    for (let i = 0; i < values.length; i++) {

      if (values[i] > maxVotes) {
        maxVotes = values[i]
        maxVotesIndex = i
      }
    }
    setMostVoted(maxVotesIndex)
  }

  return (
    <div>
      <h3>Anecdote of the day</h3>
      {anecdotes[selected]} 
        <br />has {votes[selected]} votes 
        <br />
      <button onClick={upvote}>vote</button>
      <button onClick={setAnecdote}>next anecdote</button>
      <h3>Anecdote with most votes</h3>
      {anecdotes[mostVoted]}
    </div>
  )
}

export default App