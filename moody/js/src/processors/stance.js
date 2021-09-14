import * as tf from '@tensorflow/tfjs';

let modelStance;

const STANCE_CLASSES = [
  'Greet',
  'Aggro',
  'Idle',
  'Silly',
  'Dab',
  'Super Sayian',
  'Flexing',
  'Army Salute',
  'Johnny Bravo',
  'I be flossin',
];

export default async (inputData) => {
  if (!modelStance) {
    modelStance = await tf.loadLayersModel(
      'http://localhost:4500/stance/model.json'
    );
  }

  if (inputData.people.length > 0) {
    inputData.people.forEach(async (person) => {
      const { position } = person;
      if (position) {
        const prediction = modelStance.predict(tf.tensor([position.tensor]));
        const data = await prediction.data();
        let maxIndex = 0,
          maxValue = 0;
        data.forEach((cl, index) => {
          if (maxValue < cl) {
            maxValue = cl;
            maxIndex = index;
          }
        });

        const stanceObj = {
          stanceClass: '',
          stanceIndex: 0,
        };

        stanceObj.stanceClass = STANCE_CLASSES[maxIndex];
        stanceObj.stanceIndex = maxIndex;

        person.stance = stanceObj;
      }
      return person.stance;
    });
  }
};
