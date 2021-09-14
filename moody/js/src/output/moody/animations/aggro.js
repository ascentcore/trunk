import { select, easeSin, easeElasticInOut } from 'd3v4';
import * as d3 from 'd3v4';
import stance from '../../../processors/stance';

export default function aggro(config, stanceClass) {
  const { setEyes, leftHand, vectorGroupFloating, generatePath } = config;

  setEyes('angry', 'angry');

  const aggroKnivesOut = vectorGroupFloating.append('path');
  const knifePath =
    'M0 0 L0 6 L16 6 L16 12 L20 12 L20 8 L50 8 L68 -2 L50 -2 L48 0 L46 -2 L44 0 L42 -2 L40 0 L38 -2 L36 0 L34 -2 L32 0 L30 -2 L28 0 L26 -2 L24 0 L22 -2 L20 -2 L20 -6 L16 -6 L16 0 Z';

  generatePath(
    aggroKnivesOut,
    knifePath,
    'black',
    'black',
    1,
    189,
    96,
    3,
    3,
    0
  );

  const int1 = setInterval(() => {
    leftHand
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(0,0)scale(-1,-1)rotate(160)')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(0,0)scale(1,1)rotate(90)'); // - 90 greet
    aggroKnivesOut
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(210,77)scale(3,3)rotate(-60)')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(195,96)scale(3,3)rotate(30)');
  }, 600);

  return [int1];
}
