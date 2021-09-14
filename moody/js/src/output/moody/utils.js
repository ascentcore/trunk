function createSvg(boxWidth, boxHeight) {
  const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElem.setAttributeNS(null, 'viewBox', '0 0 ' + boxWidth + ' ' + boxHeight);
  svgElem.setAttributeNS(null, 'width', boxWidth);
  svgElem.setAttributeNS(null, 'height', boxHeight);
  svgElem.style.display = 'block';
  svgElem.style.margin = 'auto';
  svgElem.innerHTML = `
    <defs>
      <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
      </filter>
    </defs>`;

  return svgElem;
}

function debounce(func, wait = 300, immediate = false, maxTicks = -1) {
  let timeout;
  let currentTicks = maxTicks;
  return function () {
    const context = this,
      args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) {
        currentTicks = maxTicks;
        func.apply(context, args);
      }
    };
    const callNow = currentTicks-- === 0 || (immediate && !timeout);
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      currentTicks = maxTicks;
      func.apply(context, args);
    }
  };
}

export default {
  debounce,
  createSvg,
};
