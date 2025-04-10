'use strict';

  // Global variables that are set and used
  // across the application
  let gl, program;
  
  
  // Global declarations of objects that you will be drawing
  var myTeapot = null;
  var myCube = null;
  var myCylinder = null;
  var myCone = null;
  var mySphere = null;



//
// A function that creates shapes to be drawn and creates a VAO for each
//
// We start you out with an example for the teapot.
//
function createShapes() {
  myTeapot = new Teapot();
  myTeapot.VAO = bindVAO(myTeapot);

  myCube = new Cube(2);
  myCube.VAO = bindVAO(myCube);

  myCylinder = new Cylinder(20, 1);
  myCylinder.VAO = bindVAO(myCylinder);

  myCone = new Cone(20, 1);
  myCone.VAO = bindVAO(myCone);

  mySphere = new Sphere(20, 20);
  mySphere.VAO = bindVAO(mySphere);
}



//
// Set up your camera and your projection matrices
//

function setUpCamera() {
  let projMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(projMatrix, radians(45), 1.0, 0.1, 100.0);
  gl.uniformMatrix4fv(program.uProjT, false, projMatrix);

  let viewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(viewMatrix, [0, 3, 8], [0, 0, 0], [0, 1, 0]);
  gl.uniformMatrix4fv(program.uViewT, false, viewMatrix);
}


function drawShapes() {
  const drawCube = (tx, ty, tz, sx, sy, sz) => {
      let m = glMatrix.mat4.create();
      glMatrix.mat4.translate(m, m, [tx, ty, tz]);
      glMatrix.mat4.scale(m, m, [sx, sy, sz]);
      gl.uniformMatrix4fv(program.uModelT, false, m);
      gl.bindVertexArray(myCube.VAO);
      gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);
  };

  const baseY = -2.25;
  const columnY = baseY + 0.5 + 0.75; 
  const topY = 0.0

  const baseHeight = 0.5;
  const columnHeight = 1.5;
  const topHeight = 0.2;

  const baseScale = [1.2, 0.5, 1.2];
  const columnScale = [0.9, 1.5, 0.9];
  const topScale = [1.2, 0.2, 1.2];
  
  const offsets = [-3, 0, 3];

  for (let i = 0; i < offsets.length; i++) {
      const x = offsets[i];
      drawCube(x, baseY, 0, ...baseScale);     
      drawCube(x, columnY, 0, ...columnScale); 
      drawCube(x, topY, 0, ...topScale);       
  }

  const platformTopY = topY + topHeight / 2; 

  {
      let sphereM = glMatrix.mat4.create();
      glMatrix.mat4.translate(sphereM, sphereM, [-3, platformTopY + 0.4, 0]); 
      glMatrix.mat4.scale(sphereM, sphereM, [0.8, 0.8, 0.8]);
      gl.uniformMatrix4fv(program.uModelT, false, sphereM);
      gl.bindVertexArray(mySphere.VAO);
      gl.drawElements(gl.TRIANGLES, mySphere.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  {
      let teapotM = glMatrix.mat4.create();
      glMatrix.mat4.translate(teapotM, teapotM, [0, platformTopY , 0]); 
      glMatrix.mat4.rotateY(teapotM, teapotM, radians(180));
      glMatrix.mat4.scale(teapotM, teapotM, [0.6, 0.6, 0.6]);
      gl.uniformMatrix4fv(program.uModelT, false, teapotM);
      gl.bindVertexArray(myTeapot.VAO);
      gl.drawElements(gl.TRIANGLES, myTeapot.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  {
      let coneM = glMatrix.mat4.create();
      glMatrix.mat4.translate(coneM, coneM, [3, platformTopY + 0.4, 0]); 
      glMatrix.mat4.scale(coneM, coneM, [0.8, 0.8, 0.8]);
      gl.uniformMatrix4fv(program.uModelT, false, coneM);
      gl.bindVertexArray(myCone.VAO);
      gl.drawElements(gl.TRIANGLES, myCone.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}


  
///////////////////////////////////////////////////////////////////
//
//   You shouldn't have to edit below this line
//
///////////////////////////////////////////////////////////////////

  // Given an id, extract the content's of a shader script
  // from the DOM and return the compiled shader
  function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
      return null;
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  // Create a program with the appropriate vertex and fragment shaders
  function initProgram() {
    const vertexShader = getShader('vertex-shader');
    const fragmentShader = getShader('fragment-shader');

    // Create a program
    program = gl.createProgram();
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aBary = gl.getAttribLocation(program, 'bary');
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
  }

  // creates a VAO and returns its ID
  function bindVAO (shape) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 4, gl.FLOAT, false, 0, 0);
      
      // create and bind bary buffer
      let myBaryBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.bary), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aBary);
      gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);
      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
    
  }

  
  // We call draw to render to our canvas
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }


    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    initProgram();
    
    // create and bind your current object
    createShapes();
    
    // set up your camera
    setUpCamera();
    
    // do a draw
    draw();
  }
