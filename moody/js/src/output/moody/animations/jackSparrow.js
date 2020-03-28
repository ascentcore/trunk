import { select, easeSin, easeElasticInOut } from "d3v4";
import * as d3 from "d3v4"

export default function jackSparrow(config) {
    const { setEyes, rightHand, leftHand, vectorGroupFloating, generatePath } = config;

    setEyes("angry", "angry")

    const pirate = vectorGroupFloating.append("path");
    const piratePath = "M 0 350 Q 150 450 250 200 Q 400 0 550 200 Q 600 450 800 350 L 700 550 Q 400 500 100 550 L 0 350 ";
    const pirateLogo = vectorGroupFloating.append("path")
    const pirateLogoPath = "M 150 500 C 50 500 100 400 200 400 L 350 300 L 200 200 C 100 200 50 100 150 100 C 150 0 250 50 250 150 L 400 250 L 550 150 C 550 50 650 0 650 100 C 750 100 700 200 600 200 L 450 300 L 600 400 C 700 400 750 500 650 500 C 650 600 550 550 550 450 L 400 350 L 250 450 C 250 550 150 600 150 500 "
    generatePath(pirate, piratePath, "#33322f", "#33322f", 10, -27, -169, 0.32, 0.32, 0);
    generatePath(pirateLogo, pirateLogoPath, "white", 'white', 1, 60, -95, 0.1, 0.1, 0);

    const paddle = vectorGroupFloating.append("path");
    const paddlePath = "M 800 150 Q 800 0 500 150 L 0 150 L 0 200 L 500 200 Q 800 350 800 200 L 800 200 L 800 150 "

    generatePath(paddle, paddlePath, "#5e4f21", "#5e4f21", 0, 0, 95, 0.50, 0.45, 0);

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
          .attr('transform', 'rotate(90)scale(1,-1)translate(50,-10)')
  
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
          .attr('transform', 'rotate(90)scale(1,1)translate(50,-10)')
  
        paddle
          .transition()
          .ease(easeSin)
          .duration(300)
          .attr('transform', 'translate(-30,95)scale(0.50,0.45)')
          .transition()
          .ease(easeSin)
          .duration(300)
          .attr('transform', 'translate(-30,-100)scale(0.5,0.45)')
          .transition()
          .ease(easeSin)
          .duration(300)
          .attr('transform', 'translate(-30,95)scale(0.5,0.45)')

          vectorGroupFloating
          .transition()
          .ease(easeSin)
          .duration(450)
          .attr("transform", "translate(300,300)scale(3,3)rotate(0)")
          .transition()
          .ease(easeSin)
          .duration(450)
          .attr("transform", "translate(300,300)scale(1,1)rotate(0)")
      }, 900);
      
    return [int1]
}