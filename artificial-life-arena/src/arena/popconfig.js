const MAP_WIDTH = 50
const MAP_HEIGHT = 50

export default {
    map: {
        width: MAP_WIDTH,
        height: MAP_HEIGHT
    },
    iterations: 0,
    onIterationEnd: function (arena) {
        console.log(`Iteration: ${arena.iterations}, Tick Count: ${arena.tickCount}`)
    },
    populations: [

        {
            character: '🤔',
            initialPopulation: 40,
            keep: 1,
            type: 2,
            canMove: true,
            randomPoints: false,
            featureProps: ['lastEatTime', 'lastAction'],
            energyLoss: 0.05,
            r: 0,
            g: 0,
            b: 255,
            mutationRate: 0.01,
            mutationScale: 1,
            net: [
                [10, 'softsign'],
                [6, 'relu'],
                [12, 'linear'],
                [4],
            ]
        },
        {
            character: '🍅',
            initialPopulation: 300,
            type: 1,
            canMove: false,
            randomPoints: true,
            r: 0,
            g: 125,
            b: 0
        },
    ],
    seed: 'battlearena',
}