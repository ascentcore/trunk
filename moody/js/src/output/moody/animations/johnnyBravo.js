import { select, easeSin, easeElasticInOut } from "d3v4";
import * as d3 from "d3v4"

export default function johnnyBravo(config) {
    const { generatePath, vectorGroupFloating } = config;


    let jBSideRightPath = 'M 50 0 Q 0 0 50 100 L 50 0 '
    let jBSideLeftPath = 'M 50 0 Q 0 0 50 100 L 50 0 '
    let jBTopPath = 'M 250 550 L 500 550 Q 650 250 550 250 Q 500 150 350 50 Q 250 50 150 150 Q 150 300 250 550'
    let jBGlassesPath = 'M 150 250 C 50 450 400 450 350 250 L 450 250 C 400 450 750 450 650 250 L 150 250'

    const jBSideRight = vectorGroupFloating.append("path");
    const jBSideLeft = vectorGroupFloating.append("path");
    const jBTop = vectorGroupFloating.append("path");
    const jBGlasses = vectorGroupFloating.append("path");

    const object = {
        obj1: generatePath(jBSideRight, jBSideRightPath, 'yellow', 'black', 7, - 20, 5, 0.51, 0.48, -9),
        obj2: generatePath(jBSideLeft, jBSideLeftPath, 'yellow', 'black', 7, 220, 5, -0.51, 0.48, -9),
        obj3: generatePath(jBTop, jBTopPath, 'yellow', 'black', 7, -165, -281, 0.7, 0.51, 0),
        obj4: generatePath(jBGlasses, jBGlassesPath, 'black', 'black', 20, 0, 28, 0.25, 0.25, 0)
    }

    return object
}