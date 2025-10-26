
import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { Deco } from './components/Deco'
import { Level } from './components/Level'
import { Button } from './components/Button'

const levels = [
  {
    name: 'LEVEL 1',
    id: 'level-1',
    key: 1
  },
  {
    name: 'LEVEL 2',
    id: 'level-2',
    key: 2
  },
  {
    name: 'LEVEL 3',
    id: 'level-3',
    key: 3
  },
  {
    name: 'LEVEL 4',
    id: 'level-4',
    key: 4
  },
  {
    name: 'LEVEL 5',
    id: 'level-5',
    key: 5
  }
]

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const numbers = [
  {
    number: 1,
    id: 1,
    keytrigger: '1',
    key: 1,
    src: 'src/assets/sounds/sound1.mp3'
  },
  {
    number: 2,
    id: 2,
    keytrigger: '2',
    key: 2,
    src: 'src/assets/sounds/sound2.mp3'
  },
  {
    number: 3,
    id: 3,
    keytrigger: '3',
    key: 3,
    src: 'src/assets/sounds/sound3.mp3'
  },
  {
    number: 4,
    id: 4,
    keytrigger: '4',
    key: 4,
    src: 'src/assets/sounds/sound4.mp3'
  },
  {
    number: 5,
    id: 5,
    keytrigger: '5',
    key: 5,
    src: 'src/assets/sounds/sound5.mp3'
  },
  {
    number: 6,
    id: 6,
    keytrigger: '6',
    key: 6,
    src: 'src/assets/sounds/sound6.mp3'
  },
  {
    number: 7,
    id: 7,
    keytrigger: '7',
    key: 7,
    src: 'src/assets/sounds/sound7.mp3'
  },
  {
    number: 8,
    id: 8,
    keytrigger: '8',
    key: 8,
    src: 'src/assets/sounds/sound8.mp3'
  },
  {
    number: 9,
    id: 9,
    keytrigger: '9',
    key: 9,
    src: 'src/assets/sounds/sound9.mp3'
  }
]

export interface NumberItem {
  number: number
  id: number
  keytrigger: string
  key: number
  src: string
}

