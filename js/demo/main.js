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

run();

//
// Start here
//
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

    const camera = new Camera();
    const cameraEntity = new Entity();
    cameraEntity.position = vec3.fromValues(0, -2, 5);
    cameraEntity.attachComponent(camera);
    cameraEntity.attachComponent(new CameraController());

    const texture = new Texture(gl, 'img/avataaars.png');

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const solidMesh = new Cube(gl, new ColorShader(gl, vec4.fromValues(0, 0.85, 0.5, 1.0)));
    const solidEntity = new Entity();
    solidEntity.position = vec3.fromValues(0.0, 0.0, -8.0);
    solidEntity.attachComponent(solidMesh);

    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shader = new TextureShader(gl, texture);
    const textureMesh = new Cube(gl, shader);
    const textureEntity = new Entity();
    textureEntity.position = vec3.fromValues(0.5, 0.0, -2.0);
    textureEntity.scale = vec3.fromValues(0.5, 0.5, 0.5);
    textureEntity.attachComponent(textureMesh);
    textureEntity.attachComponent(new RotatingComponent(60, 45, 90));

    const grid = new Grid(
        gl,
        new ColorShader(gl, vec4.fromValues(0.9, 0.1, 0.1, 1.0)),
        10,
        10,
        100,
        100);
    const gridEntity = new Entity();
    quat.fromEuler(gridEntity.rotation, 90.0, 0.0, 0.0);
    gridEntity.position = vec3.fromValues(0.0, -2.0, 0.0);
    gridEntity.attachComponent(grid);

    let then = 0;

    const scene = new Scene(gl);
    scene.camera = camera;
    scene.addEntity(solidEntity);
    scene.addEntity(textureEntity);
    scene.addEntity(gridEntity);

    // Draw the scene repeatedly
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
