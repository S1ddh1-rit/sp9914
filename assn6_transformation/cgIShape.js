class cgIShape {
    constructor () {
        this.points = [];
        this.bary = [];
        this.indices = [];
    }
    
    addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {
        var nverts = this.points.length / 4;
        
        // push first vertex
        this.points.push(x0);  this.bary.push (1.0);
        this.points.push(y0);  this.bary.push (0.0);
        this.points.push(z0);  this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
        
        // push second vertex
        this.points.push(x1); this.bary.push (0.0);
        this.points.push(y1); this.bary.push (1.0);
        this.points.push(z1); this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++
        
        // push third vertex
        this.points.push(x2); this.bary.push (0.0);
        this.points.push(y2); this.bary.push (0.0);
        this.points.push(z2); this.bary.push (1.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
    }
}

class Cube extends cgIShape {
    
    constructor (subdivisions) {
        super();
        this.makeCube (subdivisions);
    }
    
    makeCube(subdivisions) {
        const stepSize = 1.0 / subdivisions;

        const generateFace = (uDir, vDir, base) => {
            for (let row = 0; row < subdivisions; row++) {
                for (let col = 0; col < subdivisions; col++) {
                    const u0 = row * stepSize - 0.5;
                    const v0 = col * stepSize - 0.5;
                    const u1 = (row + 1) * stepSize - 0.5;
                    const v1 = (col + 1) * stepSize - 0.5;

                    const pos = (u, v) => [
                        base[0] + u * uDir[0] + v * vDir[0],
                        base[1] + u * uDir[1] + v * vDir[1],
                        base[2] + u * uDir[2] + v * vDir[2]
                    ];

                    const A = pos(u0, v0), B = pos(u1, v0), C = pos(u0, v1), D = pos(u1, v1);
                    this.addTriangle(...A, ...B, ...C);
                    this.addTriangle(...B, ...D, ...C);
                }
            }
        };

        generateFace([1, 0, 0], [0, 1, 0], [0, 0, 0.5]);
        generateFace([-1, 0, 0], [0, 1, 0], [0, 0, -0.5]);
        generateFace([0, 0, 1], [0, 1, 0], [-0.5, 0, 0]);
        generateFace([0, 0, -1], [0, 1, 0], [0.5, 0, 0]);
        generateFace([1, 0, 0], [0, 0, -1], [0, 0.5, 0]);
        generateFace([1, 0, 0], [0, 0, 1], [0, -0.5, 0]);
    }
}


class Cylinder extends cgIShape {

    constructor (radialdivision,heightdivision) {
        super();
        this.makeCylinder (radialdivision,heightdivision);
    }
    
    makeCylinder(radialDivisions, heightDivisions) {
        const radius = 0.5, height = 1.0;
        const angleStep = 2 * Math.PI / radialDivisions;
        const heightStep = height / heightDivisions;

        const v = (theta, y) => [radius * Math.cos(theta), y, radius * Math.sin(theta)];

        for (let i = 0; i < radialDivisions; i++) {
            const t1 = i * angleStep, t2 = (i + 1) * angleStep;

            let b1 = v(t1, -0.5), b2 = v(t2, -0.5);
            let t1v = v(t1, 0.5), t2v = v(t2, 0.5);

            this.addTriangle(0, -0.5, 0, ...b2, ...b1);
            this.addTriangle(0, 0.5, 0, ...t1v, ...t2v);

            for (let j = 1; j <= heightDivisions; j++) {
                const y = -0.5 + j * heightStep;
                const nb1 = v(t1, y), nb2 = v(t2, y);

                this.addTriangle(...b1, ...b2, ...nb1);
                this.addTriangle(...nb1, ...b2, ...nb2);

                b1 = nb1;
                b2 = nb2;
            }
        }
    }
}

class Cone extends cgIShape {

    constructor (radialdivision, heightdivision) {
        super();
        this.makeCone (radialdivision, heightdivision);
    }
    
    
    makeCone(radialDivisions, heightDivisions) {
        const radius = 0.5, height = 1.0;
        const angleStep = 2 * Math.PI / radialDivisions;

        const v = (theta, y, r) => [r * Math.cos(theta), y, r * Math.sin(theta)];

        for (let i = 0; i < radialDivisions; i++) {
            const t1 = i * angleStep, t2 = (i + 1) * angleStep;

            let b1 = v(t1, -0.5, radius), b2 = v(t2, -0.5, radius);
            this.addTriangle(0, -0.5, 0, ...b2, ...b1);

            for (let j = 1; j <= heightDivisions; j++) {
                const t = j / heightDivisions;
                const y = -0.5 + t * height;
                const r = (1 - t) * radius;

                const nb1 = v(t1, y, r), nb2 = v(t2, y, r);
                this.addTriangle(...b1, ...b2, ...nb1);
                this.addTriangle(...nb1, ...b2, ...nb2);

                b1 = nb1;
                b2 = nb2;
            }

            this.addTriangle(...b1, ...b2, 0, 0.5, 0);
        }
    }
}
    
class Sphere extends cgIShape {

    constructor (slices, stacks) {
        super();
        this.makeSphere (slices, stacks);
    }
    
    makeSphere(slices, stacks) {
        const r = 0.5;
        const phiStep = Math.PI / stacks;
        const thetaStep = 2 * Math.PI / slices;

        const v = (phi, theta) => [
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        ];

        for (let i = 0; i < stacks; i++) {
            const phi1 = i * phiStep, phi2 = (i + 1) * phiStep;
            for (let j = 0; j < slices; j++) {
                const theta1 = j * thetaStep, theta2 = (j + 1) * thetaStep;

                const v1 = v(phi1, theta1), v2 = v(phi1, theta2);
                const v3 = v(phi2, theta1), v4 = v(phi2, theta2);

                if (i !== 0) this.addTriangle(...v1, ...v2, ...v3);
                if (i !== stacks - 1) this.addTriangle(...v3, ...v2, ...v4);
            }
        }
    }

}


function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

