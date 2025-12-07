import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

/**
 * creates three shape object from array of points
 * @param {*} points_array 
 * @returns new shape object
 */
function drawShape(points_array) {
    let curve = new T.Shape();
    let x_off = points_array[0][0];
    let y_off = points_array[0][1];

    curve.moveTo(0, 0);
    points_array.forEach(point => curve.lineTo(point[0]-x_off, point[1]-y_off));
    curve.lineTo(0, 0);

    return curve;
}

/**
 * creates shadow for insect given radius
 * @param {*} radius 
 * @returns shadow material and shadow objects
 */
function createShadow(radius) {
    let shadow_geom = new T.CylinderGeometry(radius, radius, 0.01);
    let shadow_mat = new T.MeshStandardMaterial({ color: "black", transparent: true, opacity: 0.5 });
    let shadow = new T.Mesh(shadow_geom, shadow_mat);

    return shadow;
}

/**
 * makes all materials in mat_array invisible
 * @param {*} mat_array 
 */
function clearOpacity(mat_array) {
    mat_array.forEach(mat => {
        mat.object.opacity = 0;
    });
}

let butterflyCtr = 0;
export class GrButterfly extends GrObject{
    constructor(params = {}) {
        let butterfly = new T.Group();
        let mat_array = [];
        
        // WINGS //
        let wings = new T.Group();
        butterfly.add(wings);
        // geom
        let wing_points = [[2.65, 1.44], [2.56, 1.16], [1.97, 0.81], [1.70, 0.74], [1.58, 0.81], [1.57, 0.97], [1.66, 1.02], [1.90, 1.59], [2.04, 1.64],
            [1.95, 1.71], [1.91, 2.15], [2.17, 2.29], [2.31, 2.24], [2.57, 1.95]];
        let wing_curve = drawShape(wing_points);
        let wing_geom = new T.ExtrudeGeometry(wing_curve, { depth: 0.05, bevelEnabled: false });
        let wing_mat = new T.MeshStandardMaterial({ color: "blue", transparent: true });
        mat_array.push({ object: wing_mat, opacity: wing_mat.opacity });

        // placement
        let wing1 = new T.Mesh(wing_geom, wing_mat);
        wings.add(wing1);
        wing1.position.set(0.01, 0, -0.02);
        let wing2 = new T.Mesh(wing_geom, wing_mat);
        wings.add(wing2);
        wing2.rotateY(Math.PI);
        wing2.position.set(-0.01, 0, 0.02);
        wings.rotateZ(Math.PI);

        // BODY //
        let body_geom = new T.CylinderGeometry(0.05, 0.05, 0.45);
        let body_mat = new T.MeshStandardMaterial({ color: "brown", transparent: true});
        mat_array.push({ object: body_mat, opacity: body_mat.opacity });
        let body = new T.Mesh(body_geom, body_mat);
        butterfly.add(body);

        let antenna_geom = new T.CylinderGeometry(0.015, 0.015, 0.2);
        for(let i = -1; i < 2; i += 2) {
            let antenna = new T.Mesh(antenna_geom, body_mat);
            body.add(antenna);
            antenna.position.set(i*0.05, 0.3, 0);
            antenna.rotateZ(-i*Math.PI/8);
        }

        // SHADOW //
        let shadow = createShadow(1);
        mat_array.push({ object: shadow.material, opacity: shadow.material.opacity});
        butterfly.add(shadow);
        shadow.rotateX(Math.PI/2);
        shadow.position.set(0, 0, 1);

        butterfly.rotateX(Math.PI/2);

        super(`Butterfly-${butterflyCtr++}`, butterfly);
        this.whole_ob = butterfly;
        this.wing_left = wing2;
        this.wing_right = wing1;
        this.x = params.x ? Number(params.x) : 0;
        this.z = params.z ? Number(params.z) : 0;

        this.angle = 0;
        this.wing_max_rotation = Math.PI/3;
        this.rotate_direction = 1;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
        this.material_array = mat_array;
    }

    capture() {
        this.captured = true;
        clearOpacity(this.material_array);
    }

    stepWorld(delta, timeOfDay) {
        // movement path
        this.angle += delta/1000;
        let x = this.x + Math.sin(this.angle);
        let z = this.z + Math.cos(this.angle);
        this.whole_ob.position.set(-x, this.whole_ob.position.y, -z);
        // x rotation keeps butterfly's top visible to player, z rotation makes butterfly point forward
        this.whole_ob.rotation.set(this.whole_ob.rotation.x, 0, Math.atan2(Math.cos(this.angle), Math.sin(this.angle)));

        // wings flapping
        if(this.wing_left.rotation.y >= this.wing_max_rotation) {
            this.rotate_direction = -1;
        } else if(this.wing_left.rotation.y <= -this.wing_max_rotation) {
            this.rotate_direction = 1;
        }
        this.wing_left.rotation.y += this.rotate_direction * 0.0075 * delta;
        this.wing_right.rotation.y += this.rotate_direction * 0.0075 * delta;
    }
}

