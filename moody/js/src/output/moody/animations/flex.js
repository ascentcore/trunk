import { select, easeSin, easeElasticInOut } from 'd3v4';
import * as d3 from 'd3v4';

export default function flex(config) {
  const { setEyes, rightHand, leftHand, vectorGroupFloating, generatePath } =
    config;

  setEyes('curious', 'default');

  const barbellGroup = vectorGroupFloating.append('g');
  const flexBarbell = barbellGroup.append('path');
  const flexHeavyWeightRight = barbellGroup.append('path');
  const flexLightWeightRight = barbellGroup.append('path');
  const flexHeavyWeightLeft = barbellGroup.append('path');
  const flexLightWeightLeft = barbellGroup.append('path');

  const barbellPath = 'M0 4 L64 4 L64 0 L0 0 Z';
  const weightPath = 'M0 14 L4 14 L4 2 L0 2 Z';

  generatePath(flexBarbell, barbellPath, 'gray', 'gray', 0, -28, 180, 4, 4, 0);
  generatePath(
    flexHeavyWeightLeft,
    weightPath,
    'gray',
    'gray',
    1,
    235,
    130,
    4,
    7,
    0
  );
  generatePath(
    flexHeavyWeightRight,
    weightPath,
    'gray',
    'gray',
    1,
    -50,
    130,
    4,
    7,
    0
  );
  generatePath(
    flexLightWeightLeft,
    weightPath,
    'gray',
    'gray',
    1,
    260,
    145,
    3,
    5,
    0
  );
  generatePath(
    flexLightWeightRight,
    weightPath,
    'gray',
    'gray',
    1,
    -70,
    145,
    3,
    5,
    0
  );

  const int1 = setInterval(() => {
    rightHand
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'rotate(90)scale(1,-1)translate(50,-10)') // tai-tai 1,-1
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'rotate(90)scale(-1,1)translate(50,-10)')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'rotate(90)scale(1,-1)translate(50,-10)');

    leftHand
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'rotate(90)scale(1,1)translate(50,-10)')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'rotate(90)scale(-1,-1)translate(50,-10)')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'rotate(90)scale(1,1)translate(50,-10)');

    barbellGroup
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(0,0)')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(0,-230)')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(0,0)');
  }, 900);

  return [int1];
}
