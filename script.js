// WebGL Initialisierung
const canvas = document.getElementById('myCanvas');
canvas.width = 800 * 2; // Set canvas width to 1600
canvas.height = 600 * 2; // Set canvas height to 1200
const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
}

// Enable anti-aliasing
gl.enable(gl.SAMPLES);

// Geometrie erstellen (Spirale mit 30 Vertices)
const vertices = [];
const colors = [];
const numVertices = 30;
const numLoops = 5;
for (let i = 0; i < numVertices; i++) {
    const progress = i / numVertices;
    const angle = numLoops * progress * Math.PI * 2;
    const radius = progress * 1.0; // Radius variiert für die Spirale
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    vertices.push(x, y);

    // Calculate gradient color (from red to green)
    const red = 1.0 - progress;
    const green = progress;
    const blue = 0.0;
    colors.push(red, green, blue);
}

// Vertex- und Fragment-Shader-Code
const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_color = a_color;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;
    void main() {
        gl_FragColor = vec4(v_color, 1.0);
    }
`;

// WebGL-Programm erstellen
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Vertices an WebGL übergeben
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'a_position');
gl.enableVertexAttribArray(positionAttribLocation);
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

// Colors an WebGL übergeben
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

const colorAttribLocation = gl.getAttribLocation(shaderProgram, 'a_color');
gl.enableVertexAttribArray(colorAttribLocation);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);

// Set line width
gl.lineWidth(2); // Set line width to 3 pixels (you can adjust this value as needed)

// Zeichne die Linien
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
