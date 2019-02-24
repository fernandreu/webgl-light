/**
 * Singleton class which handles all input for the game engine
 */
class InputManager {
    constructor() {
        this._canvas = null;
        /**
         * The keycodes of the keys currently pressed
         * @type {{int, boolean}}
         */
        this.keysPressed = {};
        this.mouseMoveListeners = [];

        this._locked = false;

        let caller = this;  // This avoids misinterpreting 'this' inside the event as the function itself
        document.addEventListener('keydown', (evt) => caller.keyDownHandler(evt), false);
        document.addEventListener('keyup', (evt) => caller.keyUpHandler(evt), false);
    }

    set canvas(canvas) {
        if (this._canvas !== null) {
            // TODO: remove event listeners
        }

        this._canvas = canvas;

        // noinspection JSUnresolvedVariable
        canvas.requestPointerLock = canvas.requestPointerLock ||
            canvas.mozRequestPointerLock ||
            canvas.webkitRequestPointerLock;

        // noinspection JSUnresolvedVariable
        document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock;

        let caller = this;
        document.addEventListener('pointerlockchange', () => caller._lockChangeAlert(), false);
        document.addEventListener('mozpointerlockchange', () => caller._lockChangeAlert(), false);
        document.addEventListener('webkitpointerlockchange', () => caller._lockChangeAlert(), false);

        canvas.onclick = () => canvas.requestPointerLock();
    }

    _lockChangeAlert() {
        let caller = this;
        // noinspection JSUnresolvedVariable
        if (document.pointerLockElement === this._canvas ||
            document.mozPointerLockElement === this._canvas ||
            document.webkitPointerLockElement === this._canvas
        ) {
            if (this._locked) return;
            this._locked = true;
            document.addEventListener("mousemove", e => caller._updatePosition(e), false);
        } else {
            if (!this._locked) return;
            this._locked = false;
            document.removeEventListener("mousemove", e => caller._updatePosition(e), false);
        }
    }

    _updatePosition(e) {
        if (!this._locked) return;
        this.mouseMoveListeners.forEach(l => l(e.movementX, e.movementY))
    }

    keyDownHandler(event) {
        const code = event.key;
        this.keysPressed[code] = true;  // The value is not important
    }

    keyUpHandler(event) {
        const code = event.key;
        if (code in this.keysPressed) {
            delete this.keysPressed[code];
        }
    }

    isKeyDown(code) {
        return code in this.keysPressed;
    }
}


export let inputManager = new InputManager();
