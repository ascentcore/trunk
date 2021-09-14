import {
  MAX_FACE_DETECTION_WIDTH,
  MAX_FACE_DETECTION_HEIGHT,
} from '../constants';
import moody from '../output/moody';

function main(input) {
  const { faces } = input;
  let stanceClass = null;
  if (input.people) {
    input.people.forEach((element) => {
      console.log(element);
      if (element) {
        stanceClass = element.stance.stanceClass;
        console.log('Stance: ', element.stance.stanceClass);
        console.log('Position: ', element.position);
        console.log('Face: ', element.face);
      } else {
        console.log('No input');
      }
    });
  }

  const char = moody('#vis', stanceClass);

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
