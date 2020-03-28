const CANVAS_WIDTH = 450
const GRAPH_HEIGHT = 50
const PADDING = 10
const CANVAS_HEIGHT = CANVAS_WIDTH + GRAPH_HEIGHT + PADDING

export const DEFAULTS = {
    populationSize: 500,
    workerPercent: 0.7,
    commercialAreas: 6,
    socialAreas: 5,
    visitProbability: 0.0001,
    socialProbability: 0.0002,
    mapSize: [30, 30],
    virus: {
        startManifest: 1,
        manifestUpTo: 6,
        spreadProbability: 0.01,
        recoveryTime: 4,
        mortality: 0.09,
        reinfectProbability: 0.001
    }
}


function renderCell(ctx, loc, resolution) {
    const { x, y, type } = loc;
    switch (type) {
        case 0:
            ctx.fillStyle = 'rgba(0,255,0,0.4)';
            break;
        case 1:
            ctx.fillStyle = 'rgba(0,0,255,0.4)'
            break;
        case 2:
            ctx.fillStyle = 'rgba(240,124,64,0.4)'
            break;
        case 3:
            ctx.fillStyle = 'rgba(64,64,64,0.4)'
            break;
        case 4:
            ctx.fillStyle = 'rgba(255,64,255,0.4)'
            break;
    }


    ctx.fillRect(x * resolution - resolution / 2, y * resolution - resolution / 2, resolution, resolution);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.strokeRect(x * resolution - resolution / 2, y * resolution - resolution / 2, resolution, resolution);
    ctx.stroke()
}

