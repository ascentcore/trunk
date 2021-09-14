import { select, easeSin, easeElasticInOut } from 'd3v4';
import utils from './utils';

export default (query, stanceClass, opts = { width: 1000, height: 1000 }) => {
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  const svg = utils.createSvg(width, height);
  document.querySelector(query).appendChild(svg);
  const root = select(svg);
  const vector = { width: 200, height: 150 };
  const vectorRoot = root.append('g').attr('id', 'vector-root');
  const vectorGroupFloating = vectorRoot
    .append('g')
    .attr('id', 'vector-group')
    .attr('transform', `translate(${width / 3}, ${height * 0.4})`);

  const vectorGroupStatic = vectorRoot
    .append('g')
    .attr('id', 'vector-group')
    .attr('transform', `translate(${width / 3}, ${height * 0.4})`);

  let bodyPath = 'M-22 50 L22 50 L32 0 L-32 0 Z';

  const state = {
    x: width / 2,
    z: 1,
    leftHand: {
      x: 200,
      y: 80,
      rot: 90,
    },
    rightHand: {
      x: 220,
      y: 100,
      rot: 90,
    },
  };

  function floatingRings() {
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ring = vectorGroupFloating
        .append('ellipse')
        .attr('cx', 100)
        .attr('cy', i * 10 + 180)
        .attr('rx', 85 - i * 10)
        .attr('ry', 25 - i * 3)
        .attr('fill', 'rgba(120, 120, 200, .4)')
        .attr('stroke', 'rgba(64, 64, 128, .3)')
        .attr('stroke-width', 2);

      setInterval(() => {
        ring
          .transition()
          .ease(easeSin)
          .duration(250)
          .attr('rx', 45 - i * 10)
          .attr('ry', 15 - i * 3)
          .transition()
          .ease(easeSin)
          .duration(150)
          .attr('rx', 90 - i * 10)
          .attr('ry', 30 - i * 3);
      }, 320);

      rings.push(ring);
    }
  }

  const body = vectorGroupFloating.append('path');

  function generatePath(
    shape,
    path,
    fill,
    stroke,
    strokeWidth,
    translateX,
    translateY,
    scaleX,
    scaleY,
    rotate
  ) {
    shape
      .attr('d', `${path}`)
      .attr('fill', `${fill}`)
      .attr('stroke', `${stroke}`)
      .attr('stroke-width', `${strokeWidth}`)
      .attr(
        'transform',
        `translate(${translateX},${translateY})scale(${scaleX},${scaleY})rotate(${rotate})`
      );
  }

  // --- BODY ---
  generatePath(body, bodyPath, 'white', 'black', 1, 100, 0, 3, 3, 0);

  const eyeSize = vector.width * 0.2;
  const eyeMovement = vector.width * 0.1;

  const getEyePoints = (type, left = true) => {
    switch (type) {
      case 'angry':
        return `0,${left ? 0 : eyeSize / 2}  ${eyeSize},${
          !left ? 0 : eyeSize / 2
        }  ${eyeSize},${eyeSize} 0,${eyeSize}`;
      case 'scared':
        return `0,${!left ? 0 : eyeSize / 2}  ${eyeSize},${
          left ? 0 : eyeSize / 2
        }  ${eyeSize},${eyeSize} 0,${eyeSize}`;
      case 'curious':
        return `
              0,${left ? eyeSize * 0.2 : eyeSize * 0.3}
              ${eyeSize},${left ? eyeSize * 0.3 : eyeSize * 0.2}
              ${eyeSize},${left ? eyeSize * 0.6 : eyeSize * 0.6}
              0,${left ? eyeSize * 0.6 : eyeSize * 0.6}`;
      default:
        return `0,0  ${eyeSize},0 ${eyeSize},${eyeSize} 0,${eyeSize}`;
    }
  };

  const leftEye = vectorGroupFloating
    .append('polygon')
    .attr('points', getEyePoints('angry', true))
    .attr('fill', '#88FBFF');

  const rightEye = vectorGroupFloating
    .append('polygon')
    .attr('points', `0,0  ${eyeSize},0 ${eyeSize},${eyeSize} 0,${eyeSize}`)
    .attr('fill', '#88FBFF');

  const lookAt = (x = width / 2, y = height / 2) => {
    let leftEyeX =
      Math.floor(vector.width * 0.35 - eyeSize * 0.5) -
      eyeMovement / 2 +
      (eyeMovement * x) / width;

    let leftEyeY =
      Math.floor(vector.height) * 0.6 -
      eyeMovement / 2 +
      (eyeMovement * y) / height;

    let rightEyeX =
      Math.floor(vector.width * 0.65 - eyeSize * 0.5) -
      eyeMovement / 2 +
      (eyeMovement * x) / width;

    let rightEyeY =
      Math.floor(vector.height) * 0.6 -
      eyeMovement / 2 +
      (eyeMovement * y) / height;

    leftEye.attr('transform', `translate(${leftEyeX}, ${leftEyeY})`);
    rightEye.attr('transform', `translate(${rightEyeX}, ${rightEyeY})`);
  };

  // --- BLINK ---
  const blink = () => {
    const oldPointsLeft = leftEye.attr('points');
    const oldPointsRight = rightEye.attr('points');

    leftEye
      .transition()
      .ease(easeElasticInOut)
      .duration(100)
      .attr(
        'points',
        `0,${eyeSize * 0.4}  ${eyeSize},${eyeSize * 0.4} ${eyeSize},${
          eyeSize * 0.6
        } 0,${eyeSize * 0.6}`
      )
      .on('end', () => {
        leftEye
          .transition()
          .ease(easeElasticInOut)
          .duration(100)
          .attr('points', oldPointsLeft);
      });

    rightEye
      .transition()
      .ease(easeElasticInOut)
      .duration(100)

      .attr(
        'points',
        `0,${eyeSize * 0.4}  ${eyeSize},${eyeSize * 0.4} ${eyeSize},${
          eyeSize * 0.6
        } 0,${eyeSize * 0.6}`
      )
      .on('end', () => {
        rightEye
          .transition()
          .ease(easeElasticInOut)
          .duration(100)
          .attr('points', oldPointsRight);
      });
  };

  // Used in animations for moody to track the human
  // subject's movement with his eyes
  lookAt();

  const nextBlink = () => {
    setTimeout(() => {
      blink();
      nextBlink();
    }, 1000 + Math.floor(Math.random() * 500));
  };

  // --- EYES SETTER ---
  const setEyes = (
    left = 'default',
    right = 'default',
    leftTransition = 150,
    rightTransition = 150
  ) => {
    leftEye
      .transition()
      .ease(easeElasticInOut)
      .duration(leftTransition)
      .attr('points', getEyePoints(left))
      .attr('stroke', '#000')
      .attr('stroke-width', '2')
      .attr('fill', left === 'angry' ? '#FF0000' : '#88FBFF');
    rightEye
      .transition()
      .ease(easeElasticInOut)
      .duration(rightTransition)
      .attr('points', getEyePoints(right, false))
      .attr('stroke', '#000')
      .attr('stroke-width', '2')
      .attr('fill', right === 'angry' ? '#FF0000' : '#88FBFF');
  };

  // to be used with svg animations

  // nextBlink();
  // floatingRings();

  // --- HANDS ---
  const leftHandGroup = vectorGroupFloating
    .append('g')
    .attr('transform', 'translate(200,80)scale(1.4,1.4)');
  const leftHand = leftHandGroup
    .append('path')
    .attr(
      'd',
      'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
    )
    .attr('fill', 'white')
    .attr('stroke', '#000')
    .attr('stroke-width', 1.5)
    .attr('transform', 'rotate(90)');

  const rightHandGroup = vectorGroupFloating
    .append('g')
    .attr('transform', 'translate(0,80)scale(1.4,1.4)');
  const rightHand = rightHandGroup
    .append('path')
    .attr(
      'd',
      'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
    )
    .attr('fill', 'white')
    .attr('stroke', '#000')
    .attr('stroke-width', 1.5)
    .attr('transform', 'rotate(90)');

  // --- FLOATING ANIMATION ---
  setInterval(() => {
    vectorGroupFloating
      .transition()
      .ease(easeSin)
      .duration(600)
      .attr('transform', `translate(${width / 3}, ${height * 0.4})`)
      .transition()
      .ease(easeSin)
      .duration(600)
      .attr('transform', `translate(${width / 3}, ${height * 0.4 + 50})`);
  }, 1200);

  document.getElementById('vis').style.marginTop = '100px';
  document.getElementById('vis').style.marginLeft = '600px';
  document.getElementById('vis').innerHTML = '';

  const imgAnimation = document.createElement('img');
  if (stanceClass == 'Greet') {
    imgAnimation.setAttribute(
      'src',
      'https://media4.giphy.com/media/W7qB5Y0tp0nvTOAGQU/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }

  if (stanceClass == 'Aggro') {
    imgAnimation.setAttribute(
      'src',
      'https://media3.giphy.com/media/XFsHEkGho0zUZZ78tc/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }

  if (stanceClass == 'Idle') {
    imgAnimation.setAttribute(
      'src',
      'https://media4.giphy.com/media/PaREKyI7b4JFJCkOHE/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }

  if (stanceClass == null) {
    imgAnimation.setAttribute(
      'src',
      'https://media4.giphy.com/media/PaREKyI7b4JFJCkOHE/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }

  if (stanceClass == 'Dab') {
    imgAnimation.setAttribute(
      'src',
      'https://media3.giphy.com/media/yjzQs8475j6rb9oRS5/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }

  if (stanceClass == 'Super Sayian') {
    imgAnimation.setAttribute(
      'src',
      'https://media3.giphy.com/media/eyfPVvoVpoTCaILN2q/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }

  if (stanceClass == 'Johnny Bravo') {
    imgAnimation.setAttribute(
      'src',
      'https://media3.giphy.com/media/plPS1sv5wxzkQnawuJ/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }

  if (stanceClass == 'Flexing') {
    imgAnimation.setAttribute(
      'src',
      'https://media0.giphy.com/media/aSdt7iZBtCmwfv4004/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }

  if (stanceClass == 'Army Salute') {
    imgAnimation.setAttribute(
      'src',
      'https://media4.giphy.com/media/6ENAWp3HWhMcWrDv6e/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }

  if (stanceClass == 'Silly') {
    imgAnimation.setAttribute(
      'src',
      'https://media2.giphy.com/media/HCQQEEC19Md5lgXhSI/giphy.gif'
    );
    document.getElementById('vis').appendChild(imgAnimation);
  }
};
