import React, { useState } from "react"
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
    const newNotes = notes.map(([note, bit]) =>
      note !== targetNote ? [note, bit] : [note, -(bit - 1)]
    )

    setNotes(newNotes)
  }

  const clamp = length => (bits, fill = 0) => {
    const stringBits = bits.toString(2)

    return stringBits.length === length
      ? stringBits
      : stringBits.length > length
      ? stringBits.substr(-length)
      : new Array(length - stringBits.length).fill(fill).join("") + stringBits
  }

  const shift = (fn, fill) => event => {
    const bits = parseInt(notes.map(([, bit]) => bit).join(""), 2)
    const newBits = fn(bits)
    const stringBits = clamp(8)(newBits, fill && [...clamp(8)(bits)][0])
    const newNotes = notes.map(([note], i) => [note, +stringBits[i]])
    setNotes(newNotes)
  }

  const leftShift = "<<"
  const signPropagatingRightShift = ">>"
  const zeroFillRightShift = ">>>"
  return (
    <>
      <div style={{ fontFamily: "monospace" }}>{`0b${notes
        .map(([, bit]) => bit)
        .join("")}`}</div>
      <button onClick={shift(bits => bits << 1)}>{leftShift}</button>
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
      <button onClick={shift(bits => bits >>> 1)}>{zeroFillRightShift}</button>
      <button onClick={shift(bits => bits >> 1, true)}>
        {signPropagatingRightShift}
      </button>
      <div>
        <button onClick={shift(bits => ~bits >>> 0)}>~</button>
      </div>
      <hr />

      <div style={{ fontFamily: "monospace", fontSize: ".75rem" }}>
        {zeroFillRightShift} fills left with zeroes (always zero)
      </div>
      <div style={{ fontFamily: "monospace", fontSize: ".75rem" }}>
        {signPropagatingRightShift} fills left with current 1st bit (one or
        zero)
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
