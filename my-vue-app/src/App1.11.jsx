import { useState } from 'react'

const StatisticLine = (props) => (<tr><td>{props.text} {props.value}</td></tr>)

const Statistics = (props) => {

  console.log(props)

  const total = props.goodCount + props.neutralCount + props.badCount

  const average = (props.goodCount - props.badCount) / total
  const positive = props.goodCount / total * 100

  if (!props.goodCount && !props.neutralCount && !props.badCount) {
    return (
    <>
    <h3>statistics</h3>
    <p>No feedback given</p>
    </>)
  }

  return (<>
    <h3>statistics</h3>
    <table>
      <tbody>
        <StatisticLine text="good" value={props.goodCount} />
        <StatisticLine text="neutral" value={props.neutralCount} />
        <StatisticLine text="bad" value={props.badCount} />
        <StatisticLine text="average" value={average} />
        <tr><td>positive {positive}%</td></tr>
      </tbody>
    </table>
    </>)
}

function App() {

  const [goodCount, setGoodCount] = useState(0)
  const [neutralCount, setNeutralCount] = useState(0)
  const [badCount, setBadCount] = useState(0)

  const handleGoodCount = () => {
    let updatedGoodCount = (goodCount + 1)
    setGoodCount(updatedGoodCount)
  }

  const handleNeutralCount = () => {
    let updatedNeutralCount = (neutralCount + 1)
    setNeutralCount(updatedNeutralCount)
  }

  const handleBadCount = () => {
    let updatedBadCount = (badCount + 1)
    setBadCount(updatedBadCount)
  }

  const Button = (props) => {
    return <button onClick={props.onClick}>{props.text}</button>
  }

  return (
    <div>
      <h3>give feedback</h3>
      <Button onClick={handleGoodCount} text="good"/>
      <Button onClick={handleNeutralCount} text="neutral"/>
      <Button onClick={handleBadCount} text="bad"/>
      <Statistics goodCount={goodCount} neutralCount={neutralCount} badCount={badCount}/>
    </div>
  )
}

export default App
