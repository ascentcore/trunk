import { operations } from '../constants';

export default class Brain {
    constructor(tf, net, config) {
        this.tf = tf;

        this.inputSize = operations.length + (config.featureProps ? config.featureProps.length : 0);

        this.config = Object.assign({ mutationRate: 0.01, mutationScale: 0.2 }, config)

        const { layers, sequential, tensor } = tf;
        const { dense } = layers;

        const model = sequential();
        this.shapes = []
        let inputSize = this.inputSize;
        net.forEach(layerSetup => {
            const [outputSize, activation] = layerSetup
            this.shapes.push([inputSize, outputSize])
            model.add(dense({
                units: outputSize,
                activation,
                inputShape: [inputSize]
            }))
            inputSize = outputSize;
        })

        this.shapes.push([inputSize, operations.length]);
        this.model = model;
        this.predict = arr => {
            const input = arr.slice(0, this.inputSize);

            const promise = this.model.predict(tensor([input])).data();
            return promise;
        }
    }

    updateModel(model, bestArr) {
        const { tensor2d, tensor1d } = this.tf;
        for (let i = 0; i < bestArr.length; i++) {
            const [w, b] = bestArr[i];
            const newWeights = w.reduce((memo, item, itemIndex) => {
                memo.push(bestArr[i][0][itemIndex])
                return memo;
            }, [])

            const newBiases = b.reduce((memo, item, itemIndex) => {
                memo.push(bestArr[i][0][itemIndex])
                return memo;
            }, [])

            model.layers[i].setWeights([tensor2d(newWeights, this.shapes[i]), tensor1d(newBiases)])
        }

        return model
    }

    getArrOfModel(model) {
        const arr = []
        for (let i = 0; i < model.layers.length; i++) {
            const wb = []
            model.layers[i].getWeights().forEach(weight => {
                wb.push(weight.dataSync())
            })
            arr.push(wb)
        }
        return arr;
    }

    getWeights() {
        return this.getArrOfModel(this.model);
    }

    setWeights(inheritFrom, mutate = false, mutationRate) {
        let arrs = mutate ? [] : inheritFrom;
        const mutationScaleStart = this.config.mutationScale / 2;
        if (mutate) {
            inheritFrom.forEach(layer => {
                const [w, b] = layer;
                const nw = []
                const nb = []
                for (let i = 0; i < w.length; i++) {
                    if (Math.random() < (mutationRate || this.config.mutationRate)) {
                        nw[i] = w[i] - mutationScaleStart + Math.random() * this.config.mutationScale;
                    } else {
                        nw[i] = w[i]
                    }
                }

                for (let i = 0; i < b.length; i++) {
                    if (Math.random() < (mutationRate || this.config.mutationRate)) {
                        nb[i] = b[i] - mutationScaleStart + Math.random() * this.config.mutationScale;
                    } else {
                        nb[i] = b[i]
                    }
                }

                arrs.push([nw, nb]);
            })
        }

        this.updateModel(this.model, arrs);
    }

    inherit(model, mutate = false, mutationRate) {
        const inheritFrom = this.getArrOfModel(model);
        this.setWeights(inheritFrom, mutate, mutationRate)
    }

}