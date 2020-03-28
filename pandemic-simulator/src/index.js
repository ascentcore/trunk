import { DEFAULTS, initializePopulation } from './population';

const selectors = ['speed', 'slower', 'faster', 'stop', 'setup', 'virus-setup', 'simulations', 'addsimulation'].reduce((memo, key) => {
    memo[key] = document.querySelector(`#${key}`)
    return memo;
}, {});

selectors.stop.onclick = e => {
    speed = speed === -1 ? 1 : -1;
    selectors.stop.innerHTML = speed !== -1 ? 'Pause' : 'Start';
}

selectors.faster.onclick = e => {
    if (speed > 0) {
        speed--
    }
}

selectors.slower.onclick = e => {
    speed++
}

const dictionary = {
    "startManifest": "Manifestation Start",
    "manifestUpTo": "Manifestation Delay"
}

function appendControls(obj, keys, id) {
    keys.forEach(key => {
        let finalResult = dictionary[key];
        if (!finalResult) {
            console.log(key)
            let result = key.replace(/([A-Z])/g, " $1");
            finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        }

        const html = `<div class="input-field col s6">
          <input value="${obj[key]}" id="${key}" type="number" min="0">
          <label class="active" for="${key}">${finalResult}</label>
        </div>`
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        selectors[id].appendChild(wrapper);
        const inputBox = wrapper.querySelector('input')
        inputBox.onchange = evt => {
            const { value } = evt.target;
            const numVal = parseFloat(value);
            obj[key] = numVal;
        }
    })

}

const currentSetup = Object.assign({}, DEFAULTS);
appendControls(currentSetup, ['populationSize', 'workerPercent', 'commercialAreas', 'socialAreas', 'visitProbability', 'socialProbability'], 'setup');
appendControls(currentSetup.virus, ['startManifest', 'manifestUpTo', 'spreadProbability', 'recoveryTime', 'mortality', 'reinfectProbability'], 'virus-setup');


const populations = []
function addPopulation() {
    const pop = initializePopulation(currentSetup);
    selectors.simulations.appendChild(pop.wrapper)
    const action = pop.wrapper.querySelector('.sim-control')
    const delBtn = document.createElement('button')
    delBtn.className = 'waves-effect waves-light btn-small red';
    delBtn.innerText = 'Remove'
    delBtn.onclick = () => {
        const idx = populations.indexOf(pop)
        populations.splice(idx, 1);
        selectors.simulations.removeChild(pop.wrapper);
    }
    action.appendChild(delBtn)
    populations.push(pop)
}

addPopulation();

selectors.addsimulation.onclick = e => addPopulation();

let speed = 2
let currentIndex = speed;
let minute = 8 * 60;

function tick() {
    window.requestAnimationFrame(() => {
        currentIndex--;
        if (currentIndex < 1 && speed !== -1) {
            currentIndex = speed;
            populations.forEach(pop => pop.tick(minute))
            minute++;
            if (minute++ > 60 * 24) {
                minute = 0;
                populations.forEach(pop => pop.day())
            }

        }
        tick()
    })
}

tick();