let snailCtr = 0;
export class GrSnail extends GrObject {
    constructor(params = {}) {
        let snail = new T.Group();
        let mat_array = [];

        // BODY //
        let body_points = [[2.41, 1.48], [2.18, 1.50], [2.02, 1.82], [2.73, 1.82], [2.70, 1.46], [2.78, 1.11], 
            [2.90, 1.09], [2.94, 0.99], [2.88, 0.94], [2.69, 0.89], [2.58, 0.96]];
        let body_curve = drawShape(body_points);
        let body_geom = new T.ExtrudeGeometry(body_curve, { depth: 0.2, bevelEnabled: false });
        let body_mat = new T.MeshStandardMaterial({ color: "yellow", transparent: true });
        mat_array.push({ object: body_mat, opacity: body_mat.opacity});

        let body = new T.Mesh(body_geom, body_mat);
        snail.add(body);
        body.scale.set(0.5, 0.5, 0.5);
        body.rotateX(Math.PI);

        let antenna_geom = new T.CylinderGeometry(0.02, 0.02, 0.5);
        let antenna = new T.Mesh(antenna_geom, body_mat);
        body.add(antenna);
        antenna.position.set(0.3, -0.7, 0.2);
        antenna.rotateX(-Math.PI/8);
        let antenna2 = new T.Mesh(antenna_geom, body_mat);
        body.add(antenna2);
        antenna2.position.set(0.3, -0.7, 0);
        antenna2.rotateX(Math.PI/8);

        // SHELL //
        let shell_geom = new T.SphereGeometry(0.25);
        let shell_mat = new T.MeshStandardMaterial({ color: "brown", transparent: true });
        mat_array.push({ object: shell_mat, opacity: shell_mat.opacity});
        let shell = new T.Mesh(shell_geom, shell_mat);

        snail.add(shell);
        shell.position.set(-0.15, 0.05, -0.1);
        shell.scale.set(1, 1, 0.85);

        // SHADOW //
        let shadow = createShadow(0.25);
        mat_array.push({ object: shadow.material, opacity: shadow.material.opacity });
        snail.add(shadow);
        shadow.position.set(0, -0.2, -0.05);

        super(`Snail-${snailCtr++}`, snail);
        this.whole_ob = snail;
        this.x = params.x ? Number(params.x) : 0;
        this.z = params.z ? Number(params.z) : 0;

        // velocity
        this.x_dir = 1;
        this.x_next = 1;
        this.y_dir = 1;
        this.y_next = 1;
        // destination coordinates
        this.rand_x = this.x + Math.random()*0.2 - 0.1;
        this.rand_y = this.x + Math.random()*0.2 - 0.1;
        this.time = 0;
        this.angle_arr = [];
        this.oscil_count = 0;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
        this.material_array = mat_array;
    }

    capture() {
        this.captured = true;
        clearOpacity(this.material_array);
    }

    stepWorld(delta, timeOfDay) {
        this.time += delta/1000;        
        let x = this.whole_ob.position.x;
        let y = this.whole_ob.position.z;
        let dist = Math.sqrt((x+3)*(x+3) + (y-3)*(y-3)); // distance from center of the rock the snail is on

        // will increment position + rotation if outside of range of target position
        if(Math.abs(x-this.rand_x) > 0.1) {
            // movement
            let new_x = x + this.x_dir * this.time + (this.rand_x - x - this.x_dir)*Math.pow(this.time, 2);
            let new_y = y + this.y_dir * this.time + (this.rand_y - y - this.y_dir)*Math.pow(this.time, 2);

            let mag = Math.sqrt(Math.pow(new_x, 2) + Math.pow(new_y, 2));
            this.x_dir = new_x/mag;
            this.y_dir = new_y/mag;

            // rotation
            let rot_x = new_x + (this.rand_x - x - new_x) * 0.2*this.time;
            let rot_y = new_y + (this.rand_y - y - new_y) * 0.2*this.time;
            let angle = Math.atan2(-rot_y, rot_x);
            if(this.angle_arr.length === 0) {
                this.angle_arr.push(angle);
            } else if(Math.abs(this.angle_arr[0]-angle) < 0.5 && this.angle_arr[0]*angle > 0) {
                // if within certain range of e/o, don't need to keep track of any changes
                this.angle_arr = [];
                this.angle_arr.push(angle);
            } else { // have different signs
                this.oscil_count++;
                let last_angle = this.angle_arr[this.angle_arr.length - 1];
                // if have multiple angles that are different from the original sign, accepts sign change
                if((this.angle_arr.length > 2 && Math.abs(last_angle-angle) < 0.5 && last_angle*angle > 0)) {
                    this.angle_arr.shift();
                }
                this.angle_arr.push(angle);
            }
            console.log("CUR ANGLE", angle);
            console.log(this.angle_arr);

            this.whole_ob.position.x += this.x_dir * 0.005;
            this.whole_ob.position.z += this.y_dir * 0.005 ;
            this.whole_ob.rotation.set(this.whole_ob.rotation.x, this.angle_arr[0], 0);
        } else {
            // changes direction randomly or if outside of radius
            this.rand_x = this.x + Math.random()*0.2 - 0.1;
            this.rand_y = this.x + Math.random()*0.2 - 0.1;
            console.log('changed rand', this.rand_x, this.rand_y);
            // this.angle_arr = [this.angle_arr[0]];
        }
    }
}