import { select, easeSin, easeElasticInOut } from "d3v4";
import * as d3 from "d3v4"
import utils from "./utils";

export default (query, opts = { width: 1000, height: 1000 }) => {

  // --- SVG ---

  const container = document.querySelector(query);
  const { width, height } = opts;
  const svg = utils.createSvg(width, height);
  const root = select(svg);
  const vector = { width: 200, height: 150 };
  const vectorRoot = root.append("g");
  const vectorGroup = vectorRoot.append("g");

  container.appendChild(svg);


  // --- BACKGROUND DEMO ---
  const background = vectorGroup.append("rect");
  background
    .attr('x', -300)
    .attr('y', -300)
    .attr('width', 1000)
    .attr('height', 1000)
    .attr("stroke", "#BEBEBE")
    .attr("stroke-width", 8)
    .attr("fill", "#BEBEBE");


  // --- FLOATING ANIMATION ---
  setInterval(() => {
    vectorGroup
      .transition()
      .ease(easeSin)
      .duration(600)
      .attr("transform", "translate(0, 5)")
      .transition()
      .ease(easeSin)
      .duration(600)
      .attr("transform", "translate(0, 0)");
  }, 1200);


  // vectorRoot.attr("transform", `translate(${width / 2}, ${height / 2})`);


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

  // --- YSSMIAC ---
  const crown = vectorGroup.append("path");
  crown
  .attr('d','M2 20 L54 20 L58 -14 L48 -2 L42 -16 L36 0 L28 -18 L20 0 L14 -16 L8 -2 L-2 -14 Z'
  )
  .attr("fill","yellow")
  .attr("stroke","#000")
  .attr("stroke-width","1.5")
  .attr("transform","translate(0,-55)scale(3.6,3.6)") // NOT GREAT NOT TERRIBLE

  // --- BODY ---
  const body = vectorGroup.append("polygon");
  body
    .attr(
      "points",
      `0,0
      ${vector.width},0
      ${vector.width * 0.8},${vector.height}
      ${vector.width * 0.2},${vector.height}`
    )
    .attr("stroke", "#000")
    .attr("stroke-width", 6)
    .attr("fill", "white");


  // --- LEFT HAND ---
  const handOpenLeft = vectorGroup.append("path");
  handOpenLeft
    .attr(
      'd', 'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
    )
    .attr("fill", "white")
    .attr("stroke", "#000")
    .attr("stroke-width", 2.5)
    .attr('transform', 'translate(200,80)scale(2,2)rotate(-20)');

  // --- RIGHT HAND ---
  const handOpenRight = vectorGroup.append("path");
  handOpenRight
    .attr(
      'd', 'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z'
    )
    .attr("stroke-width", 0)
    .attr("fill", "white")
    .attr("stroke", "#000")
    .attr("stroke-width", 2.5)
    .attr('transform', 'translate(0,80)scale(2,2)rotate(200)')



  // --- IDLE NOTICE ME LEFT HAND ---
  setInterval(() => {
    handOpenLeft
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(200,80)scale(2,2)rotate(-50)')
      .attr('d', 'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(200,80)scale(2,2)rotate(40)')
      .attr('d', 'M36 2 L30 2 L24 8 L14 8 L6 4 L6 0 L6 -4 L14 -8 L24 -8 L30 0 L36 0 L26 -12 L16 -14 L2 -8 L0 0 L2 8 L16 14 L26 12 Z')
  }, 600);




  // --- IDLE NOTCIE ME RIGHT HAND ---
  setInterval(() => {
    handOpenRight
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(0,80)scale(2,2)rotate(230)')
      .attr('d', 'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z')
      .transition()
      .ease(easeSin)
      .duration(300)
      .attr('transform', 'translate(0,80)scale(2,2)rotate(140)')
      .attr('d', 'M36 2 L30 2 L24 8 L14 8 L6 4 L6 0 L6 -4 L14 -8 L24 -8 L30 0 L36 0 L26 -12 L16 -14 L2 -8 L0 0 L2 8 L16 14 L26 12 Z')
  }, 600);

  // --- FLOATING RINGS ---
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = vectorRoot
      .append("ellipse")
      .attr("cx", vector.width / 2)
      .attr("cy", vector.height * 1.2 + i * 10)
      .attr("rx", 80 - i * 10)
      .attr("ry", 20 - i * 3)
      .attr("fill", "#88FBFF") // that awesome sky-blue color was 6AD6FB
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    setInterval(() => {
      ring
        .transition()
        .ease(easeSin)
        .duration(250)
        .attr("rx", 36 - i * 10)
        .attr("ry", 9 - i * 3)
        .transition()
        .ease(easeSin)
        .duration(150)
        .attr("rx", 80 - i * 10)
        .attr("ry", 20 - i * 3)
    }, 320);

    rings.push(ring);
  }



  // -- EYES ---
  const eyeSize = vector.width * 0.2;
  const eyeMovement = vector.width * 0.1;

  const leftEye = vectorGroup
    .append("polygon")
    .attr("points", getEyePoints("angry", true))
    .attr("fill", "#88FBFF");

  const rightEye = vectorGroup
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


  // --- blink function ---
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
      .attr("stroke", "#000")
      .attr("stroke-width", "2")
      .attr('fill', right === 'angry' ? '#FF0000' : '#88FBFF')
      .attr("points", getEyePoints(right, false));
  };



  setEyes("angry", "angry");

  nextBlink();



  // root.on("mousemove", e => {
  //   const { clientX, clientY } = event;
  //   lookAt(clientX, clientY);
  // });




  setInterval(() => {
    const mood = moods[Math.floor(Math.random() * moods.length)];
    setEyes(mood, mood, 300, 300);
  }, 2000);



  window.vector = vectorRoot;




  return {
    svg: select(svg),
    opts,
    lookAt
  }
};
