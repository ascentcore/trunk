import * as tf from '@tensorflow/tfjs';
let model;

const NORMALIZATION_OFFSET = tf.scalar(127.5);
const EMOTION_CLASSES = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"];

export const prepImg = (img, size) => {

  // Convert to tensor
  const imgTensor = tf.browser.fromPixels(img);

  // Normalize from [0, 255] to [-1, 1].
  const normalized = imgTensor
    .toFloat()
    .sub(NORMALIZATION_OFFSET)
    .div(NORMALIZATION_OFFSET);


  if (imgTensor.shape[0] === size && imgTensor.shape[1] === size) {
    return normalized;
  }


  // Resize image to proper dimensions
  const alignCorners = true;
  return tf.image.resizeBilinear(normalized, [size, size], alignCorners);

};


export const rgbToGrayscale = async imgTensor => {

  const minTensor = imgTensor.min()
  const maxTensor = imgTensor.max()
  const min = (await minTensor.data())[0]
  const max = (await maxTensor.data())[0]
  minTensor.dispose()
  maxTensor.dispose()

  // Normalize to [0, 1]
  const normalized = imgTensor.sub(tf.scalar(min)).div(tf.scalar(max - min));

  // Compute mean of R, G, and B values
  let grayscale = normalized.mean(2);

  // Expand dimensions to get proper shape: (h, w, 1)
  return grayscale.expandDims(2);

}

export default async inputData => {

  if (!model) {
    model = await tf.loadLayersModel(
      'http://localhost:4500/emotions/model.json'
    );

    // Warmup model
    const inShape = model.inputs[0].shape.slice(1);
    const result = tf.tidy(() => model.predict(tf.zeros([1, ...inShape])));
    await result.data();
    result.dispose();

  }

  const { people } = inputData;

  if (people) {
    people.forEach(async person => {
      const { imgData } = person.face;

      //convert to tensor and resize if necessary
      let normData = await prepImg(imgData, 48);
      normData = await rgbToGrayscale(normData)
      normData = normData.reshape([1, ...normData.shape]);

      person.emotions = await model.predict(normData).data();

      let maxIndex = 0, maxValue = 0;

      person.emotions.forEach((cl, index) => {
        if (maxValue < cl) {
          maxValue = cl;
          maxIndex = index;
        }
      });

      person.emotions = EMOTION_CLASSES[maxIndex];

      console.log(`The Ceasar has as current stance: ${person.emotions}`);


      // here Cornel updated the object through Black Magic:




    });
  }
};
