const faceDetector = new window.FaceDetector({
  maxDetectedFaces: 1,
});

export default async (inputData) => {
  const {
    video: { canvas, videoConfig },
  } = inputData;

  const context = canvas.getContext('2d');
  const faces = await faceDetector.detect(canvas);

  faces.forEach((face) => {
    const {
      boundingBox: { x, y, width, height },
    } = face;

    context.beginPath();
    context.rect(x, y, width, height);
    context.stroke();
    face.imgData = context.getImageData(x, y, width, height);
  });

  return {
    people: faces.reduce((memo, item) => memo.concat({ face: item }), []),
    videoConfig,
  };
};
