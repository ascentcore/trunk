import getFaces from './facedetection';
import posenet from './positionResNet';
import stance from './stance';
import { setData } from '../../train/setData';

export default async (inputData) => {
  const data = inputData;

  // Experimental Google Chrome Face Detection API
  Object.assign(data, await getFaces(inputData));

  // poseNet
  Object.assign(data, await posenet(data));

  // stanceDetector
  Object.assign(data, await stance(data));

  return data;
};
