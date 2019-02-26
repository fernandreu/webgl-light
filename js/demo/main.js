"use strict";

import {Texture} from "../engine/texture.js";
import {Scene} from "../engine/scene.js";
import {TextureShader} from "../engine/shaders/texture-shader.js";
import {Camera} from "../engine/components/camera.js";
import {ColorShader} from "../engine/shaders/color-shader.js";
import {quat, vec3, vec4} from "../vendor/gl-matrix/index.js";
import {Entity} from "../engine/entity.js";
import {RotatingComponent} from "../engine/components/rotating-component.js";
import {inputManager} from "../engine/input-manager.js";
import {CameraController} from "../engine/components/camera-controller.js";
import {Cube} from "../engine/components/cube.js";
import {Grid} from "../engine/components/grid.js";

let gridEntity = null;


/**
 * Replaces the currently displayed grid with a new one based on the input expression
 * @param {WebGLRenderingContext} gl
 * @param {Scene} scene
 * @param {string} expression
 */
function updateGrid(gl, scene, expression) {
    if (gridEntity !== null) {
        scene.removeEntity(gridEntity);
    }

    const grid = new Grid(
        gl,
        new ColorShader(gl, vec4.fromValues(0.9, 0.3, 0.3, 1.0)),
        10,
        10,
        100,
        100,
        expression);

    gridEntity = new Entity();
    quat.fromEuler(gridEntity.rotation, -90.0, 0.0, 0.0);
    gridEntity.position = vec3.fromValues(0.0, -2.0, 0.0);
    gridEntity.attachComponent(grid);
    scene.addEntity(gridEntity);
}


/**
 * Initialization of the scene, WebGL context, rendering loop, etc.
 */
function run() {
    const canvas = document.querySelector('#glCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    inputManager.canvas = canvas;

    const gl = canvas.getContext('webgl');

    // If we don't have a GL context, give up now
    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const scene = new Scene(gl);

    const camera = new Camera();
    const cameraEntity = new Entity();
    cameraEntity.position = vec3.fromValues(0, 0, 5);
    quat.fromEuler(cameraEntity.rotation, -15, 0, 0);
    const controller = new CameraController();
    cameraEntity.attachComponent(camera);
    cameraEntity.attachComponent(controller);
    controller.reset();
    scene.camera = camera;

    // Add one rotating cube on each corner, with random rotation speed, scale and color
    for (let alpha = 0; alpha < 2 * Math.PI; alpha += 0.25 * Math.PI) {
        const entity = new Entity();
        const radius = 10;
        entity.position = vec3.fromValues(
            radius * Math.cos(alpha),
            0.0,
            radius * Math.sin(alpha));
        entity.scale = vec3.fromValues(
            0.2 + 0.5 * Math.random(),
            0.2 + 0.5 * Math.random(),
            0.2 + 0.5 * Math.random());
        const shader = new ColorShader(gl, vec4.fromValues(Math.random(), Math.random(), Math.random(), 1.0));
        const mesh = new Cube(gl, shader);
        entity.attachComponent(mesh);
        const rotation = new RotatingComponent(
            180 * Math.random(),
            180 * Math.random(),
            180 * Math.random());
        entity.attachComponent(rotation);
        scene.addEntity(entity);
    }

    // Configure the controls to be able to change the expression defining the grid
    const expressionInput = document.querySelector('.expression input');
    expressionInput.value = "-1 + 1.25 * x**2 - 0.6 * Math.cos(Math.PI * y)";
    const expressionButton = document.querySelector('.expression button');
    expressionButton.onclick = () => updateGrid(gl, scene, expressionInput.value);
    updateGrid(gl, scene, expressionInput.value);

    // Draw the scene repeatedly
    let then = 0;
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        scene.update(deltaTime);
        scene.draw();

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

run();
