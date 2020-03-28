import { select, easeSin, easeElasticInOut } from "d3v4";
import * as d3 from "d3v4"
import utils from "./utils";
import idle from './animations/idle';
import aggro from './animations/aggro';
import army from './animations/army';
import dab from './animations/dab';
import flex from './animations/flex';
import greeting from './animations/greeting';
import guitar from './animations/guitar';
import happy from './animations/happy';
import jackSparrow from './animations/jackSparrow';
import johnnyBravo from './animations/johnnyBravo';
import silly from './animations/silly';
import superSayian from './animations/superSayian';
import ascentCore from "./animations/ascentCore";


export default (query, opts = { width: 1000, height: 1000 }) => {

  // --- SVG ---
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  const svg = utils.createSvg(width, height);
  document.querySelector(query).appendChild(svg);
  const root = select(svg);
  const vector = { width: 200, height: 150 };
  const vectorRoot = root.append("g").attr('id', 'vector-root');
  const vectorGroupFloating = vectorRoot.append("g").attr('id', 'vector-group').attr('transform', `translate(${width / 3}, ${height * 0.4})`);
  const vectorGroupStatic = vectorRoot.append("g").attr('id', 'vector-group').attr('transform', `translate(${width / 3}, ${height * 0.4})`);

  let bodyPath = 'M-22 50 L22 50 L32 0 L-32 0 Z';
  let auraPath = 'M 50 350 Q 200 300 100 200 Q 200 250 150 100 Q 250 150 300 0 Q 400 100 500 0 Q 550 150 650 100 Q 600 250 700 200 Q 600 300 750 350 Q 600 400 650 550 Q 550 450 500 600 Q 400 500 300 600 Q 200 450 150 550 Q 200 400 50 350';
  let sSJPath = 'M150 600 Q 50 550 0 400 Q 50 450 100 450 Q 50 400 50 300 Q 50 350 100 350 Q 50 350 100 200 Q 100 300 150 300 Q 100 200 250 50 Q 200 100 250 150 Q 300 100 300 0 Q 400 50 400 200 Q 450 150 450 100 Q 500 150 450 250 Q 500 250 500 150 Q 600 300 500 400 Q 550 400 600 300 Q 650 450 550 500 Q 600 500 650 450 Q 600 550 500 600 L 150 600'

  let intervals = [];

  const state = {
    x: width / 2,
    z: 1,
    leftHand: {
      x: 200,
      y: 80,
      rot: 90
    },
    rightHand: {
      x: 220,
      y: 100,
      rot: 90
    }
  }

  const moveLeftHand = (x = 0, y = 0, rot = 90, duration = 300) => {
    state.leftHand.x = x === true ? 200 : state.leftHand.x + x;
    state.leftHand.y = y === true ? 80 : state.leftHand.y + y;
    state.leftHand.rot = rot;
    leftHandGroup.transition().duration(duration).attr('transform', `translate(${state.leftHand.x}, ${state.leftHand.y})scale(1.4)`);
    leftHand.transition().duration(duration).attr('transform', `rotate(${state.leftHand.rot})`)
  }

  const moveRightHand = (x = 0, y = 0, rot = 90, duration = 300) => {
    state.rightHand.x = x === true ? 200 : state.rightHand.x + x;
    state.rightHand.y = y === true ? 80 : state.rightHand.y + y;
    state.rightHand.rot = rot;
    rightHandGroup.transition().duration(duration).attr('transform', `translate(${state.rightHand.x}, ${state.rightHand.y})scale(1.4)`);
    rightHand.transition().duration(duration).attr('transform', `rotate(${state.rightHand.rot})`)
  }

  const move = (x, z = 1, duration = 600) => {
    vectorGroupFloating.transition().duration(duration).attr('transform', `translate(${width / 2 + x}, ${height * 0.6})scale(${z})`);
    const velocityLeft = Math.sign(state.leftHand.rot) * Math.sign(state.x - x);
    const velocityRight = Math.sign(state.rightHand.rot) * Math.sign(state.x - x);
    Object.assign(state, { x, z });
    leftHand
      .transition()
      .duration(.3 * duration)
      .attr('transform', `rotate(${state.leftHand.rot - velocityLeft * 30})`)
      .transition()
      .duration(duration)
      .attr('transform', `rotate(${state.leftHand.rot})`);
    rightHand
      .transition()
      .duration(.3 * duration)
      .attr('transform', `rotate(${state.rightHand.rot - velocityRight * 30})`)
      .transition()
      .duration(duration)
      .attr('transform', `rotate(${state.rightHand.rot})`)
  }

  // ----- FLOATING RINGS -----

  function floatingRings() {
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ring = vectorGroupFloating
        .append("ellipse")
        .attr("cx", 100)
        .attr("cy", i * 10 + 180)
        .attr("rx", 85 - i * 10)
        .attr("ry", 25 - i * 3)
        .attr("fill", "rgba(120, 120, 200, .4)") // that awesome sky-blue color was 6AD6FB
        .attr("stroke", "rgba(64, 64, 128, .3)")
        .attr("stroke-width", 2);

      setInterval(() => {
        ring
          .transition()
          .ease(easeSin)
          .duration(250)
          .attr("rx", 45 - i * 10)
          .attr("ry", 15 - i * 3)
          .transition()
          .ease(easeSin)
          .duration(150)
          .attr("rx", 90 - i * 10)
          .attr("ry", 30 - i * 3)
      }, 320);

      rings.push(ring);
    }
  }

  // ----- SHAPES -----
  const body = vectorGroupFloating.append("path");

  function generatePath(shape, path, fill, stroke, strokeWidth, translateX, translateY, scaleX, scaleY, rotate) {
    shape
      .attr('d', `${path}`
      )
      .attr("fill", `${fill}`)
      .attr("stroke", `${stroke}`)
      .attr("stroke-width", `${strokeWidth}`)
      .attr("transform", `translate(${translateX},${translateY})scale(${scaleX},${scaleY})rotate(${rotate})`)
  }

  // --- BODY ---
  generatePath(body, bodyPath, 'white', 'black', 1, 100, 0, 3, 3, 0);


  const eyeSize = vector.width * 0.2;
  const eyeMovement = vector.width * 0.1;

  const moods = ["angry", "scared", "curious", "default"];

  const getEyePoints = (type, left = true) => {
    switch (type) {
      case "angry":
        return `0,${left ? 0 : eyeSize / 2}  ${eyeSize},${
          !left ? 0 : eyeSize / 2
          }  ${eyeSize},${eyeSize} 0,${eyeSize}`;
      case "scared":
        return `0,${!left ? 0 : eyeSize / 2}  ${eyeSize},${
          left ? 0 : eyeSize / 2
          }  ${eyeSize},${eyeSize} 0,${eyeSize}`;
      case "curious":
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
    .append("polygon")
    .attr("points", getEyePoints("angry", true))
    .attr("fill", "#88FBFF");

  const rightEye = vectorGroupFloating
    .append("polygon")
    .attr("points", `0,0  ${eyeSize},0 ${eyeSize},${eyeSize} 0,${eyeSize}`)
    .attr("fill", "#88FBFF");

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

    leftEye.attr("transform", `translate(${leftEyeX}, ${leftEyeY})`);
    rightEye.attr("transform", `translate(${rightEyeX}, ${rightEyeY})`);

  };

  // --- Blink Function ---
  const blink = () => {

    const oldPointsLeft = leftEye.attr("points");
    const oldPointsRight = rightEye.attr("points");

    leftEye
      .transition()
      .ease(easeElasticInOut)
      .duration(100)
      .attr(
        "points",
        `0,${eyeSize * 0.4}  ${eyeSize},${eyeSize * 0.4} ${eyeSize},${eyeSize *
        0.6} 0,${eyeSize * 0.6}`
      )
      .on("end", () => {
        leftEye
          .transition()
          .ease(easeElasticInOut)
          .duration(100)
          .attr("points", oldPointsLeft);
      });

    rightEye
      .transition()
      .ease(easeElasticInOut)
      .duration(100)

      .attr(
        "points",
        `0,${eyeSize * 0.4}  ${eyeSize},${eyeSize * 0.4} ${eyeSize},${eyeSize *
        0.6} 0,${eyeSize * 0.6}`
      )
      .on("end", () => {
        rightEye
          .transition()
          .ease(easeElasticInOut)
          .duration(100)
          .attr("points", oldPointsRight);
      });
  };

  lookAt();

  const nextBlink = () => {
    setTimeout(() => {
      blink();
      nextBlink();
    }, 1000 + Math.floor(Math.random() * 500));
  };

  // --- EYES SETTER ---
  const setEyes = (
    left = "default",
    right = "default",
    leftTransition = 150,
    rightTransition = 150
  ) => {

    leftEye
      .transition()
      .ease(easeElasticInOut)
      .duration(leftTransition)
      .attr("points", getEyePoints(left))
      .attr("stroke", "#000")
      .attr("stroke-width", "2")
      .attr('fill', left === 'angry' ? '#FF0000' : '#88FBFF')

    rightEye
      .transition()
      .ease(easeElasticInOut)
      .duration(rightTransition)
      .attr("points", getEyePoints(right, false))
      .attr("stroke", "#000")
      .attr("stroke-width", "2")
      .attr('fill', right === 'angry' ? '#FF0000' : '#88FBFF');

  };

  nextBlink();

  // --- FLOATING RINGS ---
  floatingRings();

  // --- HANDS ---
  const leftHandGroup = vectorGroupFloating.append('g').attr('transform', 'translate(200,80)scale(1.4,1.4)')
  const leftHand = leftHandGroup.append("path")
    .attr(
      'd', 'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
    )
    .attr("fill", "white")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .attr('transform', 'rotate(90)');

  const rightHandGroup = vectorGroupFloating.append('g').attr('transform', 'translate(0,80)scale(1.4,1.4)')
  const rightHand = rightHandGroup.append("path")
    .attr(
      'd', 'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
    )
    .attr("fill", "white")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .attr('transform', 'rotate(90)');

  let openHandPath = 'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z';
  let closedHandPath = 'M36 2 L30 2 L24 8 L14 8 L6 4 L6 0 L6 -4 L14 -8 L24 -8 L30 0 L36 0 L26 -12 L16 -14 L2 -8 L0 0 L2 8 L16 14 L26 12 Z';

  function handRaise(object, fromPath, toPath, ease, durationA, translateXA, translateYA, scaleXA, scaleYA, rotateA, durationB, translateXB, translateYB, scaleXB, scaleYB, rotateB) {
    object
      .transition()
      .ease(ease)
      .duration(durationA)
      .attr('transform', `translate(${translateXA},${translateYA})scale(${scaleXA},${scaleYA})rotate(${rotateA})`)
      .attr('d', fromPath)
      .transition()
      .ease(ease)
      .duration(durationB)
      .attr('transform', `translate(${translateXB},${translateYB})scale(${scaleXB},${scaleYB})rotate(${rotateB})`)
      .attr('d', toPath)
  }

  // --- FLOATING ANIMATION ---
  setInterval(() => {
    vectorGroupFloating
      .transition()
      .ease(easeSin)
      .duration(600)
      .attr("transform", `translate(${width / 3}, ${height * 0.4})`)
      .transition()
      .ease(easeSin)
      .duration(600)
      .attr("transform", `translate(${width / 3}, ${height * 0.4 + 50})`);
  }, 1200);

  function reset() {
    intervals.forEach(int => clearInterval(int));
    //aici ar trebui sa resetezi pozitiile mainilor
  }


  const config = { leftHand, rightHand, setEyes, vectorGroupFloating, generatePath, handRaise, closedHandPath, openHandPath, width, height, rightEye, leftEye, body, vectorGroupStatic };


  jackSparrow(config);

  Object.assign(window, { reset, aggro, idle, config, army });

  const vect = {
    svg: select(svg),
    opts,
    move,
    lookAt,
    moveLeftHand,
    moveRightHand,
    flex,
    army,
    superSayian
  }

  window.vect = vect;
  return vect;










};
