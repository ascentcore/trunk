import getFaces from './facedetection';
import getEmotions from './emotions';
import posenet from './positionResNet';
import stance from './stance';

export default async inputData => {
const data = inputData;
 
 // Object.assign(data, await getFaces(inputData));
 // Object.assign(data, await getEmotions(data));
 // Object.assign(data, await posenet(data));
 // Object.assign(data, await stance(data));
 
  console.log(data);

  return data;
}