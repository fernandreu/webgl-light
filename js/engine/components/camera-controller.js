import {Component} from "./component.js";
import {inputManager} from "../input-manager.js";
import {quat, vec3} from "../../vendor/gl-matrix/index.js";

/**
 * Component which maps the usual keys to navigate a camera in a scene (such as in Unity) while allowing you
 * to move the mouse to rotate it around
 */
export class CameraController extends Component{
    constructor() {
        super(true);
        this.speed = 2.0;
        this.mousePrecision = 0.05;
        let caller = this;
        this._xRotation = 0.0;
        this._yRotation = 0.0;
        inputManager.mouseMoveListeners.push((x, y) => caller._onMouseMove(x, y));
    }

    reset() {
        if (this.entity === null) return;

        // TODO: Move the quaternion to Euler transformation to a utility function
        //  The best place would be the gl-matrix library, but that should be treated as a black box in case the
        //  entire library needs to be updated. Somebody already requested this to be added to the library; see:
        //  https://github.com/toji/gl-matrix/issues/329
        const r = this.entity.rotation;
        // const x = 180/Math.PI * Math.atan2(2*(r[0]*r[1]+r[2]*r[3]), 1 - 2*(r[1]**2+r[2]**2));
        const y = 180/Math.PI * Math.asin(2*(r[0]*r[2] - r[3]*r[1]));
        const z = 180/Math.PI * Math.atan2(2*(r[0]*r[3]+r[1]*r[2]), 1-2*(r[2]**2+r[3]**2));
        // console.log('x: ' + (180 - z));
        // console.log('y: ' + -y);
        // console.log('z: ' + x);
        this._xRotation = 180 - z;
        this._yRotation = -y;
    }

    _onMouseMove(x, y) {
        this._xRotation -= this.mousePrecision*y;
        this._yRotation -= this.mousePrecision*x;
        quat.fromEuler(this.entity.rotation, this._xRotation, this._yRotation, 0.0);
    }

    update(deltaTime) {
        if (inputManager.isKeyDown("w")) {
            // Move forward
            const dir = vec3.fromValues(0, 0, -this.speed*deltaTime);
            vec3.transformQuat(dir, dir, this.entity.rotation);
            vec3.add(this.entity.position, this.entity.position, dir);
        }

        if (inputManager.isKeyDown("s")) {
            // Move backwards
            const dir = vec3.fromValues(0, 0, this.speed*deltaTime);
            vec3.transformQuat(dir, dir, this.entity.rotation);
            vec3.add(this.entity.position, this.entity.position, dir);
        }

        if (inputManager.isKeyDown("e")) {
            // Move up
            const dir = vec3.fromValues(0, this.speed*deltaTime, 0);
            vec3.transformQuat(dir, dir, this.entity.rotation);
            vec3.add(this.entity.position, this.entity.position, dir);
        }

        if (inputManager.isKeyDown("q")) {
            // Move down
            const dir = vec3.fromValues(0, -this.speed*deltaTime, 0);
            vec3.transformQuat(dir, dir, this.entity.rotation);
            vec3.add(this.entity.position, this.entity.position, dir);
        }

        if (inputManager.isKeyDown("a")) {
            // Move left
            const dir = vec3.fromValues(-this.speed*deltaTime, 0, 0);
            vec3.transformQuat(dir, dir, this.entity.rotation);
            vec3.add(this.entity.position, this.entity.position, dir);
        }

        if (inputManager.isKeyDown("d")) {
            // Move right
            const dir = vec3.fromValues(this.speed*deltaTime, 0, 0);
            vec3.transformQuat(dir, dir, this.entity.rotation);
            vec3.add(this.entity.position, this.entity.position, dir);
        }
    }
}