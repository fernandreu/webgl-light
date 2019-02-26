import {Mesh} from "./mesh.js";
import {vec3} from "../../vendor/gl-matrix";

export class Grid extends Mesh {
    constructor(gl, shader, width, height, hDiv=10, vDiv=10) {
        super(gl, shader);

        this._hDiv = hDiv;
        this._vDiv = vDiv;

        // TODO: Change the position and normal buffers to dynamic draw once the height map is implemented

        // Create the grid of points
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        let positions = [];
        for (let j = 0; j <= vDiv; ++j) {
            let row = [];
            for (let i = 0; i <= hDiv; ++i) {
                let z = 1 - 5 * (i / hDiv - 0.5)**2 + 0.6 * Math.cos(4 * Math.PI * (j / vDiv - 0.5));
                row.push([width * (i / hDiv - 0.5), height * (j / vDiv - 0.5), z]);
            }
            positions.push(row);
        }
        this._positions = positions.flat(3);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this._positions), this.gl.STATIC_DRAW);

        // Set up the normals
        // TODO: Adjust normals based on z coordinate of neighbours
        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this._normals = [];
        for (let j = 0; j <= vDiv; ++j) {
            for (let i = 0; i <= hDiv; ++i) {
                let normal = vec3.create();
                if (i > 0 && j > 0) {
                    // Add top-left triangle
                    let v = vec3.create();
                    let a = vec3.fromValues(
                        positions[j-1][i][0] - positions[j][i][0],
                        positions[j-1][i][1] - positions[j][i][1],
                        positions[j-1][i][2] - positions[j][i][2],
                        );
                    let b = vec3.fromValues(
                        positions[j][i-1][0] - positions[j][i][0],
                        positions[j][i-1][1] - positions[j][i][1],
                        positions[j][i-1][2] - positions[j][i][2],
                    );
                    vec3.cross(v, a, b);
                    vec3.add(normal, normal, v);
                }
                if (i < hDiv && j < vDiv) {
                    // Add bottom-right triangle
                    let v = vec3.create();
                    let a = vec3.fromValues(
                        positions[j+1][i][0] - positions[j][i][0],
                        positions[j+1][i][1] - positions[j][i][1],
                        positions[j+1][i][2] - positions[j][i][2],
                    );
                    let b = vec3.fromValues(
                        positions[j][i+1][0] - positions[j][i][0],
                        positions[j][i+1][1] - positions[j][i][1],
                        positions[j][i+1][2] - positions[j][i][2],
                    );
                    vec3.cross(v, a, b);
                    vec3.add(normal, normal, v);
                }
                if (i > 0 && j < vDiv) {
                    // Add bottom-left triangle
                    let v = vec3.create();
                    let a = vec3.fromValues(
                        positions[j][i-1][0] - positions[j][i][0],
                        positions[j][i-1][1] - positions[j][i][1],
                        positions[j][i-1][2] - positions[j][i][2],
                    );
                    let b = vec3.fromValues(
                        positions[j+1][i][0] - positions[j][i][0],
                        positions[j+1][i][1] - positions[j][i][1],
                        positions[j+1][i][2] - positions[j][i][2],
                    );
                    vec3.cross(v, a, b);
                    vec3.add(normal, normal, v);
                }
                if (i < hDiv && j > 0) {
                    // Add top-right triangle
                    let v = vec3.create();
                    let a = vec3.fromValues(
                        positions[j][i+1][0] - positions[j][i][0],
                        positions[j][i+1][1] - positions[j][i][1],
                        positions[j][i+1][2] - positions[j][i][2],
                    );
                    let b = vec3.fromValues(
                        positions[j-1][i][0] - positions[j][i][0],
                        positions[j-1][i][1] - positions[j][i][1],
                        positions[j-1][i][2] - positions[j][i][2],
                    );
                    vec3.cross(v, a, b);
                    vec3.add(normal, normal, v);
                }
                vec3.normalize(normal, normal);
                this._normals.push(normal[0], normal[1], normal[2]);
            }
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this._normals), this.gl.STATIC_DRAW);

        // Set up the texture coordinates for the faces
        this.textureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
        let textureCoords = [];
        for (let j = 0; j <= vDiv; ++j) {
            for (let i = 0; i <= hDiv; ++i) {
                textureCoords.push(i / hDiv, j / vDiv);
            }
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices into the vertex arrays for each face's vertices.
        // We will use the gl.TRIANGLE_STRIP drawing mode later, so the indices have to be defined accordingly
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        let indices = [];
        const hOffset = hDiv + 1;
        for (let j = 0; j < vDiv; ++j) {
            for (let i = 0; i <= hDiv; ++i) {
                indices.push(hOffset * j + i, hOffset * (j + 1) + i);
            }
        }
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    }

    _finishDraw(projectionMatrix, viewMatrix, modelMatrix, normalMatrix) {
        // Set shader attributes
        this.shader.setPositionBuffer(this.positionBuffer);
        this.shader.setTextureCoordBuffer(this.textureCoordBuffer);
        this.shader.setNormalBuffer(this.normalBuffer);

        // Tell WebGL which indices to use to index the vertices
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // Tell WebGL to use the shader when drawing
        this.shader.use();

        // Set the shader uniforms
        this.shader.setProjectionMatrix(projectionMatrix);
        this.shader.setViewMatrix(viewMatrix);
        this.shader.setModelMatrix(modelMatrix);
        this.shader.setNormalMatrix(normalMatrix);

        const count = (this._hDiv + 1) * 2;
        for (let j = 0; j < this._vDiv; ++j) {
            this.gl.drawElements(this.gl.TRIANGLE_STRIP, count, this.gl.UNSIGNED_SHORT, count * j * 2);  // *2 due to uint16
        }
    }
}