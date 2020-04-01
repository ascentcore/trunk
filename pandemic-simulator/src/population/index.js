const CANVAS_WIDTH = 340
const GRAPH_HEIGHT = 80
const PADDING = 10
const CANVAS_HEIGHT = CANVAS_WIDTH + GRAPH_HEIGHT + PADDING

export const DEFAULTS = {
    name: 'Default Simulation',
    populationSize: 1000,
    workerPercent: 0.7,
    commercialAreas: 20,
    socialAreas: 30,
    visitProbability: 0.0002,
    socialProbability: 0.0004,
    mapSize: [30, 30],
    startManifest: 2,
    manifestUpTo: 6,
    spreadProbability: 0.015,
    recoveryTime: 4,
    mortality: 0.09,
    reinfectProbability: 0.001
}

export const CELL_COLORS = {
    0: 'rgba(138, 255, 105, 0.6)',
    1: 'rgba(105, 170, 255, 0.6)',
    2: 'rgba(255,  82, 235, 0.6)',
    3: 'rgba(125, 125, 125, 0.6)',
    4: 'rgba(255, 168, 105, 0.6)'
}

export const LEGEND_ITEMS = [
    { name: 'House', color: CELL_COLORS[0] },
    { name: 'Commercial / Work', color: CELL_COLORS[1] },
    { name: 'Hospital', color: CELL_COLORS[2] },
    { name: 'Social Area / Shop', color: CELL_COLORS[4] }
]


function renderCell(ctx, loc, resolution) {
    const { x, y, type } = loc;
    ctx.fillStyle = CELL_COLORS[type];
    ctx.fillRect(x - resolution / 2, y - resolution / 2, resolution, resolution);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.strokeRect(x - resolution / 2, y - resolution / 2, resolution, resolution);
    ctx.stroke()
}

