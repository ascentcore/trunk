import { select, easeSin, easeElasticInOut } from "d3v4";
import * as d3 from "d3v4"

export default function army(config) {
    const { setEyes, rightHand, leftHand, vectorGroupFloating, generatePath } = config;
    setEyes("angry", "angry")

    const armyHelmet = vectorGroupFloating.append("path");
    const armyHelmetPath = 'M 50 500 Q 50 500 100 450 Q 50 200 300 200 Q 400 200 500 200 Q 750 200 700 450 Q 750 500 750 500 Q 400 500 50 500 '

    const armyStar = vectorGroupFloating.append("path");
    const armyStarPath = 'M26 -22 L34 -4 L52 0 L38 10 L42 28 L26 16 L10 28 L14 10 L0 0 L18 -4 Z'

    const shapes = {

        helmet : generatePath(armyHelmet, armyHelmetPath, 'transparent', 'black', 10, -15, -160, 0.29, 0.29, 0),
        star : generatePath(armyStar, armyStarPath, 'black', 'black', 1, 75, -65, 1, 1, 0)
    }

    return shapes
}
