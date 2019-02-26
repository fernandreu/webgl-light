import {mat4} from '../../vendor/gl-matrix/index.js'
import {Component} from "./component.js";

/**
 * Component which is able to calculate the projection and view matrices, as if assuming the entity it is
 * attached to is the person looking at the scene
 */
export class Camera extends Component {
    constructor() {
        super();
        this.fieldOfView = 45 * Math.PI / 180;  // In radians
        this.zNear = 0.1;
        this.zFar = 100.0;
    }

    /**
     * Calculates the projection matrix to use when rendering
     * @param aspect
     * @returns {mat4}
     */
    calculateProjectionMatrix(aspect) {
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix,
            this.fieldOfView,
            aspect,
            this.zNear,
            this.zFar);
        return projectionMatrix;
    }

    /**
     * Calculates the view matrix to use when rendering
     * @returns {mat4}
     */
    calculateViewMatrix() {
        const viewMatrix = mat4.create();
        mat4.fromRotationTranslationScale(
            viewMatrix,
            this.entity.rotation,
            this.entity.position,
            this.entity.scale);
        mat4.invert(viewMatrix, viewMatrix);
        return viewMatrix;
    }
}