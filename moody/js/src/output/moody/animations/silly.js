import { select, easeSin, easeElasticInOut } from 'd3v4';
import * as d3 from 'd3v4';

export default function silly(config) {
  const { setEyes, rightHand, leftHand, vectorGroupFloating, width, height } =
    config;

  setEyes('default', 'default');

  const object = {
    obj1: vectorGroupFloating
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(350,350)scale(-1,-1)rotate(120)')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', `translate(${width / 3}, ${height * 0.4})`),

    obj2: rightHand
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(-50,-50)scale(-1,-1)rotate(50)')
      .attr(
        'd',
        'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
      )
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(0,0)scale(1,1)rotate(90)')
      .attr(
        'd',
        'M36 2 L30 2 L24 8 L14 8 L6 4 L6 0 L6 -4 L14 -8 L24 -8 L30 0 L36 0 L26 -12 L16 -14 L2 -8 L0 0 L2 8 L16 14 L26 12 Z'
      ),

    obj3: leftHand
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(50,50)scale(-1,-1)rotate(160)')
      .attr(
        'd',
        'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
      )
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(0,0)scale(1,1)rotate(90)')
      .attr(
        'd',
        'M36 2 L30 2 L24 8 L14 8 L6 4 L6 0 L6 -4 L14 -8 L24 -8 L30 0 L36 0 L26 -12 L16 -14 L2 -8 L0 0 L2 8 L16 14 L26 12 Z'
      ),
  };

  return object;
}
