import React, { useCallback, useEffect, useRef} from 'react';
import { useState } from 'react';
import './App.css';
import Level from './components/Level';
import Button from './components/Button';

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
];
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const initialNumbers = [
  {
    number: 1,
    id: 1,
    keytrigger: '1',
    key: 1,
    src: './sounds/sound1.mp3'
  },
  {
    number: 2,
    id: 2,
    keytrigger: '2',
    key: 2,
    src: './sounds/sound2.mp3'
  },
  {
    number: 3,
    id: 3,
    keytrigger: '3',
    key: 3,
    src: './sounds/sound3.mp3'
  },
  {
    number: 4,
    id: 4,
    keytrigger: '4',
    key: 4,
    src: './sounds/sound4.mp3'
  },
  {
    number: 5,
    id: 5,
    keytrigger: '5',
    key: 5,
    src: './sounds/sound5.mp3'
  },
  {
    number: 6,
    id: 6,
    keytrigger: '6',
    key: 6,
    src: './sounds/sound6.mp3'
  },
  {
    number: 7,
    id: 7,
    keytrigger: '7',
    key: 7,
    src: './sounds/sound7.mp3'
  },
  {
    number: 8,
    id: 8,
    keytrigger: '8',
    key: 8,
    src: './sounds/sound8.mp3'
  },
  {
    number: 9,
    id: 9,
    keytrigger: '9',
    key: 9,
    src: './sounds/sound9.mp3'
  }
];


