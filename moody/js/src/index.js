require('babel-core/register');
require('babel-polyfill');

//Load inputs layer
import getInputData from './input';

//Load processors
import getProcessedData from './processors';
import brainMain from './brain';

// Miliseconds to register one frame
const loopInterval = 1000;

//Main loop
async function mainLoop() {
  window.requestAnimationFrame(async () => {
    const inputData = await getInputData();
    const processedData = await getProcessedData(inputData);
    brainMain(processedData);
  });
}

// Start the main loop with an initial iteration executed
mainLoop();
setInterval(async () => {
  mainLoop();
}, loopInterval);
