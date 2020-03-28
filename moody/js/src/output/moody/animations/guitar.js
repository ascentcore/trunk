import { select, easeSin, easeElasticInOut } from "d3v4";
import * as d3 from "d3v4"

export default function guitar(config) {

    const { openHandPath, closedHandPath, setEyes, rightHand, leftHand, vectorGroupFloating, generatePath, handRaise } = config;

    setEyes("curious", "curious")



    const guitarPath = 'M0 2 L4 6 L4 10 L0 12 L-2 20 L-2 22 L0 26 L2 30 L8 32 L16 32 L22 28 L24 20 L18 24 L6 24 L6 22 L18 22 L18 22 L18 24 L24 20 L24 16 L20 10 L22 4 L16 16 L8 16 L8 14 L16 14 L16 16 L18 14 L22 4 L22 0 L18 2 L16 2 L16 2 L14 0 L14 0 L14 -14 L16 -18 L16 -22 L12 -22 L8 -20 L8 -18 L10 -16 L10 0 L8 2 L4 0 L2 -4 L0 -4 Z';
    const guitar = vectorGroupFloating.append("path");
    generatePath(guitar, guitarPath, '#0373fc', 'green', 0, 160, 160, 3.6, 3.6, 80);

    setInterval(() => {
        leftHand
            .transition()
            .ease(easeSin)
            .duration(300)
            .attr('transform', 'rotate(100)translate(50,-10)') // tai-tai 1,-1
            .attr('d', 'M36 6 L30 6 L24 10 L12 10 L8 6 L6 0 L8 -6 L12 -10 L24 -10 L30 -6 L36 -6 L26 -14 L10 -14 L4 -8 L0 0 L4 8 L10 14 L26 14 Z')


        handRaise(rightHand, openHandPath, closedHandPath, easeSin, 300, 40, 80, -1, -1, 230, 300, 40, 80, -1, -1, 140);

    }, 600);

    const lightningPath = 'M8 0 L4 22 L26 -4 L16 -4 L24 -20 L6 -20 L0 0 Z'
    const lightningOne = vectorGroupFloating.append("path")
    const lightningTwo = vectorGroupFloating.append("path")
    const lightningThree = vectorGroupFloating.append("path")

    generatePath(lightningOne, lightningPath, 'yellow', 'black', 1, 10, 300, 2, 2, 30);
    generatePath(lightningTwo, lightningPath, 'yellow', 'black', 1, 90, 330, 2, 2, 5);
    generatePath(lightningThree, lightningPath, 'yellow', 'black', 1, 170, 330, 2, 2, -30);

    function storm(boltOne, boltTwo, boltThree, duration) {
        setInterval(() => {

            thunder(boltOne, d3.easeExpInOut, 60, 50, 45, 45, 10, 300, 0, 0, 60, 10, 300, 2, 2, 30, 'yellow', '#bgf1ff');
            thunder(boltTwo, d3.easeExpInOut, 60, 50, 45, 45, 90, 330, 3, 3, 5, 90, 330, 2, 2, 5, 'yellow', '#bgf1ff');
            thunder(boltThree, d3.easeExpInOut, 50, 60, 45, 45, 170, 330, 0, 0, -60, 170, 330, 2, 2, -30, 'yellow', '#bgf1ff');

        }, duration)

        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };
        
        guitar.moveToFront();
        rightHand.moveToFront();
        leftHand.moveToFront();
    }

    function thunder(bolt, ease, timeA, timeB, timeC, timeD, translateXA, translateYA, scaleXA, scaleYA, rotateA, translateXB, translateYB, scaleXB, scaleYB, rotateB, colorOne, colorTwo) {
        bolt
            .transition()
            .ease(ease)
            .duration(timeA)
            .attr('transform', `translate(${translateXA},${translateYA})scale(${scaleXA},${scaleYA})rotate(${rotateA})`)
            .transition()
            .ease(ease)
            .duration(timeB)
            .attr('transform', `translate(${translateXB},${translateYB})scale(${scaleXB},${scaleYB})rotate(${rotateB})`)
            .transition()
            .ease(ease)
            .duration(timeC)
            .styleTween("fill", function () {
                return d3.interpolateRgb(`${colorOne}`, `${colorTwo}`);
            })
            .transition()
            .ease(ease)
            .duration(timeD)
            .styleTween("fill", function () {
                return d3.interpolateRgb(`${colorTwo}`, `${colorOne}`);
            })
    }



    storm(lightningOne, lightningTwo, lightningThree, 600);





}
