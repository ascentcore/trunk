import { select, easeSin, easeElasticInOut } from 'd3v4';
import * as d3 from 'd3v4';

export default function dab(config) {
  const {
    setEyes,
    rightHand,
    leftHand,
    handRaise,
    closedHandPath,
    openHandPath,
  } = config;

  setEyes('default', 'default');

  const object = {
    rightHad: handRaise(
      rightHand,
      closedHandPath,
      openHandPath,
      easeSin,
      600,
      -50,
      -50,
      -1,
      -1,
      10,
      900,
      0,
      0,
      1,
      1,
      90
    ),
    leftHand: handRaise(
      leftHand,
      closedHandPath,
      openHandPath,
      easeSin,
      600,
      -50,
      0,
      -1,
      -1,
      40,
      900,
      0,
      0,
      1,
      1,
      90
    ),
  };

  return object;
}
