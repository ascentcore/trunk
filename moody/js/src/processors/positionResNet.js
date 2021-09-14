import * as posenet from '@tensorflow-models/posenet';

let modelPoseNet;

window.poses = [];

export default async (inputData) => {
  if (!modelPoseNet) {
    modelPoseNet = await posenet.load();
  }

  const poses = await modelPoseNet.estimateMultiplePoses(
    inputData.video.canvas,
    {
      flipHorizontal: false,
      maxDetections: 5,
      scoreThreshold: 0.5,
      nmsRadius: 20,
    }
  );

  if (poses.length) {
    const found = poses.filter((pose) => pose.score > 0.5);
    const newPeople = [];

    found.forEach((element) => {
      const keypoints = element.keypoints;
      const ArrayWeWant = [];
      const HardCodedIndexes = [0, 5, 6, 7, 8, 9, 10];
      let foundPerson;

      for (let index of HardCodedIndexes) {
        ArrayWeWant.push(keypoints[index]);
      }

      const { x: noseX, y: noseY } = ArrayWeWant[0].position;

      for (let keypoint of ArrayWeWant) {
        keypoint.position.x -= noseX;
        keypoint.position.y -= noseY;
      }

      inputData.people.forEach((person) => {
        const { top, bottom, left, right } = person.face.boundingBox;
        if (noseX > left && noseX < right && noseY > top && noseY < bottom) {
          foundPerson = person;
        }
      });

      if (!foundPerson) {
        foundPerson = {};
        newPeople.push(foundPerson);
      }

      const tensor = ArrayWeWant.reduce((memo, item) => {
        return memo.concat([item.position.x, item.position.y]);
      }, []);

      foundPerson.position = {
        raw: element,
        tensor: tensor.slice(2),
      };
    });

    newPeople.forEach((newPerson) => {
      inputData.people.push(newPerson);
    });
  }
};
