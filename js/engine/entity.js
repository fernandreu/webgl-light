import {quat, vec3} from "../vendor/gl-matrix/index.js";
import {Mesh} from "./components/mesh.js";

/**
 * An object which can hold entities, custom components, etc. Equivalent to Unity's GameObject
 */
export class Entity {
    constructor() {
        this.position = vec3.fromValues(0, 0, 0);
        this.scale = vec3.fromValues(1,1, 1);
        this.rotation = quat.fromValues(0, 0, 0, 1);

        /**
         * The array of components attached to this entity
         * @type {Component[]}
         * @private
         */
        this._components = [];

        this._canUpdate = false;
    }

    get canUpdate() {
        return this._canUpdate;
    }

    /**
     * Re-parses the canUpdate flag based on which components are currently attached
     * @private
     */
    _updateCanUpdateFlag() {
        this._canUpdate = this._components.some(c => c.canUpdate);
    }

    /**
     * Attaches a component to this entity
     * @param {Component} component
     */
    attachComponent(component) {
        if (this._components.indexOf(component) != -1) return;

        // If the component was attached to another entity, detach it first
        if (component.entity !== null) {
            component.entity.removeComponent(component);
        }

        component.entity = this;
        this._components.push(component);
        this._updateCanUpdateFlag();
    }

    removeComponent(component) {
        for (let i = 0; i < this._components.length; ++i) {
            if (this._components[i] !== component) continue;
            this._components.splice(i, 1);
            this._updateCanUpdateFlag();
            return;
        }
    }

    update(deltaTime) {
        // The entity itself does not have anything to be updated, but the components might
        this._components.forEach(c => {
            if (c.canUpdate) c.update(deltaTime);
        })
    }

    draw(projectionMatrix, viewMatrix) {
        this._components.forEach(c => {
            if (c instanceof Mesh) c.draw(projectionMatrix, viewMatrix)
        });
    }
}