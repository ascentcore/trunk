import { DEFAULTS, initializePopulation } from './population';
import './styles/spectre.min.css';
import './styles/spectre-icons.min.css';

const selectors = ['speed', 'slower', 'faster', 'stop', 'setup', 'virus-setup', 'simulations', 'addsimulation', 'header', 'simulation-card'].reduce((memo, key) => {
    memo[key] = document.querySelector(`#${key}`)
    return memo;
}, {});

const time = document.createElement('span');
time.className = "chip"

selectors.header.appendChild(time)

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
    "startManifest": "Manifestation Start (day)",
    "manifestUpTo": "Manifestation Delay (days)",
    "recoveryTime": "Recovery Time (days)"
}

function appendControls(obj, keys, id, suffix = 'col-6') {
    keys.forEach(key => {
        let finalResult = dictionary[key];
        if (!finalResult) {
            let result = key.replace(/([A-Z])/g, " $1");
            finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        }

        const html = `<div class="form-group">
            <label class="form-label" for="${key}">${finalResult}</label>
            <input class="form-input" value="${obj[key]}" id="${key}" type="${typeof (obj[key]) === 'string' ? 'text' : 'number'}" min="0">        
          </div>
        `
        const wrapper = document.createElement('div');
        wrapper.className = 'column ' + suffix;
        wrapper.innerHTML = html;
        selectors[id].appendChild(wrapper);
        const inputBox = wrapper.querySelector('input')
        inputBox.onchange = evt => {
            const { value } = evt.target;
            if (typeof (obj[key]) == 'string') {
                obj[key] = value;
            } else {
                const numVal = parseFloat(value);
                obj[key] = numVal;
            }
        }
    })

}

const currentSetup = Object.assign({}, DEFAULTS);
appendControls(currentSetup, ['populationSize', 'workerPercent', 'commercialAreas', 'socialAreas', 'visitProbability', 'socialProbability'], 'setup');
appendControls(currentSetup.virus, ['startManifest', 'manifestUpTo', 'spreadProbability', 'recoveryTime', 'mortality', 'reinfectProbability'], 'virus-setup');
appendControls(currentSetup, ['name'], 'simulation-card', 'col-12');

const populations = []
function addPopulation() {
    const pop = initializePopulation(currentSetup);
    selectors.simulations.appendChild(pop.wrapper)
    const action = pop.wrapper.querySelector('.sim-control')
    const delBtn = document.createElement('button')
    delBtn.className = 'btn btn-small btn-error';
    delBtn.innerHTML = '<i class="icon icon-shutdown"></i> Remove Simulation'
    delBtn.style = 'float: right;'
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

let speed = 1
let currentIndex = speed;
let minute = 4 * 60;

window.setInterval(() => {
    currentIndex--;
    if (currentIndex < 1 && speed !== -1) {
        currentIndex = speed;
        populations.forEach(pop => pop.tick(minute))
        if (minute++ > 60 * 24) {
            minute = 0;
            populations.forEach(pop => pop.day())
        }
        const hour = Math.floor(minute / 60)
        const prefix = hour > 7 && hour < 19 ? '☀️' : '🌙'

        time.innerHTML = `<figure class="avatar avatar-sm" style="text-align: center; padding-top: 3px" >${prefix}</figure>Time: ${('' + hour).padStart(2, '0')}:${('' + Math.floor(minute % 60)).padStart(2, '0')}`
    }
}, 1)

function render() {
    window.requestAnimationFrame(() => {
        populations.forEach(pop => pop.render())
        render();
    })
}

render();

