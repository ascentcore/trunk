import {
  MAX_FACE_DETECTION_WIDTH,
  MAX_FACE_DETECTION_HEIGHT,
} from '../constants';
import moody from '../output/moody';

const char = moody('#vis');
const { opts, lookAt } = char;

function main(input) {
  const { faces } = input;
  console.log(input);
  if (faces && faces.length > 0) {
    const {
      boundingBox: { x, y },
    } = faces[0];
    const lookAtX = (x * 1000) / MAX_FACE_DETECTION_WIDTH;
    const lookAtY = (y * 400) / MAX_FACE_DETECTION_HEIGHT;
    char.lookAt(lookAtX, lookAtY);
  }
}

export default main;
