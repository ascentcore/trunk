import { VIDEO_WIDTH } from '../constants';

const width = VIDEO_WIDTH;
const def = {
  width,
  height: (width * 3) / 4,
};

export default class VideoInput {
  constructor(conf) {
    const config = { ...def, ...conf };
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.style.width = config.width;
    canvas.style.height = config.height;
    canvas.style.marginLeft = '100px';
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    video.style.display = 'none';
    // canvas.style.visibility = 'hidden';

    document.body.appendChild(video);
    document.body.appendChild(canvas);

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          frameRate: 20,
        },
        audio: false,
      })
      .then((srcObject) => (video.srcObject = srcObject))
      .then(() => video.play());

    this.video = video;

    function drawImage(img, x, y, width, height, deg, flip, flop, center) {
      context.save();

      if (typeof width === 'undefined') width = img.width;
      if (typeof height === 'undefined') height = img.height;
      if (typeof center === 'undefined') center = false;

      // Set rotation point to center of image, instead of top/left
      if (center) {
        x -= width / 2;
        y -= height / 2;
      }

      // Set the origin to the center of the image
      context.translate(x + width / 2, y + height / 2);

      // Rotate the canvas around the origin
      var rad = 2 * Math.PI - (deg * Math.PI) / 180;
      context.rotate(rad);

      // Flip/flop the canvas
      let flipScale = 1;
      let flopScale = 1;
      if (flip) flipScale = -1;
      else flipScale = 1;
      if (flop) flopScale = -1;
      else flopScale = 1;
      context.scale(flipScale, flopScale);

      // Draw the image
      context.drawImage(img, -width / 2, -height / 2, width, height);

      context.restore();
    }

    this.draw = async () => {
      drawImage(video, 0, 0, canvas.width, canvas.height, 0, true);
    };

    this.config = config;
    this.canvas = canvas;
  }

  getData() {
    this.draw();
    const { canvas, video, config } = this;
    return {
      canvas,
      video,
      config,
    };
  }
}
