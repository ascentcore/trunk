import { select, easeSin, easeElasticInOut } from "d3v4";
import * as d3 from "d3v4"

export default function superSayian(config) {
    const { setEyes, vectorGroupFloating, generatePath,body, leftEye, rightEye, leftHand, rightHand } = config;

    setEyes("angry", "angry");

    let auraPath = 'M 50 350 Q 200 300 100 200 Q 200 250 150 100 Q 250 150 300 0 Q 400 100 500 0 Q 550 150 650 100 Q 600 250 700 200 Q 600 300 750 350 Q 600 400 650 550 Q 550 450 500 600 Q 400 500 300 600 Q 200 450 150 550 Q 200 400 50 350';
    let sSJPath = 'M150 600 Q 50 550 0 400 Q 50 450 100 450 Q 50 400 50 300 Q 50 350 100 350 Q 50 350 100 200 Q 100 300 150 300 Q 100 200 250 50 Q 200 100 250 150 Q 300 100 300 0 Q 400 50 400 200 Q 450 150 450 100 Q 500 150 450 250 Q 500 250 500 150 Q 600 300 500 400 Q 550 400 600 300 Q 650 450 550 500 Q 600 500 650 450 Q 600 550 500 600 L 150 600'

    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };

    for (let i = 3; i > 0; i--) {

        const aura = vectorGroupFloating.append("path");
        generatePath(aura, auraPath, "rgba(255, 255, 0, .1)", "black", 1, -180 + i * (-80), -270 - i * 47, 0.7 + i * 0.2, 0.8 + i * 0.15, 0)

        

        const sSJ = vectorGroupFloating.append("path");
        generatePath(sSJ, sSJPath, "yellow", "black", 7, -66, -295, 0.51, 0.49, 0);

        body.moveToFront();
        leftEye.moveToFront();
        rightEye.moveToFront();
        leftHand.moveToFront();
        rightHand.moveToFront();

    }
}