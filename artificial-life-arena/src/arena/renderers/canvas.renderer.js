export default class CanvasRenderer {

    constructor(mapConfig) {
        if (!mapConfig) {
            throw new Error('Missing configuration passed to renderer');
        }
        Object.assign(this, mapConfig);
        const { width, height, scale = 14 } = mapConfig;
        this.scale = scale;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', width * scale);
        canvas.setAttribute('height', height * scale)
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.renderContext = canvas.getContext('2d');
        this.renderContext.textBaseline = "bottom";
        this.renderContext.font = `${scale}px Arial`;
    }

    renderItem(entity) {
        const { x, y, energy, r, g, b, character } = entity;
        const { scale } = this;
        this.renderContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${energy})`
        if (!character) {
            this.renderContext.fillRect(x * scale, y * scale, scale, scale);
        } else {
            this.renderContext.fillText(character, x * scale, y * scale);
        }

    }

    render(arena) {
        this.renderContext.clearRect(0, 0, this.width * this.scale, this.height * this.scale);

        Object.values(arena.arena).forEach(val => {
            if (Array.isArray(val)) {
                val.forEach(entity => this.renderItem(entity));
            } else {
                this.renderItem(val);
            }
        });

        this.renderContext.fillStyle = `rgb(0, 0, 0)`
        this.renderContext.fillText(`Total: ${arena.totalActive}`, 0, this.scale)
        this.renderContext.fillText(`Generation: ${arena.iterations}`, 0, this.scale * 2)
        this.renderContext.fillText(`Age: ${arena.tickCount}`, 0, this.scale * 3)
    }

}