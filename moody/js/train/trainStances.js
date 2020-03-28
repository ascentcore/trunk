const data = require('./data');
const tf = require('@tensorflow/tfjs-node');

const STANCE_CLASSES = ['Greet', 'Aggro', 'Idle', 'Silly', 'Dab','Super Sayian', 'Flexing', 'Army Salute', 'Johnny Bravo'];

//const STANCE_CLASSES = ['Greet', 'Aggro', 'Idle', 'Silly', 'Dab','Super Sayian'];

const STANCE_NUM_CLASSES = STANCE_CLASSES.length;

/**
 * Convert data arrays to `tf.Tensor`s.
 *
 * @param data input feature data
 * @param targets true category
 * @param testSplit Fraction of the data at the end to split as test data: a
 *                  number between 0 and 1.
 * @return A length-4 `Array`, with
 *   - training data as `tf.Tensor` of shape [numTrainExapmles, 4].
 *   - training one-hot labels as a `tf.Tensor` of shape [numTrainExamples, 3]
 *   - test data as `tf.Tensor` of shape [numTestExamples, 4].
 *   - test one-hot labels as a `tf.Tensor` of shape [numTestExamples, 3]
 */

function convertToTensors(data, targets, testSplit) {
    const numExamples = data.length;
    if (numExamples !== targets.length) {
        throw new Error('data and split have different numbers of examples');
    }

    // Randomly shuffle `data` and `targets`.
    const indices = [];
    for (let i = 0; i < numExamples; ++i) {
        indices.push(i);
    }
    tf.util.shuffle(indices);

    const shuffledData = [];


    const shuffledTargets = [];
    for (let i = 0; i < numExamples; ++i) {
        shuffledData.push(data[indices[i]]);
        shuffledTargets.push(targets[indices[i]]);
    }


    // Split the data into a training set and a test set, based on `testSplit`.
    const numTestExamples = Math.round(numExamples * testSplit);
    const numTrainExamples = numExamples - numTestExamples;

    const xDims = shuffledData[0].length;

    // Create a 2D `tf.Tensor` to hold the feature data.
    const xs = tf.tensor2d(shuffledData, [numExamples, xDims]);

    // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
    // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
    const ys = tf.oneHot(tf.tensor1d(shuffledTargets).toInt(), STANCE_NUM_CLASSES);

    // Split the data into training and test sets, using `slice`.
    const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
    const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
    const yTrain = ys.slice([0, 0], [numTrainExamples, STANCE_NUM_CLASSES]);
    const yTest = ys.slice([0, 0], [numTestExamples, STANCE_NUM_CLASSES]);
    return [xTrain, yTrain, xTest, yTest];
}




function getTrainingData(testSplit) {
    return tf.tidy(() => {
        const dataByClass = [];
        const targetsByClass = [];
        for (let i = 0; i < STANCE_CLASSES.length; ++i) {
            dataByClass.push([]);
            targetsByClass.push([]);
        }
        for (const example of data) {
            const target = example[example.length - 1];
            const data = example.slice(0, example.length - 1);
            dataByClass[target].push(data);
            targetsByClass[target].push(target);
        }

        const xTrains = [];
        const yTrains = [];
        const xTests = [];
        const yTests = [];
        for (let i = 0; i < STANCE_CLASSES.length; ++i) {
            const [xTrain, yTrain, xTest, yTest] =
                convertToTensors(dataByClass[i], targetsByClass[i], testSplit);
            xTrains.push(xTrain);
            yTrains.push(yTrain);
            xTests.push(xTest);
            yTests.push(yTest);
        }

        const concatAxis = 0;
        return [
            tf.concat(xTrains, concatAxis), tf.concat(yTrains, concatAxis),
            tf.concat(xTests, concatAxis), tf.concat(yTests, concatAxis)
        ];
    });
}




const params = {
    learningRate: 0.01,
    epochs: 500
}

async function trainModel(xTrain, yTrain, xTest, yTest) {

    console.log('Training model... Please wait.');


    // Define the topology of the model: two dense layers.
    const model = tf.sequential();

    model.add(tf.layers.dense(
        { units: 20, activation: 'relu', inputShape: [xTrain.shape[1]] }));
    model.add(tf.layers.dense(
        { units: 10, activation: 'relu' }));
    model.add(tf.layers.dense({ units: STANCE_CLASSES.length, activation: 'softmax' }));
    model.summary();

    const optimizer = tf.train.rmsprop(params.learningRate);
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    const trainLogs = [];


    // Call `model.fit` to train the model.

    const history = await model.fit(xTrain, yTrain, {
        epochs: params.epochs,
        validationData: [xTest, yTest],
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                trainLogs.push(logs);
                console.log(`Epoch: ${epoch}`);
            },
        }
    });

    console.log(history)

    return model;
}


//Demo 
async function stance() {
    const [xTrain, yTrain, xTest, yTest] = getTrainingData(0.8);
    model = await trainModel(xTrain, yTrain, xTest, yTest);
    await model.save('file://train/mymodel');

}

stance();