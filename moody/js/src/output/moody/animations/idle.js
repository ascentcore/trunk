import { select, easeSin, easeElasticInOut } from 'd3v4';
import * as d3 from 'd3v4';

export default function idle(config) {
  const { setEyes, rightHand, leftHand } = config;
  setEyes('default', 'default');
  const int1 = setInterval(() => {
    rightHand
      .transition()
      .ease(easeSin)
      .duration(200)
      .attr('transform', 'translate(0,0)scale(-1,-1)rotate(50)')
      .attr(
        'd',
        'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
      )
      .transition()
      .ease(easeSin)
      .duration(200)
      .attr('transform', 'translate(0,0)scale(1,1)rotate(90)')
      .attr(
        'd',
        'M36 2 L30 2 L24 8 L14 8 L6 4 L6 0 L6 -4 L14 -8 L24 -8 L30 0 L36 0 L26 -12 L16 -14 L2 -8 L0 0 L2 8 L16 14 L26 12 Z'
      );
  }, 400);

  const int2 = setInterval(() => {
    leftHand
      .transition()
      .ease(easeSin)
      .duration(200)
      .attr('transform', 'translate(0,0)scale(-1,-1)rotate(160)') // tai-tai 1,-1
      .attr(
        'd',
        'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
      )
      .transition()
      .ease(easeSin)
      .duration(200)
      .attr('transform', 'translate(0,0)scale(1,1)rotate(90)') // - 90 greet
      .attr(
        'd',
        'M36 2 L30 2 L24 8 L14 8 L6 4 L6 0 L6 -4 L14 -8 L24 -8 L30 0 L36 0 L26 -12 L16 -14 L2 -8 L0 0 L2 8 L16 14 L26 12 Z'
      );
  }, 400);

  return [int1, int2];
}
