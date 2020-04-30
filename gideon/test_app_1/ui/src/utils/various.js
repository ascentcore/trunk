export function genColor(str) {
    // generate hex color based on a string as seed
    const seed = str.split('').reduce((acc, v) => acc + v.charCodeAt(0), 0);
    let color = Math.floor(Math.abs(Math.sin(seed) * 16777215) % 16777215).toString(16);

    while (color.length < 6) {
        color = '0' + color;
    }

    return `#${color}`;
}

export function getEnNumberSuffix(v) {
    const posRemainder = !!v ? v % 10 : false;
    const posSuffix = !v
        ? '' // nothing for 0, undefined
        : v > 100 && [11, 12, 13].indexOf(v % 100) > -1
        ? 'th' // th for ..11, ..12,  ..13
        : posRemainder === 1
        ? 'st'
        : posRemainder === 2
        ? 'nd'
        : posRemainder === 3
        ? 'rd'
        : 'th'; // th for everything else

    return posSuffix;
}

export function getUnixTimestamp(str) {
    return new Date(str).getTime();
}
