import {Component} from "./component.js";
import {quat} from "../../vendor/gl-matrix";

/**
 * Component which simply rotates an Entity at a constant speed
 */
export class RotatingComponent extends Component {
    constructor(xSpeed, ySpeed, zSpeed) {
        super(true);
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.zSpeed = zSpeed;
    }

    update(deltaTime) {
        const factor = quat.create();
        quat.fromEuler(factor, this.xSpeed * deltaTime, this.ySpeed * deltaTime, this.zSpeed * deltaTime);
        quat.multiply(this.entity.rotation, this.entity.rotation, factor);
    }
}