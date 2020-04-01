import { DEFAULTS, LEGEND_ITEMS, initializePopulation } from './population';
import './styles/spectre.min.css';
import './styles/spectre-icons.min.css';

// Scenario templates
const templates = [
    { "name": "Default", "value": { ...DEFAULTS } },
    { "name": "Large Size City", "value": { "name": "Large Size City", "populationSize": 10000, "commercialAreas": 250, "socialAreas": 300 } },
    { "name": "Medium Size City", "value": { "name": "Medium Size City", "populationSize": 5000, "commercialAreas": 120, "socialAreas": 150 } },
    { "name": "Small Size City", "value": { "name": "Small Size City", "populationSize": 1000, "commercialAreas": 60, "socialAreas": 80 } },
    { "name": "Work From Home", "value": { "name": "Work From Home", "commercialAreas": 0, "workerPercent": 0 } },
    { "name": "Isolation: Visits Disalowed / Shopping Allowed", "value": { "name": "Visits Disalowed / Shopping Allowed", "visitProbability": 0, "socialProbability": DEFAULTS.socialProbability, "workerPercent": 0 } },
    { "name": "Isolation: Visits Allowed / Shopping Disalowed", "value": { "name": "Visits Allowed / Shopping Disalowed", "visitProbability": DEFAULTS.visitProbability, "socialProbability": 0, "workerPercent": 0 } },
    { "name": "Medium Size City / Large Office Buildings", "value": { "name": "Medium Size City / Large Office Buildings", "populationSize": 5000, "commercialAreas": 10, "socialAreas": 150, "workerPercent": 0.8 } },
    { "name": "Medium Size City / Small Office Buildings", "value": { "name": "Medium Size City / Small Office Buildings", "populationSize": 5000, "commercialAreas": 400, "socialAreas": 150, "workerPercent": 0.8 } },
]

// Population to simulate
const populations = []

// Label Dictionary
const dictionary = {
    "startManifest": "Manifestation Start (day)",
    "manifestUpTo": "Manifestation Delay (days)",
    "recoveryTime": "Recovery Time (days)"
}

let frameskip = 0;          // current frameskip
let currentFrame = 0;       // framecounter - decreased by frameskip (render on 0)
let overwrite = false;      // template overwrite flag
let speed = 1               // current speed - 1: fastest
let currentIndex = speed;   // current index
let minute = 5 * 60;        // Initialize time at 5:00 AM in the morning 


// Programatically created elements
const time = document.createElement('span');
time.className = "chip"

// List of ID selectors from he HTML - this is used for DOM manipulation
const selectors = ['speed', 'slower', 'faster', 'stop', 'frameskip', 'fsinc', 'fsdec', 'setup', 'virus-setup', 'simulations', 'addsimulation', 'header', 'simulation-card', 'legend'].reduce((memo, key) => {
    memo[key] = document.querySelector(`#${key}`)
    return memo;
}, {});

LEGEND_ITEMS.forEach(legendItem => {
    selectors.legend.innerHTML += `
        <div class="chip">
            <figure class="avatar avatar-sm" style="border: 1px solid #000; background-color: ${legendItem.color}"></figure>${legendItem.name}
        </div>
    `
})

// Append children to DOM
selectors.header.appendChild(time)


/**
 * Append input control to DOM
 * @param {*} obj - ref to take / store information at [key] from/into
 * @param {*} keys - list of keys to render controls for
 * @param {*} id - DOM id reference for parent
 * @param {*} suffix - input class name (col-6 - half the screen)
 */
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
        const inputBox = document.querySelector(`#${key}`)
        inputBox.onchange = evt => {
            const { value } = evt.target;

            if (typeof (obj[key]) == 'string') {
                obj[key] = value;
            } else {
                const numVal = parseFloat(value);
                obj[key] = numVal;
            }

            console.log(value, obj[key])
        }
    })

}




// Prepare initial simulatin setup object
let currentSetup = Object.assign({}, DEFAULTS);

// Virus Setup Controls
appendControls(currentSetup, ['startManifest', 'manifestUpTo', 'spreadProbability', 'recoveryTime', 'mortality', 'reinfectProbability'], 'virus-setup');

// Population Setup Controls
appendControls(currentSetup, ['populationSize', 'workerPercent', 'commercialAreas', 'socialAreas', 'visitProbability', 'socialProbability'], 'setup');

// Simulation controls
appendControls(currentSetup, ['name'], 'simulation-card', 'col-12');

const html = `<div class="column col-12">
    <div class="form-group">
        <label class="form-label" for="templates">Select from template</label>
        <select class="form-select" placeholder="Template" id="templates">
            <option>Select template</option>
            ${templates.map((template, idx) => `<option value="${idx}" >${template.name}</option>`)}
        </select>
    </div>
    <div class="form-group" style="display: inline-block">
        <label class="form-switch">
            <input type="checkbox"  id="overwrite"/>
            <i class="form-icon"></i> Overwrite my current settings
        </label>
    </div>
</div>`


const simulationCard = document.querySelector('#simulation-card');
const buf = document.createElement('span')
buf.innerHTML += html;
simulationCard.appendChild(buf)

const templateSelector = simulationCard.querySelector('#templates');
const overwriteSelector = simulationCard.querySelector('#overwrite');


/**
 * Add population
 */
function addPopulation() {
    console.log(currentSetup)
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


// ---------[ Action Listeners ]--------- //

selectors.fsinc.onclick = () => {
    frameskip++;
    selectors.frameskip.innerHTML = `Frameskip: ${frameskip}`;
}

selectors.fsdec.onclick = () => {
    frameskip--;
    if (frameskip < 0) {
        frameskip = 0;
    }
    selectors.frameskip.innerHTML = `Frameskip: ${frameskip}`;
}

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

templateSelector.onchange = evt => {
    const { value } = evt.target;

    if (value !== 'Select template') {
        if (overwrite) {
            currentSetup = { ...DEFAULTS };
        }

        const index = parseInt(value);
        const template = templates[index].value;

        Object.keys(template).forEach(key => {
            document.querySelector(`#${key}`).value = template[key];
            currentSetup[key] = template[key]
        })
    }
}

overwriteSelector.onchange = evt => {
    overwrite = evt.target.checked;
}

selectors.addsimulation.onclick = e => addPopulation();


// ----- Initialized population and start simulation ----- //
addPopulation();

Object.assign(currentSetup, templates[4].value)
currentSetup.name += ' - Visits/Shopping Allowed';
addPopulation();

Object.assign(currentSetup, DEFAULTS)

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
        if (currentFrame-- < 0) {
            populations.forEach(pop => pop.render())
            currentFrame = frameskip;
        }
        render();
    })
}

render();