function App() {


  const  [numbers, setNumbers] = useState(initialNumbers);
  const [level, setLevel] = useState('');
  const [playing, setPlaying] = useState(false);
  const [display, setDisplay] = useState('select a level and play!');
  const [currentSequence, setCurrentSequence] = useState([]);
  const [input, setInput] = useState(false);
  const [userInput, setUserInput] = useState([]);
  const [score, setScore] = useState(0);
  const [selectNext, setSelectNext] = useState(false);
  //const  [soundOn, setSoundOn] = useState(true);

  const soundWinRef = useRef(new Audio('./sounds/win.mp3'));
  const soundLooseRef = useRef(new Audio('./sounds/loose.mp3'));


  //Select Level

  function selectLevel(level) {
    if (!playing && display !== 'game over' && display !== 'great job! congratulations!!') {
      setLevel(level);
      setDisplay(level);
    } 
  };

  //Random Sequence
  function getRandomNumber() {
    return Math.floor(Math.random() * digits.length + 1);
  };

  const makeSequence = useCallback((length) => {
    let currentSequence = [];
    for (let i = 0; i < length; i++) {
      currentSequence.push(getRandomNumber());
    }
    return currentSequence;
  }, []);

   function lengthLevel(level) {
    switch (level) {
      case 'LEVEL 1':
        return 4;
      case 'LEVEL 2':
        return 5;
      case 'LEVEL 3':
        return 6;
      case 'LEVEL 4':
        return 7;
      case 'LEVEL 5':
        return 8;
      default:
        return 0;
    }
  };

  const setSequence = useCallback((level) => {
    let sequenceLength = lengthLevel(level);
    let sequence = makeSequence(sequenceLength);
    return sequence;
  }, [makeSequence]);

  useEffect(() => {
    setCurrentSequence(setSequence(level));
  },  [setSequence,level]);


  //Controls

  function lightControls(id) {
    let num = document.getElementById(id);
    num.classList.add('active');
  };
  
  function lightOffControls(id) {
    let num = document.getElementById(id);
    num.classList.remove('active');
  };
  
  useEffect(() => {
    if(level && !playing) {
      lightControls('play');
    }
    if(playing) {
      lightOffControls('play');
      lightOffControls('next');
      lightOffControls('reload');
    }
    if(selectNext) {
      lightControls('next');
    }
    if (display === 'game over' || display === 'great job! congratulations!!') {
      lightControls('reload');
      lightOffControls('next');
    }
    if(display === 'select a level and play!') {
      lightOffControls('reload');
    }
  }, [level, playing, selectNext, display]);


    //Play sounds

    function playSound(src) {
      const sound = new Audio(src);
      sound.preload = 'auto';
      sound.currentTime = 0;
      sound.play();
    };
   

    const playSequenceSounds = useCallback((currentSequence)  => {
      numbers.forEach((number) => {
       for (let i = 0; i < currentSequence.length; i++) {
         if (currentSequence[i] === number.id) {
           setTimeout(() => {
             playSound(number.src)
           }, i * 750);
         }
       }
     })
   }, [numbers]);

  //Play win loose
  function playWinLoose(audioref) {
    audioref.current.currentTime = 0;
    audioref.current.play();
  };

  //Pause sound
  function pauseSound(audioref) {
    audioref.current.currentTime = 0;
    audioref.current.pause();
  };
  
  //Play sequence
  function playSequence() {
    if (level  && !playing && !input && !selectNext) {
      setPlaying(true);
      lightBtns(currentSequence);
      playSequenceSounds(currentSequence);
      setInput(true);
      
    }
  };
  
  //Light buttons
  function lightBtns(arr) {
    return numbers.filter(function(number)  {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === number.id) {
          let num = document.getElementById(number.id);
         
          setTimeout(() => {
            lightBtn(num);
          }, 750 * i);
        }
        
      }
      return false;
    })
  };

  function lightBtn(num) {
    num.classList.add('light');
    setTimeout(() => {
      lightOff(num);
    }, 350);
  };

  function lightOff(num) {
    num.classList.remove('light');
  };


  //Handleclick
  function updateInput(val) {
    if (input) {
      setUserInput(userInput.concat(val));
      let num = document.getElementById(val);
      lightBtn(num);
    }
  };

  function setPlay(val1, val2) {
    if (input) {
      updateInput(val1);
    playSound(val2);
    }
    return;
    
  };


   //Check sequence
  const checkSequence = useCallback((currentSequence, userInput) => {
    if (currentSequence.length > 0 && input) {
      if (currentSequence.length > userInput.length) {
        for (let i = 0; i < userInput.length; i++) {
          if (userInput[i] === currentSequence[i]) {
            //console.log('next');
          } else {
            setInput(false);
            setPlaying(false);
            setDisplay('game over');
            setLevel('');
            setTimeout(() => {
              playWinLoose(soundLooseRef);
            }, 700);
          }
        }
      } else if (currentSequence.length === userInput.length) {
        if (userInput[userInput.length - 1] === currentSequence[currentSequence.length - 1]) {
          //console.log(currentSequence[currentSequence.length - 1]);
          setScore(score =>score + 1);
          setDisplay('press next');
          setInput(false);
          setSelectNext(true);
          setCurrentSequence(setSequence(level));
          setUserInput([]);
        } else {
          setInput(false);
          setPlaying(false);
          setDisplay('game over');
          setLevel('');
          setTimeout(() => {
            playWinLoose(soundLooseRef);
          }, 700);
        }
      }
    }
  }, [input, level, setSequence]);

  useEffect(() => {
    checkSequence(currentSequence, userInput);
  }, [checkSequence,currentSequence, userInput]);


  //Next
  function next() {
    if (selectNext) {
      lightBtns(currentSequence);
      playSequenceSounds(currentSequence);
      setInput(true);
      setSelectNext(false);
      setDisplay(level);
    }
  };



  
  //Reload
  function reload() {
    setUserInput([]);
    setLevel('');
    setPlaying(false);
    setDisplay('select a level and play!');
    setInput(false);
    setScore(0);
    setSelectNext(false);
    pauseSound(soundLooseRef);
    pauseSound(soundWinRef);
    
    
  };

  //Score

  const checkScore = useCallback((score) => {
    if (score === 3) {
      setCurrentSequence([]);
      setUserInput([]);
      setLevel('');
      setPlaying(false);
      setDisplay('great job! congratulations!!');
      setInput(false);
      setSelectNext(false);
      setTimeout(() => {
        playWinLoose(soundWinRef);
      }, 500);
      
    }
  }, []);

  useEffect(() => {
    checkScore(score);
  }, [checkScore, score]);

  return (
    <div className="container-fluid prevent-select">
      <div className='container'>
        <div className='deco row up'>
          <div className='rect rect-1'></div>
          <div className='rect rect-2'></div>
        </div>
        <div className='row screen'>
          <span id='display'>{display}</span>
        </div>
        <div className='row levels'>
          {(levels.map((level) => {
            return (
              <Level key={level.key} level={level} handleClick={() => selectLevel(level.name)} />
            )
          }))}
        </div>
        <div className='row controls'>
          <div className='col reload' onClick={reload} id='reload' >reload</div>
          <div className='col play'  id='play' level={level} onClick={() => playSequence(level)} >play</div>
          <div className='col next' id='next' onClick={next}>next</div>
        </div>
        <div className='row keys-container'>
          <div className='keys '>
            {(numbers.map((number) => {
              return (
                <Button key={number.key} number={number} handleClick={() => setPlay(number.id, number.src)} />)
            }))}
          </div>
          <div className='row score'>
            <h4>score :<span id='score' >{score}</span></h4>
          </div>
          <div className='deco row down'>
            <div className='rect rect-3'></div>
            <div className='rect rect-4'></div>
          </div>
        </div>

      </div>


    </div>
  );
}

export default App;
