import * as Pizzicato from 'pizzicato';

// -----------------------
// ------ U T I L S ------
// -----------------------

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomFraction() {
  return Math.floor(Math.random() * 100) / 100;
}

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


// ---------------------------
// ------ E F F E C T S ------
// ---------------------------

// Use this when he's angry or when he cries:
const pingPongDelay = new Pizzicato.Effects.PingPongDelay({
  feedback: 0.40,
  time: 0.4,
  mix: 0.5
});

// Use this when he's angry or when he cries:
const dubDelay = new Pizzicato.Effects.DubDelay({
  feedback: 0.6,
  time: 0.154,
  mix: 0.5,
  cutoff: 2600
});

// Use this for any sound to make it more robotic
const distortion = new Pizzicato.Effects.Distortion({
  gain: 0.5
});

// Use this when you want your sound to be more "electric", but not "electric" in a sense of "manele"
const quadrafuzz = new Pizzicato.Effects.Quadrafuzz({
  lowGain: 0.8,
  midLowGain: 0.6,
  midHighGain: 0,
  highGain: 0,
  mix: 0.5
});

// Use this when you want the sound to have disturbances
var flanger = new Pizzicato.Effects.Flanger({
  time: 0.45,
  speed: 0.65,
  depth: 0.8,
  feedback: 0.55,
  mix: 0.7
});

// Use when you want to "echo" the beeps
const reverb = new Pizzicato.Effects.Reverb({
  time: 1.05,
  decay: 2.55,
  reverse: false,
  mix: 0.6
});

// Use when you want to "sharpen" the beeps
var tremolo = new Pizzicato.Effects.Tremolo({
  speed: getRandomValue(0, 20),
  depth: getRandomFraction(),
  mix: getRandomFraction()
});

const highPassFilter = new Pizzicato.Effects.HighPassFilter({
  frequency: 1078,
  peak: 7.38
});

const lowPassFilter = new Pizzicato.Effects.LowPassFilter({
  frequency: 3020,
  peak: 4
});

// Use when you want to sound more robotic overall
const ringModulator = new Pizzicato.Effects.RingModulator({
  volume: 0.67,
  speed: 467,
  distortion: 17.31,
  mix: 0.6
});




// ----------------------------------
// ------  S O U N D F I L E S ------
// ----------------------------------

const DDI = 'http://localhost:4500/soundfiles/DDI.wav';
const DSS = 'http://localhost:4500/soundfiles/DSS.wav';
const moodyAck = 'http://localhost:4500/soundfiles/moodyAck.wav';
const moodyAtk = 'http://localhost:4500/soundfiles/moodyAtk.wav';
const moodyAtk2 = 'http://localhost:4500/soundfiles/moodyAtk2.wav';
const moodyGrt = 'http://localhost:4500/soundfiles/moodyGrt.wav';
const moodyGrt2 = 'http://localhost:4500/soundfiles/moodyGrt2.wav';
const moodyHah = 'http://localhost:4500/soundfiles/moodyHah.wav';
const moodyQue = 'http://localhost:4500/soundfiles/moodyQue.wav';
const moodySad = 'http://localhost:4500/soundfiles/moodySad.wav';
const moodyScr = 'http://localhost:4500/soundfiles/moodyScr.wav';
const moodySwe = 'http://localhost4500/soundfiles/moodySwe';
const moodySwe2 = 'http://localhost4500/soundfiles/moodySwe2';



// -----------------------
// ------ L O G I C ------
// -----------------------


let path = [DDI, DSS, moodyAck, moodyAtk, moodyAtk2, moodyGrt, moodyGrt2, moodyHah, moodyQue, moodySad, moodyScr, moodySwe, moodySwe2];


function initializeSound() {

  return new Promise((resolve, reject) => {

    const sound = new Pizzicato.Sound({
      source: 'file',
      options: { path, loop: true }
    }, () => {
      sound.play();
      resolve(sound);
    });
  })
};


// ------ Acknowledge ------

const soundAck = new Pizzicato.Sound({
  source: 'file',
  options: { path: path[0], loop: true }
}, () => {
  soundAck.play();

})
