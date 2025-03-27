function makeCube(subdivisions) {
    let stepSize = 1.0 / subdivisions;    
    function generateFace(uDirection, vDirection, basePoint) {
        for (let row = 0; row < subdivisions; row++) {
            for (let col = 0; col < subdivisions; col++) {
                let uStart = row * stepSize - 0.5;
                let vStart = col * stepSize - 0.5;
                let uEnd = (row + 1) * stepSize - 0.5;
                let vEnd = (col + 1) * stepSize - 0.5;
                function computePosition(u, v) {
                    return [                        
                        basePoint[0] + u * uDirection[0] + v * vDirection[0],
                        basePoint[1] + u * uDirection[1] + v * vDirection[1],
                        basePoint[2] + u * uDirection[2] + v * vDirection[2]
                    ];
                }
                let vertexA = computePosition(uStart, vStart);
                let vertexB = computePosition(uEnd, vStart);
                let vertexC = computePosition(uStart, vEnd);
                let vertexD = computePosition(uEnd, vEnd);
                addTriangle(...vertexA, ...vertexB, ...vertexC);
                addTriangle(...vertexB, ...vertexD, ...vertexC);
            }
        }
    }

    generateFace([1, 0, 0], [0, 1, 0], [0, 0, 0.5]);  
    generateFace([-1, 0, 0], [0, 1, 0], [0, 0, -0.5]); 
    generateFace([0, 0, 1], [0, 1, 0], [-0.5, 0, 0]);  
    generateFace([0, 0, -1], [0, 1, 0], [0.5, 0, 0]);  
    generateFace([1, 0, 0], [0, 0, -1], [0, 0.5, 0]);  
    generateFace([1, 0, 0], [0, 0, 1], [0, -0.5, 0]);  
}

function makeCylinder(radialDivisions, heightDivisions) {
    let radius = 0.5;
    let height = 1.0;
    let angleStep = (2 * Math.PI) / radialDivisions;
    let heightStep = height / heightDivisions;
        function computeVertex(theta, y) {
        return [radius * Math.cos(theta), y, radius * Math.sin(theta)];
    }
    for (let i = 0; i < radialDivisions; i++) {
        let theta1 = i * angleStep;
        let theta2 = (i + 1) * angleStep;
        let baseVertex1 = computeVertex(theta1, -0.5);
        let baseVertex2 = computeVertex(theta2, -0.5);
        let topVertex1 = computeVertex(theta1, 0.5);
        let topVertex2 = computeVertex(theta2, 0.5);
        addTriangle(0, -0.5, 0, ...baseVertex2, ...baseVertex1);
        addTriangle(0, 0.5, 0, ...topVertex1, ...topVertex2);
        for (let j = 1; j <= heightDivisions; j++) {
            let y = -0.5 + j * heightStep;
            let newBaseVertex1 = computeVertex(theta1, y);
            let newBaseVertex2 = computeVertex(theta2, y);
            addTriangle(...baseVertex1, ...baseVertex2, ...newBaseVertex1);
            addTriangle(...newBaseVertex1, ...baseVertex2, ...newBaseVertex2);
            baseVertex1 = newBaseVertex1;
            baseVertex2 = newBaseVertex2;
        }
    }
}

function makeCone(radialDivisions, heightDivisions) {
    let radius = 0.5;
    let height = 1.0;
    let angleStep = (2 * Math.PI) / radialDivisions;    
    function computeVertex(theta, y, r) {
        return [r * Math.cos(theta), y, r * Math.sin(theta)];
    }
    for (let i = 0; i < radialDivisions; i++) {
        let theta1 = i * angleStep;
        let theta2 = (i + 1) * angleStep;
        let baseVertex1 = computeVertex(theta1, -0.5, radius);
        let baseVertex2 = computeVertex(theta2, -0.5, radius);
        addTriangle(0, -0.5, 0, ...baseVertex2, ...baseVertex1);
        for (let j = 1; j <= heightDivisions; j++) {
            let t = j / heightDivisions;
            let newVertex1 = computeVertex(theta1, -0.5 + t * height, (1 - t) * radius);
            let newVertex2 = computeVertex(theta2, -0.5 + t * height, (1 - t) * radius);
            addTriangle(...baseVertex1, ...baseVertex2, ...newVertex1);
            addTriangle(...newVertex1, ...baseVertex2, ...newVertex2);
            baseVertex1 = newVertex1;
            baseVertex2 = newVertex2;
        }
        addTriangle(...baseVertex1, ...baseVertex2, 0, 0.5, 0);
    }
}

function makeSphere(slices, stacks) {
    let radius = 0.5;
    let phiStep = Math.PI / stacks;
    let thetaStep = (2 * Math.PI) / slices;
    function computeVertex(phi, theta) {
        return [radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta)];
    }
    for (let i = 0; i < stacks; i++) {
        let phi1 = i * phiStep;
        let phi2 = (i + 1) * phiStep;
        for (let j = 0; j < slices; j++) {
            let theta1 = j * thetaStep;
            let theta2 = (j + 1) * thetaStep;
            let vertex1 = computeVertex(phi1, theta1);
            let vertex2 = computeVertex(phi1, theta2);
            let vertex3 = computeVertex(phi2, theta1);
            let vertex4 = computeVertex(phi2, theta2);
            if (i != 0) addTriangle(...vertex1, ...vertex2, ...vertex3);
            if (i != stacks - 1) addTriangle(...vertex3, ...vertex2, ...vertex4);
        }
    }
}


////////////////////////////////////////////////////////////////////
//
//  Do not edit below this line
//
///////////////////////////////////////////////////////////////////

function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {

    
    var nverts = points.length / 4;
    
    // push first vertex
    points.push(x0);  bary.push (1.0);
    points.push(y0);  bary.push (0.0);
    points.push(z0);  bary.push (0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
    
    // push second vertex
    points.push(x1); bary.push (0.0);
    points.push(y1); bary.push (1.0);
    points.push(z1); bary.push (0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++
    
    // push third vertex
    points.push(x2); bary.push (0.0);
    points.push(y2); bary.push (0.0);
    points.push(z2); bary.push (1.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
}