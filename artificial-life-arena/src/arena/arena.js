import Population from './population';

import { FOOD, DIE, NOTHING, SAME } from './constants';

export default class Arena {

    constructor(config) {
        this.config = config;
        this.iterations = this.config.iterations;
        this.arena = {};
        this.tickCount = 0;
    }

    getCompare(ent, ents) {
        let hasEnemy = false;
        let hasFood = false;
        let same = false;
        ents.forEach(nent => {
            if (nent.type < ent.type && nent.visited.indexOf(ent) === -1) {
                hasFood = true
            } else if (nent.type > ent.type) {
                hasEnemy = true
            } else {
                same = true;
            }
        })

        return hasEnemy ? DIE : hasFood ? FOOD : same ? SAME : NOTHING;
    }

    getNeighbours(individual) {
        const { x, y } = individual;
        const { width, height } = this.config.map;
        const neigh = [];
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i !== x || j !== y) {
                    if (i === x || j === y) {
                        const ent = this.arena[`${i}-${j}`];
                        if (i < 0 || j < 0 || i > width || j > height) {
                            neigh.push(DIE)
                        } else if (Array.isArray(ent)) {
                            neigh.push(this.getCompare(individual, ent))
                        } else {
                            neigh.push(NOTHING)
                        }
                    }
                }
            }
        }
        return neigh;
    }

    addToArena(individual) {
        const { x, y } = individual;
        const key = `${x}-${y}`;
        const obj = this.arena[key];

        if (obj) {
            obj.push(individual);
        } else {
            this.arena[key] = [individual]
        }
    }

    resetArena() {
        this.arena = {}
        this.populations.forEach(pop => {
            pop.individuals.forEach(ind => {
                if (ind.energy > 0 && ind.alive) {
                    this.addToArena(ind);
                }
            })
        })
    }

    nextGen() {
        if (this.config.onIterationEnd) {
            this.config.onIterationEnd(this);
        }
        this.iterations++;
        this.populations.forEach(pop => {
            pop.evolve(this.tickCount)
        })
        this.tickCount = 0;
        this.resetArena();
    }

    reset() {
        const { seed, populations, map: { width, height } } = this.config;
        Math.seedrandom(seed);
        this.populations = []
        populations.forEach(pop => {
            const { randomPoints, startX: predefStartX, startY: predefStartY } = pop;
            const [sx, sy] = [predefStartX || Math.floor(Math.random() * width), predefStartY || Math.floor(Math.random() * height)];
            const population = new Population(this.config.tf, pop, this.config.map);
            population.getNeighbours = ind => this.getNeighbours(ind);
            population.individuals.forEach(ind => {
                const startX = randomPoints ? Math.floor(Math.random() * width) : sx;
                const startY = randomPoints ? Math.floor(Math.random() * height) : sy
                Object.assign(ind, {
                    startX,
                    startY,
                    x: startX,
                    y: startY
                });
            })
            this.populations.push(population);
        });

        this.resetArena();
    }

    tick() {
        return new Promise(res => {
            this.tickCount++;
            const decisions = this.populations.reduce((memo, pop) => {
                return memo.concat(pop.decide());
            }, []);

            Promise.all(decisions).then(() => {
                this.resetArena()
                this.totalActive = 0;

                this.populations.forEach(pop => {
                    pop.act();
                });

                Object.values(this.arena).forEach(arr => {
                    if (arr.length > 1) {
                        for (let i = 0; i < arr.length - 1; i++) {
                            const left = arr[i];
                            for (let j = i + 1; j < arr.length; j++) {
                                const right = arr[j];
                                let weak, strong;
                                if (left.type !== right.type) {
                                    if (left.type < right.type) {
                                        weak = left;
                                        strong = right;
                                    } else {
                                        weak = right;
                                        strong = left;
                                    }
                                }

                                if (weak && strong && weak.visited.indexOf(strong) === -1) {
                                    strong.energy += weak.energy;
                                    strong.lastEat = 1;
                                    strong.lastEatTime = 0;

                                    weak.visited.push(strong);

                                    if (this.config.removeWeak) {
                                        weak.die();
                                    }

                                    if (strong.energy > 1) {
                                        strong.energy = 1;
                                    }
                                }
                            }
                        }
                    }
                });

                this.populations.forEach(pop => {
                    this.totalActive += pop.getActiveCount();
                });

                if (this.config.renderer) {
                    this.config.renderer.render(this);
                }

                if (this.totalActive === 0) {
                    this.config.removeWeak = false;
                    this.nextGen()
                }

                res();
            })
        });
    }

}
