//
// fill in code that creates the triangles for a cube with dimensions 1x1x1
// on each side (and the origin in the center of the cube). with an equal
// number of subdivisions along each cube face as given by the parameter
//subdivisions
////
//function makeCube(subdivisions) {
//    // Front face (z = 0.5)
//    addTriangle(-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5);
//    addTriangle(-0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5);
//
//    // Back face (z = -0.5)
//    addTriangle(-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5);
//    addTriangle(-0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5);
//
//    // Left face (x = -0.5)
//    addTriangle(-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5);
//    addTriangle(-0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5);
//
//    // Right face (x = 0.5)
//    addTriangle(0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5);
//    addTriangle(0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5);
//
//    // Top face (y = 0.5)
//    addTriangle(-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5);
//    addTriangle(-0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5);
//
//    // Bottom face (y = -0.5)
//    addTriangle(-0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5);
//    addTriangle(-0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5);
//}

function makeCube(subdivisions) {
    let step = 1.0 / subdivisions; 
    function generateFace(uDir, vDir, origin) {
    for (let i = 0; i < subdivisions; i++) {
        for (let j = 0; j < subdivisions; j++) {
            let u0 = i * step - 0.5;
            let v0 = j * step - 0.5;
            let u1 = (i + 1) * step - 0.5;
            let v1 = (j + 1) * step - 0.5;

            let p0 = [
                origin[0] + u0 * uDir[0] + v0 * vDir[0],
                origin[1] + u0 * uDir[1] + v0 * vDir[1],
                origin[2] + u0 * uDir[2] + v0 * vDir[2]
            ];
            let p1 = [
                origin[0] + u1 * uDir[0] + v0 * vDir[0],
                origin[1] + u1 * uDir[1] + v0 * vDir[1],
                origin[2] + u1 * uDir[2] + v0 * vDir[2]
            ];
            let p2 = [
                origin[0] + u0 * uDir[0] + v1 * vDir[0],
                origin[1] + u0 * uDir[1] + v1 * vDir[1],
                origin[2] + u0 * uDir[2] + v1 * vDir[2]
            ];
            let p3 = [
                origin[0] + u1 * uDir[0] + v1 * vDir[0],
                origin[1] + u1 * uDir[1] + v1 * vDir[1],
                origin[2] + u1 * uDir[2] + v1 * vDir[2]
            ];

            addTriangle(p0[0], p0[1], p0[2],  
                p1[0], p1[1], p1[2],  
                p2[0], p2[1], p2[2]);
    
            addTriangle(p1[0], p1[1], p1[2],  
                p3[0], p3[1], p3[2],  
                p2[0], p2[1], p2[2]);
        }
    }
}

    generateFace( [1, 0, 0], [0, 1, 0], [0, 0, 0.5]);  
    generateFace( [-1, 0, 0], [0, 1, 0], [0, 0, -0.5]); 
    generateFace( [0, 0, 1], [0, 1, 0], [-0.5, 0, 0]);  
    generateFace( [0, 0, -1], [0, 1, 0], [0.5, 0, 0]);   
    generateFace( [1, 0, 0], [0, 0, -1], [0, 0.5, 0]);   
    generateFace([1, 0, 0], [0, 0, 1], [0, -0.5, 0]);  
}



//
// fill in code that creates the triangles for a cylinder with diameter 1
// and height of 1 (centered at the origin) with the number of subdivisions
// around the base and top of the cylinder (given by radialdivision) and
// the number of subdivisions along the surface of the cylinder given by
//heightdivision.
//
function makeCylinder(radialdivision, heightdivision) {
    let radius = 0.5; 
    let height = 1.0;
    let topCenter = [0, 0.5, 0]; 
    let bottomCenter = [0, -0.5, 0]; 
    let angleStep = (2 * Math.PI) / radialdivision;
    let heightStep = height / heightdivision;


    for (let i = 0; i < radialdivision; i++) {
        let theta1 = i * angleStep;
        let theta2 = (i + 1) * angleStep;

        let p1 = [radius * Math.cos(theta1), -0.5, radius * Math.sin(theta1)];
        let p2 = [radius * Math.cos(theta2), -0.5, radius * Math.sin(theta2)];


        addTriangle(bottomCenter[0], bottomCenter[1], bottomCenter[2],
                    p2[0], p2[1], p2[2],
                    p1[0], p1[1], p1[2]);
    }


    for (let i = 0; i < radialdivision; i++) {
        let theta1 = i * angleStep;
        let theta2 = (i + 1) * angleStep;

        let p1 = [radius * Math.cos(theta1), 0.5, radius * Math.sin(theta1)];
        let p2 = [radius * Math.cos(theta2), 0.5, radius * Math.sin(theta2)];

        addTriangle(topCenter[0], topCenter[1], topCenter[2],
                    p1[0], p1[1], p1[2],
                    p2[0], p2[1], p2[2]);
    }

    for (let i = 0; i < radialdivision; i++) {
        let theta1 = i * angleStep;
        let theta2 = (i + 1) * angleStep;

        let p1 = [radius * Math.cos(theta1), -0.5, radius * Math.sin(theta1)];
        let p2 = [radius * Math.cos(theta2), -0.5, radius * Math.sin(theta2)];
        let prevRow = [p1, p2];

        for (let j = 1; j <= heightdivision; j++) {
            let y = -0.5 + j * heightStep;
            let newP1 = [radius * Math.cos(theta1), y, radius * Math.sin(theta1)];
            let newP2 = [radius * Math.cos(theta2), y, radius * Math.sin(theta2)];

            addTriangle(prevRow[0][0], prevRow[0][1], prevRow[0][2],
                        prevRow[1][0], prevRow[1][1], prevRow[1][2],
                        newP1[0], newP1[1], newP1[2]);

            addTriangle(newP1[0], newP1[1], newP1[2],
                        prevRow[1][0], prevRow[1][1], prevRow[1][2],
                        newP2[0], newP2[1], newP2[2]);

            prevRow = [newP1, newP2]; 
        }
    }
}