export function initializePopulation(settings) {

    const config = Object.assign({}, DEFAULTS, settings);

    const { populationSize, workerPercent, commercialAreas, socialAreas, virus, visitProbability, socialProbability } = config;
    const { startManifest, manifestUpTo, spreadProbability, mortality, recoveryTime, reinfectProbability } = virus;

    const lat = Math.max(Math.floor(Math.sqrt(populationSize / 2 + commercialAreas + socialAreas)), 30);


    config.mapSize = [lat, lat];



    const { mapSize } = config;


    let deaths = 0;
    let infected = 0;
    let hospitalized = 0;

    let isolation = false;

    const stats = {
        infected: new Array(CANVAS_WIDTH).fill(0),
        hospitalized: new Array(CANVAS_WIDTH).fill(0),
        dead: new Array(CANVAS_WIDTH).fill(0),
        days: new Array(CANVAS_WIDTH).fill(0),
    }

    function updateStat(statKey, counter) {
        stats[statKey].splice(0, 1);
        stats[statKey].push(counter)
    }

    const wrapper = document.createElement('span')
    wrapper.style = "display: inline-block; padding: 10px; border: 1px solid #000; margin: 5px;";

    const canvas = document.createElement('canvas');
    wrapper.appendChild(canvas);


    const infectButton = document.createElement('button')
    infectButton.innerText = 'Infect';
    infectButton.className = 'waves-effect waves-light btn-small';

    infectButton.onclick = () => {
        const healthy = individuals.filter(ind => !ind.infected)
        infect(healthy[Math.floor(Math.random() * healthy.length)]);
    }

    const isolationWrapper = document.createElement('div')
    isolationWrapper.className = 'sim-control';
    isolationWrapper.style = 'margin-top: 10px';
    isolationWrapper.innerHTML = `<label>
        <input type="checkbox"  />
        <span>Force Isolation</span>
    </label>`;

    isolationWrapper.appendChild(infectButton)

    wrapper.appendChild(isolationWrapper)

    const isolate = isolationWrapper.querySelector('input')
    isolate.onchange = evt => {
        isolation = evt.target.checked;
    }

    canvas.setAttribute('width', CANVAS_WIDTH)
    canvas.setAttribute('height', CANVAS_HEIGHT)

    const resolution = CANVAS_WIDTH / mapSize[0];

    const map = {}

    const residential = [];
    const commercial = [];
    const social = [];
    const individuals = [];

    const findFreeSpot = (props) => {
        let spot;

        while (!spot) {
            const x = 1 + Math.floor(Math.random() * (mapSize[0] - 1))
            const y = 1 + Math.floor(Math.random() * (mapSize[1] - 1))
            const key = `${x}-${y}`;

            if (!map[key]) {
                spot = Object.assign({}, props, { x, y });
                map[key] = spot;
            }
        }

        return spot;
    }

    const hospital = findFreeSpot({ type: 2 })

    for (let i = 0; i < commercialAreas; i++) {
        const spot = findFreeSpot({ type: 1 });
        commercial.push(spot)
    }

    for (let i = 0; i < socialAreas; i++) {
        const spot = findFreeSpot({ type: 4 });
        social.push(spot)
    }

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

    for (let i = 0; i < populationSize * workerPercent; i++) {
        individuals[i].destination = commercial[Math.floor(Math.random() * commercial.length)];
        individuals[i].destinationTime = (Math.floor(Math.random() * 4) + 6) * 60 + Math.floor(Math.random() * 30)
        individuals[i].workReturnTime = individuals[i].returnTime = individuals[i].destinationTime + 8 * 60;
    }

    const housing = [...commercial, ...residential, ...social, hospital];


    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;

    housing.forEach(loc => {
        renderCell(offscreenCanvas.getContext('2d'), loc, resolution)
    })


    function render(minute) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        // housing.forEach(loc => {
        //     renderCell(ctx, loc, resolution)
        // })
        ctx.drawImage(offscreenCanvas, 0, 0);

        const halfX = resolution / 6;
        const halfY = resolution / 6;
        individuals.forEach(ind => {
            const { x, y, infected, dead, timeUntilManifestation } = ind;

            if (!dead) {

                if (infected) {
                    ctx.fillStyle = 'rgb(255,0,0)';
                } else {
                    ctx.fillStyle = 'rgba(25,25,25,1)';
                }

                const xp = x * resolution - halfX + ind.offsetX
                const yp = y * resolution - halfY + ind.offsetY
                ctx.beginPath();
                const size = infected ? -2 : -1;
                const doubleSize = infected ? -4 : -2;
                ctx.fillRect(xp - size, yp - size, doubleSize, doubleSize);
                ctx.stroke()

                // if (infected && timeUntilManifestation > 0) {
                //     ctx.strokeStyle = `rgb(255,0,0,1)`
                //     ctx.beginPath();
                //     ctx.strokeWidth = 2
                //     ctx.arc(xp, yp, 3, 0, 2 * Math.PI);
                //     ctx.stroke();
                // }
            }
        });


        renderGraph(ctx, stats.infected, 'rgba(255,125,40, 0.3)', 'Infected: ')
        renderGraph(ctx, stats.hospitalized, 'rgba(255,0,0, 0.3)', 'Hospitalised: ')
        renderGraph(ctx, stats.dead, 'rgba(0,0,0, 0.3)', 'Fatalities: ')
        renderGraph(ctx, stats.days, 'rgba(0,0,0, 0.5)', '')
    }

    function renderGraph(ctx, stat, color, prefix) {
        ctx.strokeStyle = color


        let lastY, lastStat;
        for (let i = 0; i < stat.length; i++) {
            lastStat = stat[i]
            lastY = Math.floor(lastStat * GRAPH_HEIGHT / populationSize)
            ctx.beginPath();
            ctx.moveTo(i, CANVAS_HEIGHT);
            ctx.lineTo(i, CANVAS_HEIGHT - lastY);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(0, CANVAS_HEIGHT - lastY);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - lastY);
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = "10px Lato";
        ctx.fillText(`${prefix}${lastStat}`, 0, CANVAS_HEIGHT - lastY - 2);
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


        individuals.forEach(ind => {
            const { currentTarget, destination, destinationTime, returnTime, assignedHome } = ind;

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
                                return Math.sqrt(xd + yd) < 2;
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



                ind.x += Math.sign(ind.currentTarget.x - ind.x)
                ind.y += Math.sign(ind.currentTarget.y - ind.y)

                if (Math.random() < 0.1) {
                    ind.offsetX = Math.floor(Math.random() * resolution / 2) - 1;
                }
                if (Math.random() < 0.1) {
                    ind.offsetY = Math.floor(Math.random() * resolution / 2) - 1;
                }
            }
        })

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
        day,
        getLegend
    }


}

export function getLegend() {
    const cvs = document.createElement('canvas')
    const ctx = cvs.getContext('2d');

    cvs.width = 200;
    cvs.height = 45;

    ctx.fillText("Legend", 5, 8);
    ctx.fillText("House", 20, 21);
    ctx.fillText("Work/Commercial", 20, 38);

    ctx.fillText("Hospital", 135, 21);
    ctx.fillText("Social Area", 135, 38);

    renderCell(ctx, { x: 1, y: 2, type: 0 }, 9)
    renderCell(ctx, { x: 1, y: 4, type: 1 }, 9)

    renderCell(ctx, { x: 14, y: 2, type: 2 }, 9)
    renderCell(ctx, { x: 14, y: 4, type: 4 }, 9)



    return cvs;

}
