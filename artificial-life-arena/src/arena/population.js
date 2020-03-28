import Selection from './evolution/selection';
import Brain from './evolution/brain';
import { operations } from './constants';

export default class Population {
    constructor(tf, popConfig, boundaries) {
        Object.assign(this, popConfig, boundaries);
        const { initialPopulation, keep, type, canMove, net, r, g, b, character, dna, featureProps, mutationRate, mutationScale } = this;
        this.activeCount = canMove ? initialPopulation : 0;
        this.selection = new Selection(keep);
        this.saveDNA = selection => {
            const best = selection.getBest();
            if (best) {
                popConfig.dna = best;
            }
        }
        this.individuals = [];
        for (let i = 0; i < initialPopulation; i++) {
            const individual = {
                energy: 1,
                type,
                age: 0,
                lastAction: -1,
                lastEatTime: 0,
                lastEat: 0,
                r, g, b,
                character,
                alive: true,
                visited: []
            }

            if (canMove && !individual.brain) {
                individual.brain = new Brain(tf, net, { mutationRate, mutationScale, featureProps });
                if (dna) {
                    const dnaWeights = dna.weights.reduce((memo, item) => {
                        const row = [];
                        item.forEach(cell => {
                            row.push(Object.values(cell));
                        })
                        memo.push(row);
                        return memo;
                    }, []);
                    individual.brain.setWeights(dnaWeights)
                }
            }

            individual.die = () => {
                individual.energy = 0;
                individual.alive = false;
                if (canMove) {
                    this.activeCount--;
                    this.selection.push(individual);
                }
            }

            this.individuals.push(individual);
        }
    }

    getActiveCount() {
        return this.activeCount;
    }

    evolve(duration) {
        if (this.onSpeciesEnd) {
            this.onSpeciesEnd(this.selection, duration);
        }
        this.saveDNA(this.selection);
        for (let i = 0; i < this.individuals.length; i++) {
            const ind = this.individuals[i];
            ind.energy = 1;
            ind.alive = true;
            ind.visited = [];
            if (this.canMove) {
                ind.x = ind.startX;
                ind.y = ind.startY;
                ind.age = 0;
                ind.lastAction = -1;
                ind.lastEatTime = 0;
                ind.lastEat = 0;
                try {
                    const inheritFrom = i === 0 ? this.selection.getBest() : this.selection.select();
                    ind.brain.setWeights(inheritFrom.weights, i !== 0);
                } catch (err) {
                    console.log(err)
                }
                this.activeCount = this.individuals.length;
            }
        }
    }

    decide() {
        if (this.canMove) {
            return this.individuals.reduce((memo, item) => {
                const { energy, alive } = item;
                if (energy > 0 && alive) {
                    item.age++;
                    const genes = this.getNeighbours(item);
                    if (this.featureProps) {
                        this.featureProps.forEach(prop => genes.push(item[prop] || 0))
                    }
                    const promise = item.brain.predict(genes)
                    item.lastEatTime++;
                    promise.then(decision => {
                        // eslint-disable-next-line no-unused-vars
                        const [val, operationIndex] = decision.reduce((dm, decValue, index) => {
                            const [value] = dm;
                            if (decValue > value) {
                                return [decValue, index];
                            } else {
                                return dm;
                            }
                        }, [0, -1]);

                        item.lastAction = operationIndex;
                        item.lastEat = 0;
                        item.energy -= this.energyLoss;
                    })

                    return memo.concat(promise);
                } else {
                    return memo;
                }
            }, []);
        }
    }

    act() {
        if (this.canMove) {
            const { width, height } = this;
            this.individuals.forEach(individual => {
                const { lastAction, energy, alive } = individual;

                if (alive) {
                    if (energy > 0 && lastAction !== -1) {
                        operations[lastAction](individual);
                    }

                    if (individual.alive && (energy < 0 || individual.x < 0 || individual.y < 0 || individual.x > width - 1 || individual.y > height - 1)) {
                        individual.die()
                    }
                }
            })
        }
    }
}
