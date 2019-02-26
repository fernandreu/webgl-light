import {mat4} from "../../vendor/gl-matrix/index.js";
import {Component} from "./component.js";

/**
 * Component which handles all meshes to be drawn on screen
 * TODO: Remove all Cube-specific code and put it into a Cube subclass
 */
export class Mesh extends Component {
    constructor(gl, shader) {
        super();
        this.gl = gl;
        this.shader = shader;
    }

    draw(projectionMatrix, viewMatrix) {
        if (this.entity === null) {
            return;
        }

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelMatrix = mat4.create();
        mat4.fromRotationTranslationScale(
            modelMatrix,
            this.entity.rotation,
            this.entity.position,
            this.entity.scale);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        this._finishDraw(projectionMatrix, viewMatrix, modelMatrix, normalMatrix);
    }

    _finishDraw(projectionMatrix, viewMatrix, modelMatrix, normalMatrix) {

    }
}