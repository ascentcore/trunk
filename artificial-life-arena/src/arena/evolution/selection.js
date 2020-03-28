export default class Selection {

    constructor(keepRank = 5) {

        this.keepRank = keepRank;
        this.top = [];
        this.selectionProbability = [];
        for (let i = 0; i < keepRank; i++) {
            this.selectionProbability.push((2 * keepRank + 1 - 2 * i) / keepRank / keepRank);
        }
        this.id = Math.random();

    }

    getBest() {
        return this.top[0];
    }

    push(individual) {
        if (this.top.length === 0 || individual.age > this.top[this.top.length - 1].age) {
            this.top.push({ age: individual.age, weights: individual.brain.getWeights() });
            this.top.sort(function (a, b) { return b.age - a.age });
            this.top = this.top.slice(0, this.keepRank)
        }
    }

    select() {
        let index = 0;
        let rand = Math.random();
        let selected;
        while (rand > 0 && index < this.top.length) {
            selected = this.top[index];
            rand -= this.selectionProbability[index];
            index++;

        }

        return selected;

    }
}
