import {vec4} from "../vendor/gl-matrix/index.js";

export class Scene {
    /**
     * Creates a scene with the default camera to use
     * @param gl The OpenGL context
     */
    constructor(gl) {
        this._gl = gl;
        this._camera = null;
        this.clearColor = vec4.fromValues(0.75, 0.75, 0.75, 1.0);
        this.clearDepth = 1.0;

        /**
         * The array of entities currently included in this scene
         * @type {Entity[]}
         * @private
         */
        this._entities = [];
    }

    get camera() {
        return this._camera;
    }

    set camera(value) {
        // We only accept cameras attached to entities (otherwise there is no way to obtain their position)
        if (value.entity === null) {
            console.warn('Camera is not attached to an Entity');
            return;
        }
        this._camera = value;
        if (this._entities.indexOf(value.entity) == -1) {
            this._entities.push(value.entity);
        }
    }

    /**
     * Adds an entity to the scene
     * @param {Entity} entity The entity to be added
     */
    addEntity(entity) {
        if (this._entities.indexOf(entity) != -1) return;
        this._entities.push(entity);
    }

    /**
     * Removes an entity to the scene
     * @param {Entity} entity The entity to be added
     */
    removeEntity(entity) {
        for (let i = 0; i < this._entities.length; ++i) {
            if (this._entities[i] !== entity) continue;
            this._entities.splice(i, 1);
            return;
        }
    }

    /**
     * Updates the elements on the scene based on the time elapsed
     * @param {number} deltaTime The time elapsed, in seconds since last frame
     */
    update(deltaTime) {
        this._entities.forEach(e => {
            if (e.canUpdate) e.update(deltaTime)
        });
    }

    /**
     * Draws the scene
     */
    draw() {
        let [red, green, blue, alpha] = this.clearColor;
        this._gl.clearColor(red, green, blue, alpha);
        this._gl.clearDepth(1.0);                 // Clear everything
        this._gl.enable(this._gl.DEPTH_TEST);           // Enable depth testing
        this._gl.depthFunc(this._gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        const aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;

        const projectionMatrix = this.camera.calculateProjectionMatrix(aspect);
        const viewMatrix = this.camera.calculateViewMatrix();

        this._entities.forEach(e => e.draw(projectionMatrix, viewMatrix));
    }
}