import React, { useState, useEffect } from "react"
import { toBit } from "./utils"
import "./App.css"
import Tone from "tone"

const polySynth = new Tone.PolySynth(8, Tone.Synth).toMaster()

const initNotes = [
  ["C4", 0],
  ["D4", 0],
  ["E4", 0],
  ["F4", 0],
  ["G4", 0],
  ["A4", 0],
  ["B4", 0],
  ["C5", 0]
]

function SynthButton(props) {
  props.bit
    ? polySynth.triggerAttack([props.note])
    : polySynth.triggerRelease([props.note])

  return (
    <button style={props.style} onClick={() => props.toggleBit(props.note)}>
      {props.bit}
    </button>
  )
}

const App = () => {
  const [notes, setNotes] = useState(initNotes)

  const toggleBit = targetNote => {
    const newNotes = notes.map(([note, bit], i) => {
      note === targetNote && (bit = Math.abs(bit - 1))
      return [note, bit]
    })

    setNotes(newNotes)
  }

  const shiftLeft = () => {
    const bits = parseInt(notes.map(([, bit]) => bit).join(""), 2)
    console.log({ bits })

    const newBits = bits << 1
    let stringBits = toBit(newBits, 8).substring(2)
    stringBits.length > 8 && (stringBits = stringBits.substring(1))
    console.log({ stringBits })
    const newNotes = notes.map(([note], i) => [note, +stringBits[i]])
    console.log(newNotes)
    setNotes(newNotes)
  }

  const arithmeticShiftRight = () => {
    let bitsString = notes.map(([, bit]) => bit).join("")
    let newBits = (parseInt(bitsString, 2) >> 1).toString(2)

    if (newBits.length < 8)
      newBits =
        Array.from({ length: 8 - newBits.length })
          .map(() => bitsString[0])
          .join("") + newBits

    console.log({ newBits })
    const newNotes = notes.map(([note], i) => [note, +newBits[i]])
    // console.log(newNotes)
    setNotes(newNotes)
  }

  const shiftRight = () => {
    const bits = parseInt(notes.map(([, bit]) => bit).join(""), 2)
    console.log({ bits })

    const newBits = bits >>> 1
    const stringBits = toBit(newBits, 8).substring(2)
    console.log({ stringBits })
    const newNotes = notes.map(([note], i) => [note, +stringBits[i]])
    // console.log(newNotes)
    setNotes(newNotes)
  }
  const invert = () => {
    let bits = parseInt(notes.map(([, bit]) => bit).join(""), 2)
    console.log({ bits })

    let newBits = ~bits
    newBits < 0 && (newBits += 256)

    console.log({ newBits })
    const stringBits = toBit(newBits, 8).substring(2)
    console.log({ stringBits })
    const newNotes = notes.map(([note], i) => [note, +stringBits[i]])
    // console.log(newNotes)
    setNotes(newNotes)
  }

  const leftShift = "<<"
  const rightShift = ">>"
  const arithmeticRightShift = ">>>"
  return (
    <>
      <div style={{ fontFamily: "monospace" }}>{`0b${notes
        .map(([, bit]) => bit)
        .join("")}`}</div>
      <button onClick={shiftLeft}>{leftShift}</button>
      {notes.map(([note, bit]) => {
        return (
          <SynthButton
            toggleBit={toggleBit}
            key={note}
            note={note}
            bit={bit}
            style={{ width: "30px" }}
          />
        )
      })}
      <button onClick={arithmeticShiftRight}>{arithmeticRightShift}</button>
      <button onClick={shiftRight}>{rightShift}</button>
      <div>
        <button onClick={invert}>~</button>
      </div>
      <hr />
      <div style={{ fontFamily: "monospace", fontSize: ".75rem" }}>
        {arithmeticRightShift} fills left with current 1st bit (one or zero)
      </div>
      <div style={{ fontFamily: "monospace", fontSize: ".75rem" }}>
        {rightShift} fills left with zeroes (always zero)
      </div>
    </>
  )
}

export default App

/*
["C4", 0b10000000, false],
  ["D4", 0b01000000, false],
  ["E4", 0b00100000, false],
  ["F4", 0b00010000, false],
  ["G4", 0b00001000, false],
  ["A4", 0b00000100, false],
  ["B4", 0b00000010, false],
  ["C5", 0b00000001, false]
  */
