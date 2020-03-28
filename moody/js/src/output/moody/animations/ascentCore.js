import { select, easeSin, easeElasticInOut } from "d3v4";
import * as d3 from "d3v4"

export default function ascentCore(config) {
    const { vectorGroupStatic, generatePath} = config;

    const ascentCoreGroup = vectorGroupStatic.append('g').attr('transform', 'translate(800,-460)scale(1.2,1.2)')

    const backGroundPath = 'M0 0 L64 0 L64 64 L0 64 Z';
    const backGround = ascentCoreGroup.append("path");
    generatePath(backGround, backGroundPath, '#FF715B', '#FF715B', 1, 5, 70, 3, 3, 90);

    const ascentPath = 'M10 54 L32 10 L56 54 L32 10 Z';
    const corePath = 'M243 95.15625 A 178 174 0 1 0 475 94.15625';

    const ascent = ascentCoreGroup.append("path");
    const core = ascentCoreGroup.append("path");

    generatePath(ascent, ascentPath, 'transparent', '#2e2d51', 3.8, -200, 57, 3.5, 3.5, 0);
    generatePath(core, corePath, 'transparent', '#2e2d51', 30, 17, 3, 0.45, 0.45, 90);
}