export function initializePopulation(settings) {

    const config = Object.assign({}, DEFAULTS, settings);
    const { name, populationSize, workerPercent, commercialAreas, socialAreas, visitProbability, socialProbability } = config;
    const { startManifest, manifestUpTo, spreadProbability, mortality, recoveryTime, reinfectProbability } = config;

    // Compute the map size based on the population size, commercial and social areas - the minimum size is 30
    const lat = Math.max(Math.floor(Math.sqrt(populationSize / 2 + commercialAreas + socialAreas)), 30);
    config.mapSize = [lat, lat];
    const { mapSize } = config;

    const resolution = CANVAS_WIDTH / mapSize[0];   // Canvas cell resolution
    const map = {}              // Map dictionary
    const residential = [];     // Housing areas
    const commercial = [];      // Commercial areas
    const social = [];          // Social areas
    const individuals = [];     // Individuals

    let isolation = false;      // Isolation Flag

    // Conter properties
    let deaths = 0;
    let infected = 0;
    let hospitalized = 0;

    // Stats for graphs - initialize all arrays with 0
    const stats = {
        infected: new Array(CANVAS_WIDTH).fill(0),
        hospitalized: new Array(CANVAS_WIDTH).fill(0),
        dead: new Array(CANVAS_WIDTH).fill(0),
        days: new Array(CANVAS_WIDTH).fill(0),
    }

    /**
     * Update statistics
     * @param {*} statKey  - stat key to update (infected/hospitalized etc.)
     * @param {*} counter - value to add at the end
     */
    function updateStat(statKey, counter) {
        stats[statKey].splice(0, 1);
        stats[statKey].push(counter)
    }


    // Prepare DOM wrapper - sorry for the inline styles
    const wrapper = document.createElement('span')
    wrapper.style = "display: inline-block; padding: 10px; border: 1px solid #000; margin: 5px;";
    wrapper.innerHTML = `<h5 style="text-align: center">${name}</h5>`
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', CANVAS_WIDTH)
    canvas.setAttribute('height', CANVAS_HEIGHT)
    wrapper.appendChild(canvas);


    // Infect Button
    const infectButton = document.createElement('button')
    infectButton.innerText = 'Infect';
    infectButton.className = 'btn btn-small btn-error';
    infectButton.onclick = () => {
        const healthy = individuals.filter(ind => !ind.infected)
        infect(healthy[Math.floor(Math.random() * healthy.length)]);
    }

    // Isolation Control
    const isolationWrapper = document.createElement('div')
    isolationWrapper.className = 'sim-control';
    isolationWrapper.style = 'margin-top: 10px';
    isolationWrapper.innerHTML = `
    <div class="form-group" style="display: inline-block">
        <label class="form-switch">
            <input type="checkbox"  />
            <i class="form-icon"></i> Force Isolation
        </label>
    </div>`;
    isolationWrapper.appendChild(infectButton)
    const isolate = isolationWrapper.querySelector('input')
    isolate.onchange = evt => {
        isolation = evt.target.checked;
    }

    wrapper.appendChild(isolationWrapper)

    // ---------------- Map initialization ---------------- //

    /**
     * Find a free spot on the map and populate the cell with passed properties
     * @param {*} props - cell particularities
     */
    function findFreeSpot(props) {
        let spot;

        while (!spot) {
            const x = Math.floor(1 + Math.floor(Math.random() * (mapSize[0] - 1)))
            const y = Math.floor(1 + Math.floor(Math.random() * (mapSize[1] - 1)))
            const key = `${x}-${y}`;

            if (!map[key]) {
                spot = Object.assign({}, props, { x: x * resolution, y: y * resolution });
                map[key] = spot;
            }
        }

        return spot;
    }

    // Create the hospital
    const hospital = findFreeSpot({ type: 2 })

    // Create working places
    for (let i = 0; i < commercialAreas; i++) {
        const spot = findFreeSpot({ type: 1 });
        commercial.push(spot)
    }

    // Create shops
    for (let i = 0; i < socialAreas; i++) {
        const spot = findFreeSpot({ type: 4 });
        social.push(spot)
    }

    // Create population - not more than 4 individuals can occupy a housing spot
    for (let i = 0; i < populationSize; i++) {
        const individual = {}
        const freeHomes = residential.filter(spot => spot.size < 4);
        let assignedHome = freeHomes[Math.floor(Math.random() * freeHomes.length)];
        if (!residential.length || Math.random() < 0.4 || !assignedHome) {
            assignedHome = findFreeSpot({ type: 0, size: 0 });
            residential.push(assignedHome);
        }
        assignedHome.size += 1
        Object.assign(individual, {
            location: 0,
            offsetX: 0,
            offsetY: 0,
            x: assignedHome.x,
            y: assignedHome.y,
            currentTarget: assignedHome,
            destination: assignedHome,
            returnTime: 22 * 60,
            assignedHome
        });
        individuals.push(individual)
    }

    // Prepare the working schedule - sorry guys you have to go to work
    for (let i = 0; i < populationSize * workerPercent; i++) {
        individuals[i].destination = commercial[Math.floor(Math.random() * commercial.length)];
        individuals[i].destinationTime = (Math.floor(Math.random() * 4) + 6) * 60 + Math.floor(Math.random() * 30)
        individuals[i].workReturnTime = individuals[i].returnTime = individuals[i].destinationTime + 8 * 60;
    }

    const housing = [...commercial, ...residential, ...social, hospital];

    // Prepare offscreen canvas with the map - canvas performance
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;

    housing.forEach(loc => {
        renderCell(offscreenCanvas.getContext('2d'), loc, resolution)
    })

    function renderGraph(ctx, stat, r, g, b, a, prefix, offset = 0) {
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        let lastY, lastStat;
        for (let i = 0; i < stat.length; i++) {
            lastStat = stat[i]
            lastY = Math.floor(lastStat * GRAPH_HEIGHT / populationSize)
            ctx.beginPath();
            ctx.moveTo(i, CANVAS_HEIGHT);
            ctx.lineTo(i, CANVAS_HEIGHT - lastY);
            ctx.lineTo(i, CANVAS_HEIGHT - lastY + 2);
            ctx.lineTo(i, CANVAS_HEIGHT - lastY);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(0, CANVAS_HEIGHT - lastY);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - lastY);
        ctx.stroke();

        if (prefix) {
            ctx.fillStyle = '#000';
            ctx.font = "10px Lato";
            ctx.fillText(`${prefix}${lastStat}`, offset, CANVAS_HEIGHT - lastY - 2);
        }
    }


    function render() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(offscreenCanvas, 0, 0);

        individuals.forEach(ind => {
            const { x, y, infected, dead } = ind;

            if (!dead) {

                if (infected) {
                    ctx.fillStyle = 'rgb(255,0,0)';
                } else {
                    ctx.fillStyle = 'rgba(25,25,25,1)';
                }

                const xp = x
                const yp = y
                ctx.beginPath();
                const size = infected ? -2 : -1;
                const doubleSize = infected ? -4 : -2;
                ctx.fillRect(xp - size, yp - size, doubleSize, doubleSize);
                ctx.stroke()

                // Would have loved this  but is not performant on canvas
                // if (infected && timeUntilManifestation > 0) {
                //     ctx.strokeStyle = `rgb(255,0,0,1)`
                //     ctx.beginPath();
                //     ctx.strokeWidth = 2
                //     ctx.arc(xp, yp, 3, 0, 2 * Math.PI);
                //     ctx.stroke();
                // }
            }
        });


        renderGraph(ctx, stats.infected, 255, 0, 0, 0.35, 'Infected: ', 0)
        renderGraph(ctx, stats.hospitalized, 0, 136, 255, 0.35, 'Hospitalised: ', 60)
        renderGraph(ctx, stats.dead, 0, 0, 0, 0.6, 'Fatalities: ', 140)
        renderGraph(ctx, stats.days, 0, 0, 0, 0.5)
    }

    function infect(individual) {
        if (!individual.wasInfected || Math.random() < reinfectProbability) {
            infected++;
            individual.infected = true;
            individual.timeUntilManifestation =
                (startManifest + Math.floor(Math.random() * (manifestUpTo)))
                * 24 * 60;
            individual.willDie = Math.random() < mortality;
            individual.recover = (recoveryTime + Math.floor(recoveryTime * Math.random() * 0.3)) * 24 * 60;
        }
    }

    infect(individuals[0])


    function tick(minute) {


        individuals.forEach((ind, index) => {
            const { destination, destinationTime, returnTime, assignedHome } = ind;

            if (!ind.dead) {

                if (ind.currentTarget != hospital && !isolation) {

                    if (destinationTime === minute) {
                        if (destination && ind.currentTarget === assignedHome && destinationTime === minute) {
                            ind.currentTarget = destination;
                        }

                    } else if (ind.currentTarget !== assignedHome && returnTime === minute) {
                        ind.currentTarget = assignedHome;
                    } else if (!ind.social && ind.currentTarget === assignedHome) {
                        if (Math.random() < visitProbability) {
                            const visit = residential[Math.floor(residential.length * Math.random())];

                            if (visit != assignedHome) {
                                ind.social = true
                                ind.returnTime = minute + Math.floor(Math.random() * 3) * 60
                                ind.currentTarget = visit;
                            }
                        } else if (Math.random() < socialProbability) {
                            ind.social = true
                            const visit = social[Math.floor(social.length * Math.random())];
                            ind.returnTime = minute + Math.floor(Math.random() * 30) * 10
                            ind.currentTarget = visit;
                        }

                        if (ind.returnTime > 24 * 60 - 2) {
                            ind.returnTime = 24 * 60 - 2;
                        }
                    }
                }

                if (ind.infected) {
                    if (ind.timeUntilManifestation > 0) {
                        ind.timeUntilManifestation--;
                        if (Math.random() < spreadProbability) {
                            const nearest = individuals.filter(neigh => {
                                if (neigh == ind || neigh.infected) {
                                    return false;
                                }
                                const xd = (ind.x - neigh.x) * (ind.x - neigh.x);
                                const yd = (ind.y - neigh.y) * (ind.y - neigh.y);
                                const res = Math.sqrt(xd + yd);
                                return res < 4;
                            });



                            if (nearest && nearest.length) {
                                nearest.forEach(neigh => {
                                    if (Math.random() < spreadProbability) {
                                        infect(neigh)
                                    }
                                });
                            }
                        }
                    }

                    if (ind.timeUntilManifestation == 0) {
                        ind.timeUntilManifestation = -1;
                        if (ind.willDie) {
                            ind.dead = true;
                            deaths++;
                            infected--
                            if (ind.currentTarget == hospital) {
                                hospitalized--;
                            }
                        } else {
                            ind.currentTarget = hospital;
                            hospitalized++;
                        }
                    }

                    if (ind.currentTarget === hospital) {
                        ind.recover--;
                    }

                    if (ind.recover == 0) {

                        ind.infected = false;
                        ind.wasInfected = true;
                        infected--;
                        hospitalized--;
                        ind.currentTarget = ind.assignedHome;
                    }
                }

                const xDiff = ind.currentTarget.x - ind.x;
                const xModifier = Math.max(Math.min(resolution, xDiff), 1)
                const yDiff = ind.currentTarget.y - ind.y;
                const yModifier = Math.max(Math.min(resolution, yDiff), 1)
                ind.x += Math.random() < 0.95 ? Math.floor(Math.sign(xDiff) * xModifier / 2) : Math.floor(-xModifier / 2 + Math.random() * xModifier)
                ind.y += Math.random() < 0.95 ? Math.floor(Math.sign(yDiff) * yModifier / 2) : Math.floor(-yModifier / 2 + Math.random() * yModifier)
            }
        })

        // Update every 'hour'
        if (minute % 60 === 0) {
            updateStat('infected', infected)
            updateStat('dead', deaths)
            updateStat('hospitalized', hospitalized)
            updateStat('days', minute === 0 ? populationSize : 0)
        }

    }

    function day() {
        individuals.forEach(ind => {
            ind.social = false;
            if (ind.currentTarget !== hospital) {
                ind.currentTarget = ind.assignedHome;
                ind.returnTime = ind.workReturnTime;
            }
        });
    }


    return {
        wrapper,
        render,
        tick,
        day
    }
}


