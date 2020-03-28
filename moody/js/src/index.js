require('babel-core/register');
require('babel-polyfill');

//Load inputs layer
import getInputData from './input';

//Load porcessors
import getProcessedData from './processors';

import bainMain from './brain';


const loopInterval = 5000;

//Main loop
async function mainLoop() {
  // window.requestAnimationFrame(async () => {
  //   const inputData = await getInputData();
  //   const processedData = await getProcessedData(inputData);

  //   bainMain(processedData);
  // });
}


// Start our main loop with an initial iteration executed
mainLoop();
setInterval(async () => {
  mainLoop();
}, loopInterval);



