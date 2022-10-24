import React, { useEffect, useState } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useElapsedTime } from "use-elapsed-time";

export default function App() {

  //SET NEW DICES GENERATED
  const [dice, setDice] = useState(newDices())

  function generateDie() {
    return {
      value: randomDice(),
      isHeld: false,
      id: nanoid()
    }
  }

  function newDices() {
    const newestDice = []
    for (let i = 0; i < 10; i++) {
      newestDice.push(generateDie())
    }
    return newestDice
  }

  const genDices = dice.map(die =>
    <Die
      value={die.value}
      key={die.id}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />)

  //GENERATE A NEW NUMBER FOR THE DIE
  function randomDice() {
    return Math.ceil(Math.random() * 6)
  }

  //ELAPSED TIME COUNT
  const [time, setTime] = useState(false)
  const { elapsedTime, reset: resetTime } = useElapsedTime({ isPlaying: time })

  //REROLL THE DICES THAT ARE NOT HOLD and COUNT THE TIMES ROLLED
  const [count, setCount] = useState(0)
  
  function reRoll() {
    if (win === false){
      setCount((prevCount) => prevCount + 1)
      setTime(true)
      setDice(prevDice => prevDice.map(die => {
        return die.isHeld ? die : generateDie()
        })
      )
    }else{
      setCount(0)
      setTime(false)
      setWin(false)
      resetTime()
      setDice(newDices())
    }
  }

  //FLIP THE isHeld VALUE AND HOLD A DICE
  function holdDice(id) {
    setDice(prevDice => {
      const holdDice = []
      for (let i = 0; i < prevDice.length; i++) {
        const currentDice = prevDice[i]
        if (currentDice.id === id) {
          const updatedDice = {
            ...currentDice,
            isHeld: !currentDice.isHeld
          }
          if(win !== true){
            setTime(true)
          }
          holdDice.push(updatedDice)
        } else {
          holdDice.push(currentDice)
        }
      }
      return holdDice
    })
  }

  //VERIFY THE WIN CONDITIONS
  const [win, setWin] = useState(false)

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSame = dice.every(die => die.value === firstValue)
    if(allSame && allHeld){
      setWin(true)
      setTime(false)
    }
  }, [dice])
  
  //RESIZE THE CONFETTI SIZE TO FIT THE SCREEN
  const [windowSize, setWindowSize] = useState({
    width: "",
    height: "",
  })

  useEffect(() => {
    function handleReSize(){
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener("resize", handleReSize)
    handleReSize()
    return () => window.removeEventListener("resize", handleReSize)
  }, [])
  
  const confettiStyles = {
    height: windowSize.height,
    width: windowSize.width,
  }

  //CODE RETURNED TO THE APP
  return (
    <main>
      { 
        win ? 
        <Confetti 
          style={confettiStyles}
          initialVelocityY={20}
          numberOfPieces={250}
          className="confetti"
        /> 
        : " "
      }
      <div className="main--game">
        <h1 className="tittle"> Tenzies Game </h1>
        <p className="description">
          Roll until all dice are the same.
          Click each die to freeze it at it's current value between rolls.
        </p>
        <div className="dice--container">
          {genDices}
        </div>
        <button className="reRoll--button" onClick={reRoll}>
          {win ? "Reset Game" : "ROLL"}
        </button>
        <div className="infos">
          <p className="match--tittle"> ACTUAL SCORE </p>
          <div className="match--status">
            <p>Times Rolled: {count}</p>
            <p>Time Elapsed: {elapsedTime.toFixed(2)}s</p>
          </div>
        </div>
      </div>
    </main>
  )
}