//
// fill in code that creates the triangles for a cone with diameter 1
// and height of 1 (centered at the origin) with the number of
// subdivisions around the base of the cone (given by radialdivision)
// and the number of subdivisions along the surface of the cone
//given by heightdivision.
//
function makeCone(radialdivision, heightdivision) {
    let radius = 0.5;  
    let height = 1.0;
    let topPoint = [0, 0.5, 0];  
    let baseCenter = [0, -0.5, 0];  
    let angleStep = (2 * Math.PI) / radialdivision;

    for (let i = 0; i < radialdivision; i++) {
        let theta1 = i * angleStep;
        let theta2 = (i + 1) * angleStep;

        let p1 = [radius * Math.cos(theta1), -0.5, radius * Math.sin(theta1)];
        let p2 = [radius * Math.cos(theta2), -0.5, radius * Math.sin(theta2)];

        // Base triangle (counterclockwise order)
        addTriangle(baseCenter[0], baseCenter[1], baseCenter[2],
                    p2[0], p2[1], p2[2],
                    p1[0], p1[1], p1[2]);
    }

    for (let i = 0; i < radialdivision; i++) {
        let theta1 = i * angleStep;
        let theta2 = (i + 1) * angleStep;   

        let p1 = [radius * Math.cos(theta1), -0.5, radius * Math.sin(theta1)];
        let p2 = [radius * Math.cos(theta2), -0.5, radius * Math.sin(theta2)];

        let prevRow = [p1, p2]; // Start at the base

        for (let j = 1; j <= heightdivision; j++) {
            let t = j / heightdivision;
            let newP1 = [(1 - t) * p1[0], -0.5 + t * height, (1 - t) * p1[2]];
            let newP2 = [(1 - t) * p2[0], -0.5 + t * height, (1 - t) * p2[2]];

            addTriangle(prevRow[0][0], prevRow[0][1], prevRow[0][2],
                        prevRow[1][0], prevRow[1][1], prevRow[1][2],
                        newP1[0], newP1[1], newP1[2]);

            addTriangle(newP1[0], newP1[1], newP1[2],
                        prevRow[1][0], prevRow[1][1], prevRow[1][2],
                        newP2[0], newP2[1], newP2[2]);

            prevRow = [newP1, newP2]; 
        }

        addTriangle(prevRow[0][0], prevRow[0][1], prevRow[0][2],
                    prevRow[1][0], prevRow[1][1], prevRow[1][2],
                    topPoint[0], topPoint[1], topPoint[2]);
    }
}

    
    //
    // fill in code that creates the triangles for a sphere with diameter 1
    // (centered at the origin) with number of slides (longitude) given by
    // slices and the number of stacks (lattitude) given by stacks.
    // For this function, you will implement the tessellation method based
    // on spherical coordinates as described in the video (as opposed to the
    //recursive subdivision method).
    //
    function makeSphere(slices, stacks) {
        let radius = 0.5; 
        let phiStep = Math.PI / stacks; 
        let thetaStep = (2 * Math.PI) / slices;
    
        for (let i = 0; i < stacks; i++) {
            let phi1 = i * phiStep;
            let phi2 = (i + 1) * phiStep;
    
            for (let j = 0; j < slices; j++) {
                let theta1 = j * thetaStep;
                let theta2 = (j + 1) * thetaStep;
    
                // Convert spherical coordinates to Cartesian
                let p1 = [radius * Math.sin(phi1) * Math.cos(theta1), radius * Math.cos(phi1), radius * Math.sin(phi1) * Math.sin(theta1)];
                let p2 = [radius * Math.sin(phi1) * Math.cos(theta2), radius * Math.cos(phi1), radius * Math.sin(phi1) * Math.sin(theta2)];
                let p3 = [radius * Math.sin(phi2) * Math.cos(theta1), radius * Math.cos(phi2), radius * Math.sin(phi2) * Math.sin(theta1)];
                let p4 = [radius * Math.sin(phi2) * Math.cos(theta2), radius * Math.cos(phi2), radius * Math.sin(phi2) * Math.sin(theta2)];
    
                if (i != 0) {
                    addTriangle(p1[0], p1[1], p1[2],
                                p2[0], p2[1], p2[2],
                                p3[0], p3[1], p3[2]);
                }
    
                if (i != stacks - 1) {
                    addTriangle(p3[0], p3[1], p3[2],
                                p2[0], p2[1], p2[2],
                                p4[0], p4[1], p4[2]);
                }
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