export function App() {
  const [level, setLevel] = useState('')
  const [playing, setPlaying] = useState(false)
  const [display, setDisplay] = useState('select a level and play!')
  const [currentSequence, setCurrentSequence] = useState<number[]>([])
  const [input, setInput] = useState(false)
  const [userInput, setUserInput] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [selectNext, setSelectNext] = useState(false)

  const soundWinRef = useRef(new Audio('src/assets/sounds/win.mp3'))
  const soundLooseRef = useRef(new Audio('src/assets/sounds/loose.mp3'))

  //Select Level
  function selectLevel(level: string): void {
    if (
      !playing &&
      display !== 'game over' &&
      display !== 'great job! congratulations!!'
    ) {
      setLevel(level)
      setDisplay(level) 
    }
  }

  //Random Sequence
  function getRandomNumber() {
    return Math.floor(Math.random() * digits.length + 1)
  }

  const makeSequence = useCallback((length: number): number[] => {
    const currentSequence: number[] = []
    for (let i = 0; i < length; i++) {
      currentSequence.push(getRandomNumber())
    }
    return currentSequence
  }, [])

  function lengthLevel(level: string): number {
    switch (level) {
      case 'LEVEL 1':
        return 4
      case 'LEVEL 2':
        return 5
      case 'LEVEL 3':
        return 6
      case 'LEVEL 4':
        return 7
      case 'LEVEL 5':
        return 8
      default:
        return 0
    }
  }

  const setSequence = useCallback(
    (level: string): number[] => {
      const sequenceLength = lengthLevel(level)
      const sequence = makeSequence(sequenceLength)
      return sequence
    },
    [makeSequence]
  )

  useEffect(() => {
    setCurrentSequence(setSequence(level))
  }, [setSequence, level])

  //Controls
  function lightControls(id: string): void {
    const control = document.getElementById(id)
    control?.classList.add('active')
  }

  function lightOffControls(id: string): void {
    const control = document.getElementById(id)
    control?.classList.remove('active')
  }

  //Disable level buttons while playing
  function disableLevelButtons(disable: boolean): void {
    const levels = document.querySelectorAll('.level')
    levels.forEach(level => level.classList.toggle('disabled', disable))
  }

  useEffect(() => {
    if (level && !playing) {
      lightControls('play')
    }
    if (playing) {
      lightOffControls('play')
      lightOffControls('next')
      lightOffControls('reload')
      disableLevelButtons(true)
    }
    if (selectNext) {
      lightControls('next')
    }
    if (display === 'game over' || display === 'great job! congratulations!!') {
      lightControls('reload')
      lightOffControls('next')
    }
    if (display === 'select a level and play!') {
      lightOffControls('reload')
      lightOffControls('next')
      disableLevelButtons(false)
    }
  }, [level, playing, selectNext, display])

  //Play sounds

  function playSound(src: string): void {
    const sound = new Audio(src)
    sound.preload = 'auto'
    sound.currentTime = 0
    sound.play()
  }

  const playSequenceSounds = useCallback((currentSequence: number[]): void => {
    numbers.forEach((number: NumberItem) => {
      for (let i = 0; i < currentSequence.length; i++) {
        if (currentSequence[i] === number.id) {
          setTimeout(() => {
            playSound(number.src)
          }, i * 750)
        }
      }
    })
  }, [])

  //Play win loose
  interface AudioRef {
    current: HTMLAudioElement
  }

  const playWinLoose = useCallback((audioref: AudioRef): void => {
    audioref.current.currentTime = 0
    audioref.current.play()
  }, [])

  //Pause sound
  function pauseSound(audioref: AudioRef): void {
    audioref.current.currentTime = 0
    audioref.current.pause()
  }

  //Play sequence
  function playSequence() {
    if (level && !playing && !input && !selectNext) {
      setPlaying(true)
      lightBtns(currentSequence)
      playSequenceSounds(currentSequence)
      setInput(true)
    }
  }

  //Light buttons
  function lightBtns(arr: number[]) {
    return numbers.filter(function (number) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === number.id) {
          const num = document.getElementById(number.id.toString())

          setTimeout(() => {
            lightBtn(num)
          }, 750 * i)
        }
      }
      return false
    })
  }

  interface NumberElement extends HTMLElement {
    classList: DOMTokenList
  }

  function lightBtn(num: NumberElement | null): void {
    if (num) {
      num.classList.add('light')
      setTimeout(() => {
        lightOff(num)
      }, 350)
    }
  }

  function lightOff(num: NumberElement | null): void {
    if (num) {
      num.classList.remove('light')
    }
  }

  //Handleclick
  function updateInput(val: number) {
    if (input) {
      setUserInput(userInput.concat(val))
      const num = document.getElementById(val.toString())
      lightBtn(num)
    }
  }

  function setPlay(val1: number, val2: string) {
    if (input) {
      updateInput(val1)
      playSound(val2)
    }
    return
  }

  //Check sequence
  const checkSequence = useCallback(
    (currentSequence: number[], userInput: number[]) => {
      if (currentSequence.length > 0 && input) {
        if (currentSequence.length > userInput.length) {
          for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === currentSequence[i]) {
              return
            } else {
              setInput(false)
              setPlaying(false)
              setDisplay('game over')
              setLevel('')
              setTimeout(() => {
                playWinLoose(soundLooseRef)
              }, 700)
            }
          }
        } else if (currentSequence.length === userInput.length) {
          if (
            userInput[userInput.length - 1] ===
            currentSequence[currentSequence.length - 1]
          ) {
            setScore((score) => score + 1)
            setDisplay('press next')
            setInput(false)
            setSelectNext(true)
            setCurrentSequence(setSequence(level))
            setUserInput([])
          } else {
            setInput(false)
            setPlaying(false)
            setDisplay('game over')
            setLevel('')
            setTimeout(() => {
              playWinLoose(soundLooseRef)
            }, 700)
          }
        }
      }
    },
    [input, level, setSequence, playWinLoose]
  )

  useEffect(() => {
    checkSequence(currentSequence, userInput)
  }, [checkSequence, currentSequence, userInput])

  //Next
  function next() {
    if (selectNext) {
      lightBtns(currentSequence)
      playSequenceSounds(currentSequence)
      setInput(true)
      setSelectNext(false)
      setDisplay(level)
    }
  }

  //Reload
  function reload() {
    setUserInput([])
    setLevel('')
    setPlaying(false)
    setDisplay('select a level and play!')
    setInput(false)
    setScore(0)
    setSelectNext(false)
    pauseSound(soundLooseRef)
    pauseSound(soundWinRef)
  }

  //Score
  const checkScore = useCallback(
    (score: number): void => {
      if (score === 3) {
        setCurrentSequence([])
        setUserInput([])
        setLevel('')
        setPlaying(false)
        setDisplay('great job! congratulations!!')
        setInput(false)
        setSelectNext(false)
        setTimeout(() => {
          playWinLoose(soundWinRef)
        }, 500)
      }
    },
    [playWinLoose]
  )

  useEffect(() => {
    checkScore(score)
  }, [checkScore, score])

  return (
    <div className='container-fluid prevent-select'>
      <div className='container'>
        <Deco
          position={'up'}
          rect1={'rect-1'}
          rect2={'rect-2'}
        />
        <div className='row screen'>
          <span id='display'>{display}</span>
        </div>
        <div className='row levels'>
          {levels.map((level) => {
            return (
              <Level
                key={level.key}
                level={level}
                handleClick={() => selectLevel(level.name)}
              />
            )
          })}
        </div>
        <div className='row controls'>
          <div
            className='col reload'
            onClick={reload}
            id='reload'
          >
            reload
          </div>
          <div
            className='col play'
            id='play'
            onClick={() => playSequence()}
          >
            play
          </div>
          <div
            className='col next'
            id='next'
            onClick={next}
          >
            next
          </div>
        </div>
        <div className='row keys-container'>
          <div className='keys '>
            {numbers.map((number) => {
              return (
                <Button
                  key={number.key}
                  number={number}
                  handleClick={() => setPlay(number.id, number.src)}
                />
              )
            })}
          </div>
          <div className='row score'>
            <h4>
              score :<span id='score'>{score}</span>
            </h4>
          </div>
          <Deco
            position={'down'}
            rect1={'rect-3'}
            rect2={'rect-4'}
          />
        </div>
      </div>
    </div>
  )
}

export default App
