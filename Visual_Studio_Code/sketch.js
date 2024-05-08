let serial; 
let currentNumber = ""; 
let inputSequence = "";
let mistakes = 0; 
let maxMistakes = 3; 
let timer = 30; 
let correctCount = 0; 
let minTimer = 10; 
let checkImg, xImg; 
let dingSynth, backgroundMusic; 
let bgImage; 

function preload() {
  checkImg = loadImage('Images/Check.png'); 
  xImg = loadImage('Images/Failed.png'); 
  bgImage = loadImage('Images/Background.png'); 

}

function setup() {
  createCanvas(800, 600);
  noLoop(); 

  let startButton = createButton('Start Game');
  startButton.position(850, width/3);
  startButton.size(200, 50)
  startButton.mousePressed(startGame);

  connectButton = createButton('Connect to Arduino');
  connectButton.position(875, width/2.4);
  connectButton.size(150, 30)
  connectButton.mousePressed(connectSerial);

  serial = createSerial();
  initSounds();
}

function draw() {
  background(255);
  image(bgImage, 0, 0, width, height); 
  displayStatus();
  manageTimer();

  let data = serial.read();
  if (data.length > 0) {
      inputSequence += data.trim(); 
      if (inputSequence.length === currentNumber.length) {
          checkSequence(); 
      }
  }
}

function startGame() {
  loop(); 
  mistakes = 0; 
  correctCount = 0; 
  timer = 30; 
  generateNumber(); 
  displayStatus(); 
  backgroundMusic.start(); 
}


function manageTimer() {
  if (frameCount % 60 == 0 && timer > 0) {
      timer--;
      if (timer === 0) {
          processTimerExpiration();
      }
  }
}

function processTimerExpiration() {
  if (inputSequence === "") {
      console.log("No input received before time out.");
      mistakes++;
  } else {
      checkSequence();
  }

  if (mistakes >= maxMistakes) {
      displayStatus(); 
      setTimeout(gameOver, 200); 
  } else {
      generateNumber(); 
      setTimeout(() => serial.write("R"), 1000);
  }
}

function checkSequence() {
  if (inputSequence === currentNumber) {
      playDingSound();
      console.log("Correct sequence!");
      correctCount++; 
      serial.write("C"); 
      generateNumber(); 
  } else {
      console.log("Incorrect sequence. Try again!");
      mistakes++;
      serial.write("X");
  }

  inputSequence = ""; 
  generateNumber(); 

  displayStatus(); 

  if (mistakes >= maxMistakes) {
      setTimeout(gameOver, 200);
  } else {
      setTimeout(() => serial.write("R"), 1000); 
  }
}


function displayStatus() {
  textSize(20);
  fill(0); 

  textSize(120)
  text(`${currentNumber}`, height/2, width/2);

  textSize(40)
  text(`Time left: ${timer}`, height/2, 70);


  textSize(30)
  text(`Score: ${correctCount}`, 20, 50); 
  text(`Input: ${inputSequence}`, 20, 100);


  let imageSize = 80; 
  let startX = width - maxMistakes * imageSize - 20; 
  for (let i = 0; i < maxMistakes; i++) {
      let img = i < mistakes ? xImg : checkImg;
      image(img, startX + i * imageSize, 20, imageSize, imageSize); 
  }
}




function connectSerial() {
  if (serial.opened()) {
    serial.close();
  } else {
    serial.open('Arduino', 9600);
  }
}

function initSounds() {
  dingSynth = new p5.Oscillator('sine');
  dingSynth.amp(0);
  dingSynth.start();

  backgroundMusic = new p5.Oscillator('sine');
  backgroundMusic.freq(174);
  backgroundMusic.start();

  let lfo = new p5.Oscillator('sine');
  lfo.freq(0.1); 
  lfo.start();
  
  let lfoAmp = new p5.Amplitude();
  lfoAmp.setInput(lfo);
  lfoAmp.smooth(0.1); 
  lfo.amp(0.1);

  lfo.connect(backgroundMusic.amp());
}

function startBackgroundMusic() {
  backgroundMusic.amp(0.2); 
}

function playDingSound() {
  dingSynth.freq(440);
  dingSynth.amp(0.5);
  setTimeout(() => dingSynth.amp(0), 100);
}

function gameOver() {
  background(255);
  fill(255, 0, 0);
  text('Game Over', 50, 50);
  backgroundMusic.stop();
  noLoop(); 
  serial.write("X");
  console.log("Game over, please restart.");
}


function generateNumber() {
  let level = Math.floor(correctCount / 3) + 3;
  let min = Math.pow(10, level - 1); 
  let max = Math.pow(10, level) - 1; 
  currentNumber = Math.floor(random(min, max + 1)).toString();
  timer = Math.max(minTimer, 30 - Math.floor(correctCount / 3) * 1);
  console.log("New Number: " + currentNumber + ", New Timer: " + timer);
  displayStatus(); 
}