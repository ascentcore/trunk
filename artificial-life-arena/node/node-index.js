import fs from 'fs';
import * as tf from '@tensorflow/tfjs';
import '../src/arena/utils/seedrandom';
import Arena from '../src/arena/arena';
import popconfig from '../src/arena/popconfig';

const argv = require('yargs').argv

let iteration = 0;
let config = {
    tf,
    ...popconfig,
    onIterationEnd: function (arena) {
        console.log(`Iteration: ${arena.iterations}, Tick Count: ${arena.tickCount}`)
        const { map, populations, seed } = this;
        let data = JSON.stringify({ map, iterations: arena.iterations, populations, seed }, null, 2);
        fs.writeFileSync('./data/runtime.json', data);
    },
    seed: 'battlearena',
    renderer: undefined
}

if (argv.file) {
    console.log(`Initializing from file: ${argv.file}`)
    try {
        const loadedConfig = JSON.parse(fs.readFileSync(argv.file))
        Object.assign(config, loadedConfig);
    } catch (err) {
        console.log(`Error loading file ${argv.file}`);
    }
}


const arena = new Arena(config);
arena.reset()

function doTick() {
    arena.tick().then(() => {
        doTick();
    })
}

doTick();