import { select, easeSin, easeElasticInOut } from "d3v4";
import * as d3 from "d3v4"

export default function greeting(config) {
    const { setEyes, rightHand, leftHand } = config;

    setEyes("default", "default")

    const int1 = setInterval(() => {
        leftHand
            .transition()
            .ease(easeSin)
            .duration(300)
            .attr('transform', 'translate(0,0)scale(-1,-1)rotate(160)')
            .transition()
            .ease(easeSin)
            .duration(300)
            .attr('transform', 'translate(0,0)scale(1,1)rotate(-90)')
    }, 600)

    return [int1]
}