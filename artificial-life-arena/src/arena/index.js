import './utils/seedrandom';
import * as tf from '@tensorflow/tfjs';
import Arena from './arena';
import CanvasRenderer from './renderers/canvas.renderer';
import initialSetup from './popconfig';

// import newconfig from '../runtime.json';
const loadRuntime = false;

const MAP_WIDTH = 100
const MAP_HEIGHT = 80

const config = {
    tf,
    ...initialSetup,
    renderer: new CanvasRenderer({
        width: MAP_WIDTH,
        height: MAP_HEIGHT
    })
}


if (loadRuntime) {
    // Object.assign(config, newconfig);
    // config.removeWeak = true;
}
const arena = new Arena(config);
arena.reset()


function doTick() {
    arena.tick().then(() => {
        doTick();
    })
}

doTick();