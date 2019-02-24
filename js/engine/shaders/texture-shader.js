import {Shader} from "./shader.js";


// Vertex shader program

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;
    uniform mat4 uNormalMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    void main(void) {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
      // Apply lighting effect
      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

// Fragment shader program

const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    uniform sampler2D uSampler;
    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;


export class TextureShader extends Shader {
    constructor(gl, texture) {
        super(gl, vsSource, fsSource);

        this.texture = texture;

        // Get all locations for later use

        this.vertexPosition = this.getAttribLocation('aVertexPosition');
        this.vertexNormal = this.getAttribLocation('aVertexNormal');
        this.textureCoord = this.getAttribLocation('aTextureCoord');

        this.projectionMatrix = this.getUniformLocation('uProjectionMatrix');
        this.viewMatrix = this.getUniformLocation('uViewMatrix');
        this.modelMatrix = this.getUniformLocation('uModelMatrix');
        this.normalMatrix = this.getUniformLocation('uNormalMatrix');
        this.uSampler = this.getUniformLocation('uSampler');
    }

    use() {
        super.use();

        // Tell WebGL we want to affect texture unit 0
        this._gl.activeTexture(this._gl.TEXTURE0);

        // Bind the texture to texture unit 0
        this._gl.bindTexture(this._gl.TEXTURE_2D, this.texture.texture);

        // Tell the shader we bound the texture to texture unit 0
        this._gl.uniform1i(this.uSampler, 0);
    }

    setPositionBuffer(positionBuffer) {
        const numComponents = 3;
        const type = this._gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);
        this._gl.vertexAttribPointer(
            this.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        this._gl.enableVertexAttribArray(this.vertexPosition);
    }

    setTextureCoordBuffer(textureCoordBuffer) {
        const numComponents = 2;
        const type = this._gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, textureCoordBuffer);
        this._gl.vertexAttribPointer(
            this.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        this._gl.enableVertexAttribArray(this.textureCoord);
    }

    setNormalBuffer(normalBuffer) {
        const numComponents = 3;
        const type = this._gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, normalBuffer);
        this._gl.vertexAttribPointer(
            this.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        this._gl.enableVertexAttribArray(this.vertexNormal);
    }

    setProjectionMatrix(projectionMatrix) {
        this._gl.uniformMatrix4fv(this.projectionMatrix,false, projectionMatrix);
    }

    setViewMatrix(viewMatrix) {
        this._gl.uniformMatrix4fv(this.viewMatrix, false, viewMatrix);
    }

    setModelMatrix(modelMatrix) {
        this._gl.uniformMatrix4fv(this.modelMatrix, false, modelMatrix);
    }

    setNormalMatrix(normalMatrix) {
        this._gl.uniformMatrix4fv(this.normalMatrix, false, normalMatrix);
    }
}
