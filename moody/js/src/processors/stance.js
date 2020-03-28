import * as tf from "@tensorflow/tfjs"

let modelStance;
const STANCE_CLASSES = ['Greet', 'Aggro', 'Idle', 'Silly', 'Dab', 'Super Sayian',
                        'Flexing', 'Army Salute', 'Johnny Bravo', 'I be flossin'];


export default async inputData => {

    if (!modelStance) {
        modelStance = await tf.loadLayersModel('http://localhost:4500/stance/model.json');
        console.log(modelStance);
    }

    
    if (inputData.people.length > 0) {

 

        inputData.people.forEach(async (person, index) => {

            const { position } = person;
            if (position) {
            const prediction = modelStance.predict(tf.tensor([position.tensor]));
            const data = await prediction.data();
            let maxIndex = 0, maxValue = 0;
            data.forEach((cl, index) => {
                if (maxValue < cl) {
                    maxValue = cl;
                    maxIndex = index;
                }
            });

            const stanceObj = {
                stanceClass: " ",
                stanceIndex: 0
            };

            stanceObj.stanceClass = STANCE_CLASSES[maxIndex];
            stanceObj.stanceIndex = maxIndex;

            person.stance = stanceObj;

            // if(index == 0){
            // console.log(`The Ceasar has as current stance: ${person.stance.stanceClass}`);
            // }
            // else{
            // console.log(`Pleb ${index} has as current stance: ${person.stance.stanceClass}`);
            // }

        }

        })

    }



}