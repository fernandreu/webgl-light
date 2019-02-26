# WebGL Light

A lightweight game engine made in WebGL, plus a simple demo making use of it.

The original idea behind this was to experiment with the capabilities that pure WebGL can offer. Hence, no third-party graphical libraries (such as [three.js](https://threejs.org/)) were used.

The project soon took the shape of a game engine which encapsulated most of the direct WebGL API calls. However, this project is not as refined / mature as one of the fully-fledged graphical libraries / game engines out there, and was developed as a proof of concept only. Use at your own risk!

The engine is developed using the ES6 standard of JavaScript, and uses [glMatrix](https://github.com/toji/gl-matrix) (included as part of in this repo) to perform mathematical operations.

# Live demo

For a live demo of the project, check the following link:

https://fernandreu.github.io/webgl-light/

After clicking the scene, the camera can be moved by using standard Unity-like scene navigation keys:

 - **Mouse movement:** rotate the camera around
 - **A/D:** move the camera left / right
 - **W/S:** move the camera forward / backwards
 - **E/Q:** move the camrea up / down

**There is no navigation support for mobile devices (without keyboard / mouse) yet.**
