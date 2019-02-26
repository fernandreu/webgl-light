import {Mesh} from "./mesh.js";

export class Cube extends Mesh {
    constructor(gl, shader, size = 1.0) {
        super(gl, shader);

        // TODO: This should all be static (shared between Mesh instances of the same kind)

        // Create a buffer for the cube's vertex positions.

        this.positionBuffer = this.gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        // Now create an array of positions for the cube.

        let s = size; // For a more concise typing
        const positions = [
            // Front face
            -s, -s,  s,
            s, -s,  s,
            s,  s,  s,
            -s,  s,  s,

            // Back face
            -s, -s, -s,
            -s,  s, -s,
            s,  s, -s,
            s, -s, -s,

            // Top face
            -s,  s, -s,
            -s,  s,  s,
            s,  s,  s,
            s,  s, -s,

            // Bottom face
            -s, -s, -s,
            s, -s, -s,
            s, -s,  s,
            -s, -s,  s,

            // Right face
            s, -s, -s,
            s,  s, -s,
            s,  s,  s,
            s, -s,  s,

            // Left face
            -s, -s, -s,
            -s, -s,  s,
            -s,  s,  s,
            -s,  s, -s,
        ];

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        // Set up the normals for the vertices, so that we can compute lighting.

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);

        const vertexNormals = [
            // Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
            this.gl.STATIC_DRAW);

        // Now set up the texture coordinates for the faces.

        this.textureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);

        const textureCoordinates = [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
        ];

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
            this.gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];

        // Now send the element array to GL

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), this.gl.STATIC_DRAW);
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

        const vertexCount = 36;
        const type = this.gl.UNSIGNED_SHORT;
        const offset = 0;
        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
    }
}