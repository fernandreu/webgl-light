/**
 * Base class for all components that can be attached to an Entity
 */
export class Component {
    constructor(canUpdate = false) {
        /**
         * The entity that owns this component
         * @type {Entity|null}
         */
        this.entity = null;

        this._canUpdate = canUpdate;
    }

    get canUpdate() {
        return this._canUpdate;
    }

    /**
     * Updates any necessary property of the Component based on the elapsed time. If canUpdate is false,
     * this will never be called
     * @param {number} deltaTime
     */
    update(deltaTime) {

    }
}