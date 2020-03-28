import * as tf from '@tensorflow/tfjs';
import React, { Fragment, useState } from 'react';

const [WIDTH, HEIGHT] = [60, 40];

export const ACTIVATIONS = [
    'sigmoid',
    'hardSigmoid',
    'softplus',
    'softsign',
    'tanh',
    'softmax',
    'linear',
    'relu',
    'relu6',
    'selu',
    'elu',
]

let models;
const activationFunctions = ACTIVATIONS;
models = activationFunctions.map(activationFunctionName => {
    let model = tf.sequential();
    model.add(tf.layers.dense({
        units: 1,
        useBias: true,
        activation: activationFunctionName,
        inputDim: 1,
    }));
    model.compile({
        loss: 'meanSquaredError',
        optimizer: tf.train.adam(),
    });
    model.activationFunction = activationFunctionName;
    return model;
});

tf.tidy(() => {
    models.forEach(model => model.layers[0].setWeights([tf.tensor2d([[1]]), tf.tensor1d([0])]));
});

const LEFT = 5

const xs = tf.linspace(-LEFT, LEFT, 40);
const series = tf.tidy(() => models.map((model, idx) => {
    const ys = model.predict(xs.reshape([40, 1]));
    return {
        x: xs.dataSync(),
        y: ys.dataSync(),
        type: 'scatter',
        name: model.activationFunction,
    };
}));
xs.dispose();


const canvases = series.reduce((memo, serie) => {
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.margin = '20px';
    canvas.title = serie.name
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT / 2);
    ctx.lineTo(WIDTH, HEIGHT / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = '#FF0000';
    for (let idx = 0; idx < serie.x.length; idx++) {
        const operation = idx === 0 ? 'moveTo' : 'lineTo';
        ctx[operation](
            (LEFT + serie.x[idx]) * WIDTH / (LEFT * 2),
            HEIGHT / 2 - serie.y[idx] * (HEIGHT / 3))
    }
    ctx.stroke();
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255,255,255, 0.8)';
    ctx.fillRect(0, 0, WIDTH, 10);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.font = '10px';
    ctx.textAlign = "center";
    ctx.fillText(serie.name, WIDTH / 2, 8);

    memo[serie.name] = ctx.getImageData(0, 0, WIDTH, HEIGHT);

    return memo;
}, {});



function ActivationGraph(props) {
    const canvasRef = React.useRef(null)
    const { activation } = props;
    React.useEffect(() => {
        const { current } = canvasRef;
        const ctx = current.getContext('2d');
        ctx.putImageData(canvases[activation], 0, 0)

    }, [activation]);

    return <canvas width={WIDTH} height={HEIGHT} ref={canvasRef} />

}

export default ActivationGraph;
