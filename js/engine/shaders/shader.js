/**
 * This is meant to act as a base class for any shader
 */
export class Shader {
    constructor(gl, vsSource, fsSource) {
        this._gl = gl;
        this.program = this.initProgram(vsSource, fsSource);
    }

    /**
     * Initializes the shader program, so WebGL knows how to draw our data
     * @param {string} vsSource The source code for the vertex shader
     * @param {string} fsSource  The source code for the fragment shader
     * @returns {WebGLProgram | null} The shader program, or null if there were compilation errors
     */
    initProgram(vsSource, fsSource) {
        const vertexShader = this.loadShader(this._gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(this._gl.FRAGMENT_SHADER, fsSource);

        // Create the shader program

        const program = this._gl.createProgram();
        this._gl.attachShader(program, vertexShader);
        this._gl.attachShader(program, fragmentShader);
        this._gl.linkProgram(program);

        // If creating the shader program failed, log an error
        if (!this._gl.getProgramParameter(program, this._gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + this._gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    /**
     * Creates a shader of the given type, uploads the source and compiles it
     * @param {GLenum} type: The type of the shader to be created
     * @param {string} source: The source code of that shader
     * @returns {WebGLShader | null} The generated shader, or null if there were compilation errors
     */
    loadShader(type, source) {
        const shader = this._gl.createShader(type);

        // Send the source to the shader object
        this._gl.shaderSource(shader, source);

        // Compile the shader program
        this._gl.compileShader(shader);

        // See if it compiles successfully
        if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + this._gl.getShaderInfoLog(shader));
            this._gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    /**
     * Simple wrapper to get an attribute location from gl
     * @param {string} name The name of the attribute location to get
     * @returns {*|GLint} The attribute location if found
     */
    getAttribLocation(name) {
        return this._gl.getAttribLocation(this.program, name);
    }

    /**
     * Simple wrapper to get a uniform location from gl
     * @param {string} name The name of the uniform location to get
     * @returns {*|WebGLUniformLocation} The uniform location if found
     */
    getUniformLocation(name) {
        return this._gl.getUniformLocation(this.program, name);
    }

    /**
     * Tell WebGL to use the shader when drawing
     */
    use() {
        this._gl.useProgram(this.program);
    }

    /**
     * Sets the projection matrix for the shader
     * @param projectionMatrix
     */
    setProjectionMatrix(projectionMatrix) {

    }

    /**
     * Sets the view matrix for the shader
     * @param viewMatrix
     */
    setViewMatrix(viewMatrix) {

    }

    /**
     * Sets the model matrix for the shader
     * @param modelMatrix
     */
    setModelMatrix(modelMatrix) {

    }

    /**
     * Sets the normal matrix for the shader
     * @param normalMatrix
     */
    setNormalMatrix(normalMatrix) {

    }

    /**
     * Tell WebGL how to pull out the positions from the position
     * mesh into the vertexPosition attribute
     * @param positionBuffer
     */
    setPositionBuffer(positionBuffer) {

    }

    /**
     * Tell WebGL how to pull out the normals from
     * the normal mesh into the vertexNormal attribute.
     * @param textureCoordBuffer
     */
    setTextureCoordBuffer(textureCoordBuffer) {

    }

    /**
     * Tell WebGL how to pull out the normals from
     * the normal mesh into the vertexNormal attribute.
     * @param normalBuffer
     */
    setNormalBuffer(normalBuffer) {

    }
}