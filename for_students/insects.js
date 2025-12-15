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
    let shadow_mat = new T.MeshStandardMaterial({ color: 0x100e5d, transparent: true, opacity: 0.5 });
    let shadow = new T.Mesh(shadow_geom, shadow_mat);

    return shadow;
}

function clearOpacity(mat_arr) {
    mat_arr.forEach(mat => mat.object.opacity -= mat.object.opacity > 0 ? 0.1 : 0);
}

function restoreOpacity(mat_arr) {
    mat_arr.forEach(mat => mat.object.opacity = mat.opacity);
}

let butterflyCtr = 0;
export class GrButterfly extends GrObject{
    constructor(params = {}) {
        let butterfly = new T.Group();
        let mat_array = [];
        let tl = new T.TextureLoader();
        
        // WINGS //
        let wings = new T.Group();
        butterfly.add(wings);
        // geom
        let wing_points = [[2.65, 1.44], [2.56, 1.16], [1.97, 0.81], [1.70, 0.74], [1.58, 0.81], [1.57, 0.97], [1.66, 1.02], [1.90, 1.59], [2.04, 1.64],
            [1.95, 1.71], [1.91, 2.15], [2.17, 2.29], [2.31, 2.24], [2.57, 1.95]];
        let wing_curve = drawShape(wing_points);
        let wing_geom = new T.ExtrudeGeometry(wing_curve, { depth: 0.05, bevelEnabled: false });
        let wing_map = params.color === "blue" ? tl.load("./textures/butterfly_blue.png") : tl.load("./textures/butterfly_orange.png");
        wing_map.wrapT = T.RepeatWrapping;
        wing_map.wrapS = T.RepeatWrapping;

        let wing_mat = new T.MeshStandardMaterial({ color: params.color === "blue" ? 0x97bfed : 0xffc67a,
            map: wing_map, transparent: true });
        mat_array.push(wing_mat);

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
        let body_mat = new T.MeshStandardMaterial({ color: 0x513021, transparent: true});
        mat_array.push(body_mat);
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
        butterfly.add(shadow);
        mat_array.push(shadow.material);
        shadow.rotateX(Math.PI/2);
        shadow.position.set(0, 0, 1);

        butterfly.rotateX(Math.PI/2);

        super(`Butterfly-${butterflyCtr++}`, butterfly);
        this.whole_ob = butterfly;
        this.material_array = mat_array;

        this.wing_left = wing2;
        this.wing_right = wing1;
        this.shadow = shadow;
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
    }

    capture() {
        this.captured = true;
        this.whole_ob.position.set(0, -5, 0);
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
        let body_mat = new T.MeshStandardMaterial({ color: params.color === "white" ? "white" : "yellow", transparent: true });
        mat_array.push({ object: body_mat, opacity: body_mat.opacity });

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
        let shell_mat = new T.MeshStandardMaterial({ color: params.color === "white" ? 0xd7bd9a : "brown", transparent: true });
        mat_array.push({ object: shell_mat, opacity: shell_mat.opacity });
        let shell = new T.Mesh(shell_geom, shell_mat);

        snail.add(shell);
        shell.position.set(-0.15, 0.05, -0.1);
        shell.scale.set(1, 1, 0.85);

        // SHADOW //
        let shadow = createShadow(0.25);
        snail.add(shadow);
        mat_array.push({ object: shadow.material, opacity: shadow.material.opacity });
        shadow.position.set(0, -0.2, -0.05);

        super(`Snail-${snailCtr++}`, snail);
        this.whole_ob = snail;
        this.material_array = mat_array;
        this.x = params.x ? Number(params.x) : 0;
        this.z = params.z ? Number(params.z) : 0;
        // velocity
        this.x_dir = 1;
        this.y_dir = 1;
        this.x_prev = 1;
        this.y_prev = 1;
        this.time = 0;
        this.turning = false;
        this.flipping = false;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
        this.scare = params.scare ? Boolean(params.scare) : false;
        this.covered = true;
        this.fleeing = false;
        this.time_flee = 0;
    }

    capture() {
        this.captured = true;
        this.whole_ob.position.set(0, -5, 0);
    }

    stepWorld(delta, timeOfDay) {
        this.time += delta/1000;

        let x = this.whole_ob.position.x;
        let y = this.whole_ob.position.z;
        let dist = Math.sqrt((x-this.x)*(x-this.x) + (y-this.z)*(y-this.z)); // distance from center of the rock the snail is on

        // adjust x and y velocity randomly or if outside circle radius
        if(Math.random() < 0.1 && !this.turning) {
            this.turning = true;
            this.time = 0;
            this.x_prev = this.x_dir;
            this.y_prev = this.y_dir;

            this.x_dir += Math.random() - 0.5;
            this.y_dir += Math.random() - 0.5;
            let mag = Math.sqrt(Math.pow(this.x_dir, 2) + Math.pow(this.y_dir, 2));

            this.x_dir = this.x_dir / mag;
            this.y_dir = this.y_dir / mag;
        }
        if(dist > 1) {
            this.flipping = true;
            this.time = 0;
            this.x_dir = -this.x_dir;
            this.y_dir = -this.y_dir;
        }

        if(this.turning) {
            // lerping prev and current velocities for smoother rotation
            let y_rot = Math.atan2(-(this.y_prev - (this.y_prev - this.y_dir) * this.time),
                this.x_prev - (this.x_prev - this.x_dir) * this.time);
            this.whole_ob.rotation.set(this.whole_ob.rotation.x, y_rot, 0);
            if(this.time > 1) {
                this.turning = false;
            }
        }
        if(this.flipping) {
            let y_rot = Math.atan2(-(this.y_prev - (this.y_prev - this.y_dir) * this.time/2),
                this.x_prev - (this.x_prev - this.x_dir) * this.time/2);
            this.whole_ob.rotation.set(this.whole_ob.rotation.x, y_rot, 0);
            if(this.time > 2) {
                this.flipping = false;
            }
        }

        this.whole_ob.position.x += this.x_dir * 0.002;
        this.whole_ob.position.z += this.y_dir * 0.002;

        // flee/return mechanic
        if(this.fleeing) {
            if(this.covered) {
                this.time_flee += delta/1000;
            }
            if(this.time_flee > 3) {
                this.fleeing = false;
                restoreOpacity(this.material_array);
                this.time_flee = 0;
            } else {
                clearOpacity(this.material_array);
            }
        }
    }
}

let cicadaCtr = 0;
export class GrCicada extends GrObject {
    constructor(params = {}) {
        let cicada = new T.Group();

        // BODY //
        let body_points = [[1.80, 0.70], [1.91, 0.70], [2.02, 0.86], [2.02, 1.25], [1.94, 1.57], 
            [1.77, 1.57], [1.69, 1.25], [1.69, 0.86]];
        let body_curve = drawShape(body_points);
        let body_geom = new T.ExtrudeGeometry(body_curve, { depth: 0.05, bevelThickness: 0.1, bevelSize: 0.1 });
        let body_mat = new T.MeshStandardMaterial({ color: "green", transparent: true });

        let body = new T.Mesh(body_geom, body_mat);
        cicada.add(body);

        // legs
        let legs = new T.Group();
        body.add(legs);
        legs.position.set(0.05, 0.35, 0);

        let leg_geom = new T.CylinderGeometry(0.02, 0.02, 0.25);
        for(let i = -2; i < 2; i++) {
            let j = i < 0 ? -1 : 1;
            let k = i % 2 ? -1 : 1;
            let leg = new T.Mesh(leg_geom, body_mat);
            legs.add(leg);
            leg.position.set(j*0.3, k*0.2, 0);
            leg.rotateZ(j*Math.PI/4);
        }
        
        // WINGS //
        let wings = new T.Group();
        cicada.add(wings);
        wings.position.set(0.05, 0.15, -0.15);

        // geom
        let wing_points = [[1.68, 0.90], [1.85, 1.15], [1.92, 1.74], [1.81, 2.13], [1.74, 2.13], [1.63, 1.94], [1.52, 1.55]];
        let wing_curve = drawShape(wing_points);
        let wing_geom = new T.ExtrudeGeometry(wing_curve, { depth: 0.05, bevelEnabled: false });
        let wing_mat = new T.MeshStandardMaterial({ color: "blue", transparent: true, opacity: 0.5});

        // placement
        let wing1 = new T.Mesh(wing_geom, wing_mat);
        wings.add(wing1);
        wing1.position.set(-0.2, 0, 0);
        let wing2 = new T.Mesh(wing_geom, wing_mat);
        wings.add(wing2);
        wing2.rotateY(Math.PI);
        wing2.position.set(0.25, 0, 0.05);

        // SHADOW //
        let shadow = createShadow(0.5);
        cicada.add(shadow);
        shadow.rotateX(-Math.PI/2)
        shadow.position.set(0.05, 0.45, 0.25);

        super(`Cicada-${cicadaCtr++}`, cicada);
        this.whole_ob = cicada;
        this.wing_left = wing1;
        this.wing_right = wing2;
        this.wing_max_rotation = Math.PI/100;
        this.rotate_direction = 1;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.x = params.rot_x ? Number(params.rot_x) : Math.PI/2;
        this.whole_ob.rotation.y = params.rot_y ? Number(params.rot_y) : 0;
        this.whole_ob.rotation.z = params.rot_z ? Number(params.rot_z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
    }

    capture() {
        this.captured = true;
        this.whole_ob.position.set(0, -5, 0);
    }

    stepWorld(delta, timeOfDay) {
        if(this.wing_left.rotation.z >= this.wing_max_rotation) {
            this.rotate_direction = -1;
        } else if(this.wing_left.rotation.z <= -this.wing_max_rotation) {
            this.rotate_direction = 1;
        }
        this.wing_left.rotation.z += this.rotate_direction * 0.0001 * delta;
        this.wing_right.rotation.z += this.rotate_direction * 0.0001 * delta;
    }
}

let beetleCtr = 0;
export class GrBeetle extends GrObject {
    constructor(params = {}) {
        let beetle = new T.Group();
        let mat_array = [];

        // BODY //
        let body_geom = new T.SphereGeometry(0.35, 32, 16, 0, Math.PI);
        let body_mat = new T.MeshStandardMaterial({ color: params.color, roughness: 0.2, metalness: 0.8, transparent: true });
        mat_array.push({ object: body_mat, opacity: body_mat.opacity });
        let body = new T.Mesh(body_geom, body_mat);
        beetle.add(body);
        body.rotateX(-Math.PI/2);

        // dividing line for wings
        let wing_curve = new T.Shape();
        wing_curve.moveTo(0, 0);
        wing_curve.absarc(0, 0, 0.35, 0, Math.PI);
        let wing_geom = new T.ExtrudeGeometry(wing_curve, { depth: 0.03, bevelEnabled: false });
        let wing_mat = new T.MeshStandardMaterial({ color: params.color === "green" ? "black" : "green", transparent: true });
        mat_array.push({ object: wing_mat, opacity: wing_mat.opacity });

        let legs = new T.Group();
        body.add(legs);
        legs.position.set(0, -0.3, 0);

        let legs_left = [];
        let legs_right = [];
        let leg_geom = new T.CylinderGeometry(0.03, 0.03, 0.3);
        let leg_mat = new T.MeshStandardMaterial({ color: "brown", transparent: true });
        mat_array.push({ object: leg_mat, opacity: leg_mat.opacity });
        for(let i = -3; i < 4; i++) {
            if(i != 0) {
                let leg = new T.Mesh(leg_geom, leg_mat);
                legs.add(leg);
                if(i < 0) {
                    legs_left.push(leg);
                } else {
                    legs_right.push(leg);
                }

                let x = 0.35;
                leg.position.set(i < 0 ? -x : x, Math.abs(i)*0.15, 0);
                leg.rotateZ(Math.PI/2);
            }
        }
        
        let wing_line = new T.Mesh(wing_geom, wing_mat);
        body.add(wing_line);
        wing_line.rotation.set(-Math.PI/2, Math.PI/2, Math.PI);

        let head_geom = new T.SphereGeometry(0.2, 32, 16, 0, Math.PI);
        let head = new T.Mesh(head_geom, body_mat);
        body.add(head);
        head.position.set(0, 0.25, 0);

        // SHADOW //
        let shadow = createShadow(0.45);
        beetle.add(shadow);
        mat_array.push({ object: shadow.material, opacity: shadow.material.opacity });
        shadow.position.set(0, 0, 0);

        super(`Beetle-${beetleCtr++}`, beetle);
        this.whole_ob = beetle;
        this.material_array = mat_array;
        this.legs_left = legs_left;
        this.legs_right = legs_right;
        this.x = params.x ? Number(params.x) : 0;
        this.z = params.z ? Number(params.z) : 0;
        this.move = params.move;

        this.angle = 0;
        this.max_rotation = Math.PI/8;
        this.rotate_direction = 1;
        this.move_direction = 1;
        this.x_bound = [4, 6];

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
        this.scare = params.scare ? Boolean(params.scare) : false;
        this.covered = true;
        this.fleeing = false;
        this.time = 0;
    }

    capture() {
        this.captured = true;
        this.whole_ob.position.set(0, -5, 0);
    }

    stepWorld(delta, timeOfDay) {
        // movement is a figure eight
        this.angle += delta/1000;
        if(this.move === "eight") {
            let x = this.x + 1.5*Math.sin(this.angle);
            let z = this.z + 1.5*Math.cos(this.angle)*Math.sin(this.angle);
            this.whole_ob.position.set(-x, this.whole_ob.position.y, -z);

            let rot = Math.atan2(Math.cos(this.angle), 1.5*Math.cos(2*this.angle));
            this.whole_ob.rotation.y = rot;
        } else {
            this.whole_ob.position.x = this.x + Math.sin(this.angle);
            this.whole_ob.position.z = this.z + 0.5*Math.cos(this.angle);

            let rot = Math.atan2(-Math.cos(this.angle), 0.5*Math.sin(this.angle));
            this.whole_ob.rotation.y = rot;
        }

        // leg animation
        if(this.legs_left[0].rotation.z >= Math.PI/2 + this.max_rotation) {
            this.rotate_direction = -1;
        } else if(this.legs_left[0].rotation.z <= Math.PI/2 -this.max_rotation) {
            this.rotate_direction = 1;
        }

        this.legs_left.forEach(leg => leg.rotation.z += this.rotate_direction * 0.002 * delta);
        this.legs_right.forEach(leg => leg.rotation.z += this.rotate_direction * 0.002 * delta);

        // flee/return mechanic
        if(this.fleeing) {
            if(this.covered) {
                this.time += delta/1000;
            }
            if(this.time > 3) {
                this.fleeing = false;
                this.time = 0;
                restoreOpacity(this.material_array);
            } else {
                clearOpacity(this.material_array);
            }
        }
    }
}

let beeCtr = 0;
export class GrBee extends GrObject {
    constructor(params = {}) {
        let bee = new T.Group();
        let mat_array = [];

        // BODY //
        let body_geom = new T.CylinderGeometry(0.2, 0.2, 0.25);
        let body_mat = new T.MeshStandardMaterial({ color: "yellow", transparent: true });
        mat_array.push({ object: body_mat, opacity: body_mat.opacity });
        let body = new T.Mesh(body_geom, body_mat);
        bee.add(body);
        body.rotateX(Math.PI/2);

        let end_geom = new T.SphereGeometry(0.2);
        let end = new T.Mesh(end_geom, body_mat);
        body.add(end);
        end.position.set(0, -0.1, 0);
        let end2 = new T.Mesh(end_geom, body_mat);
        body.add(end2);
        end2.position.set(0, 0.1, 0);

        let stripe_geom = new T.CylinderGeometry(0.21, 0.21, 0.1);
        let stripe_mat = new T.MeshStandardMaterial({ color: "black", transparent: true });
        mat_array.push({ object: stripe_mat, opacity: stripe_mat.opacity });
        let stripe1 = new T.Mesh(stripe_geom, stripe_mat);
        body.add(stripe1);
        stripe1.position.set(0, -0.1, 0);
        let stripe2 = new T.Mesh(stripe_geom, stripe_mat);
        body.add(stripe2);
        stripe2.position.set(0, 0.1, 0);

        // WINGS //
        let wing_left;
        let wing_right;
        let wing_geom = new T.CylinderGeometry(0.15, 0.15, 0.05);
        let wing_mat = new T.MeshStandardMaterial({ color: "white", transparent: true, opacity: 0.75 });
        mat_array.push({ object: wing_mat, opacity: wing_mat.opacity });
        for(let i = -1; i < 2; i += 2) {
            let wing = new T.Mesh(wing_geom, wing_mat);
            body.add(wing);
            wing.scale.set(1, 1, 1.5);
            wing.position.set(i*0.1, 0, -0.25);
            wing.rotateZ(Math.PI/2);
            wing.rotateX(-i*Math.PI/8);

            if(i < 0) {
                wing_left = wing;
            } else {
                wing_right = wing;
            }
        }

        // SHADOW //
        let shadow = createShadow(0.35);
        bee.add(shadow);
        mat_array.push({ object: shadow.material, opacity: shadow.material.opacity });
        shadow.position.set(0, -0.25, 0);

        super(`Bee-${beeCtr++}`, bee);
        this.whole_ob = bee;
        this.material_array = mat_array;
        this.wing_left = wing_left;
        this.wing_right = wing_right;
        this.x = params.x ? Number(params.x) : 0;
        this.z = params.z ? Number(params.z) : 0;

        this.angle = 0;
        this.wing_max_rotation = Math.PI/4;
        this.rotate_direction = 1;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
    }

    capture() {
        this.captured = true;
        this.whole_ob.position.set(0, -5, 0);
    }

    stepWorld(delta, timeOfDay) {
        this.angle += delta/1000;
        let x = this.x + Math.sqrt(2)*Math.pow(Math.sin(this.angle), 3);
        let z = this.z + -Math.pow(Math.cos(this.angle), 3) - Math.pow(Math.cos(this.angle), 2) + 2*Math.cos(this.angle);
        this.whole_ob.position.set(x, this.whole_ob.position.y, z);

        let rot = Math.atan2(3*Math.pow(Math.cos(this.angle), 2)*Math.sin(this.angle) + 2*Math.cos(this.angle)*Math.sin(this.angle) - 2*Math.sin(this.angle),
            3*Math.sqrt(2)*Math.pow(Math.sin(this.angle), 2)*Math.cos(this.angle));
        this.whole_ob.rotation.y = rot;

        // wings flapping
        if(this.wing_left.rotation.y >= this.wing_max_rotation) {
            this.rotate_direction = -1;
        } else if(this.wing_left.rotation.y <= 0) {
            this.rotate_direction = 1;
        }
        this.wing_left.rotation.y += this.rotate_direction * 0.0075 * delta;
        this.wing_right.rotation.y -= this.rotate_direction * 0.0075 * delta;
    }
}

let spiderCtr = 0;
export class GrSpider extends GrObject {
    constructor(params = {}) {
        let spider = new T.Group();
        let mat_array = [];

        // BODY //
        let body_geom = new T.SphereGeometry(0.35);
        let body_mat = new T.MeshStandardMaterial({ color: "brown" });
        mat_array.push({ object: body_mat, opacity: body_mat.opacity });
        let body = new T.Mesh(body_geom, body_mat);
        spider.add(body);
        body.scale.set(1.25, 0.75, 1);

        let head_geom = new T.SphereGeometry(0.25);
        let head = new T.Mesh(head_geom, body_mat);
        spider.add(head);
        head.position.set(0.45, 0, 0);
        head.scale.set(1, 0.75, 1);

        // LEGS //
        let leg_points = [[0, 0], [0.4, 0.4], [0.8, 0], [0.8, -0.1], [0.4, 0.3], [0, -0.1]];
        let leg_curve = drawShape(leg_points);
        let leg_geom = new T.ExtrudeGeometry(leg_curve, { depth: 0.1, bevelEnabled: false });

        let legs = new T.Group();
        spider.add(legs);
        let legs_arr = [];
        for(let i = -4; i < 5; i++) {
            if(i != 0) {
                let leg = new T.Mesh(leg_geom, body_mat);
                legs.add(leg);
                legs_arr.push({ leg: leg, rotate_direction: 1});

                let x = Math.abs(i*0.2) - (i < 0 ? 0.5 : 0.4);
                leg.position.set(x, 0.1, -0.4);

                let angle = (Math.random() * Math.PI/2) + Math.PI;
                leg.rotateX(i < 0 ? -angle : angle);
                leg.rotateY(i < 0 ? Math.PI/2 : 3*Math.PI/2);
            }
        }
        legs.position.set(0, 0, 0.4);

        // SHADOW //
        let shadow = createShadow(0.5);
        spider.add(shadow);
        mat_array.push({ object: shadow.material, opacity: shadow.material.opacity });
        shadow.position.set(0.1, 0.3, 0);

        super(`Spider-${spiderCtr++}`, spider);
        this.whole_ob = spider;
        this.material_array = mat_array;
        this.legs = legs_arr;

        this.x = params.x ? Number(params.x) : 0;
        this.y = params.y ? Number(params.y) : 0;
        this.z = params.z ? Number(params.z) : 0;
        this.angle = 0;
        this.max_rotation = Math.PI/4;
        
        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
        this.scare = params.scare ? Boolean(params.scare) : false;
        this.covered = true;
        this.fleeing = false;
        this.time_flee = 0;
    }

    capture() {
        this.captured = true;
        this.y = 7;
    }

    stepWorld(delta, timeOfDay) {
        // movement path
        this.angle += delta/1000;
        let x = this.x + 2*Math.cos(this.angle);
        let y = this.y + 2*Math.sin(this.angle);
        this.whole_ob.position.set(-x, -y, this.whole_ob.position.z);
        
        let rot_z = Math.atan2(2*Math.cos(this.angle), 2*Math.sin(this.angle));
        this.whole_ob.rotation.set(0, 0, -rot_z);

        // legs
        this.legs.forEach(obj => {
            let leg_angle = obj.leg.rotation.x;
            if(leg_angle >= Math.PI + this.max_rotation) {
                obj.rotate_direction = -1;
            } else if(leg_angle <= Math.PI - this.max_rotation) {
                obj.rotate_direction = 1;
            }
            obj.leg.rotation.x += obj.rotate_direction * 0.0075 * delta;
        });
    }
}

let waterBugCtr = 0;
export class GrWaterBug extends GrObject {
    constructor(params = {}) {
        let water_bug = new T.Group();
        let mat_array = [];
        let tl = new T.TextureLoader();

        // BODY //
        let body_geom = new T.SphereGeometry(0.45);
        let body_map = tl.load("../textures/water_bug.png");
        body_map.wrapT = T.RepeatWrapping;
        body_map.wrapS = T.RepeatWrapping;

        let body_mat = new T.MeshStandardMaterial({ color: 0xae6d2f, map: body_map });
        let body = new T.Mesh(body_geom, body_mat);
        water_bug.add(body);
        body.scale.set(1.5, 0.5, 1);

        let leg_geom = new T.BoxGeometry(0.1, 0.1, 0.5);

        let left_leg = [];
        let right_leg = [];
        for(let i = -2; i < 3; i++) {
            if(i != 0) {
                let leg = new T.Mesh(leg_geom, body_mat);
                water_bug.add(leg);
                leg.position.set(Math.abs(i*0.2)-0.3, 0, i < 0 ? -0.5 : 0.5);

                if(i < 0) {
                    left_leg.push(leg);
                } else {
                    right_leg.push(leg);
                }
            }
        }

        let antenna_geom = new T.BoxGeometry(0.5, 0.05, 0.05);
        let ant = new T.Mesh(antenna_geom, body_mat);
        water_bug.add(ant);
        ant.position.set(0.75, 0, -0.1);
        ant.rotateY(Math.PI/5);
        let ant2 = new T.Mesh(antenna_geom, body_mat);
        water_bug.add(ant2);
        ant2.position.set(0.75, 0, 0.1);
        ant2.rotateY(-Math.PI/5);

        super(`WaterBug-${waterBugCtr++}`, water_bug);
        this.whole_ob = water_bug;
        this.material_array = mat_array;
        this.legs_left = left_leg;
        this.legs_right = right_leg;

        this.x = params.x ? Number(params.x) : 0;
        this.y = params.y ? Number(params.y) : 0;
        this.z = params.z ? Number(params.z) : 0;
        this.angle = [ params.rot_x ? Number(params.rot_x) : 0,
            params.rot_y ? Number(params.rot_y) : 0,
            params.rot_z ? Number(params.rot_z) : 0 ];
        this.angle = 0;
        this.rotate_direction = 1;
        this.max_rotation = Math.PI/4;
        
        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.x = this.angle[0];
        this.whole_ob.rotation.y = this.angle[1];
        this.whole_ob.rotation.z = this.angle[2];
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
        this.scare = params.scare ? Boolean(params.scare) : false;
        this.covered = true;
        this.fleeing = false;
        this.time_flee = 0;
    }

    capture() {
        this.captured = true;
        this.y = -5;
    }

    stepWorld(delta, timeOfDay) {
        this.angle += delta/1000;
        let x = this.x + 2*Math.sin(this.angle);
        let y = this.y + Math.sin(this.angle);
        let z = this.z + 0.5*Math.cos(this.angle);
        this.whole_ob.position.set(x, y, z);
        this.whole_ob.rotation.set(0, Math.atan2(0.5*Math.sin(this.angle), 2*Math.cos(this.angle)), 0.5*Math.cos(this.angle));

        // leg animation
        if(this.legs_left[0].rotation.y >= this.max_rotation) {
            this.rotate_direction = -1;
        } else if(this.legs_left[0].rotation.y <= -this.max_rotation) {
            this.rotate_direction = 1;
        }

        this.legs_left.forEach(leg => leg.rotation.y += this.rotate_direction * 0.002 * delta);
        this.legs_right.forEach(leg => leg.rotation.y -= this.rotate_direction * 0.002 * delta);
    }
}

let mothCtr = 0;
export class GrMoth extends GrObject {
    constructor(params = {}) {
        let moth = new T.Group();
        let mat_array = [];
        let tl = new T.TextureLoader();

        // BODY //
        let body_geom = new T.SphereGeometry(0.25);
        let body_mat = new T.MeshStandardMaterial({ color: "brown", transparent: true });
        mat_array.push({ object: body_mat, opacity: body_mat.opacity });
        let body = new T.Mesh(body_geom, body_mat);
        moth.add(body);
        body.scale.set(0.75, 1.25, 1);
        body.position.set(0, 0.1, 0);

        // WINGS //
        let wings = new T.Group();
        moth.add(wings);
        // geom
        let wing_points = [[3.55, 1.62], [3.45, 1.10], [3.25, 1.00], [2.89, .86], [2.44, .84], [2.25, 1.00], [2.25, 1.17], [2.40, 1.30],
            [2.67, 1.53], [2.85, 1.67], [2.96, 1.67], [2.89, 1.77], [2.89, 1.99], [3.13, 2.21], [3.32, 2.21], [3.47, 2.08]];
        let wing_curve = drawShape(wing_points);
        let wing_geom = new T.ExtrudeGeometry(wing_curve, { depth: 0.05, bevelEnabled: false });
        
        let wing_map = tl.load("../textures/moth.png");
        wing_map.wrapT = T.RepeatWrapping;
        wing_map.wrapS = T.RepeatWrapping;
        let wing_mat = new T.MeshStandardMaterial({ color: 0xe1c19e, map: wing_map, transparent: true });
        mat_array.push({ object: wing_mat, opacity: wing_mat.opacity });
        
        let wing1 = new T.Mesh(wing_geom, wing_mat);
        wings.add(wing1);
        wing1.position.set(0.01, 0, -0.02);
        let wing2 = new T.Mesh(wing_geom, wing_mat);
        wings.add(wing2);
        wing2.rotateY(Math.PI);
        wing2.position.set(-0.01, 0, 0.02);
        wings.rotateZ(Math.PI);

        // SHADOW //
        let shadow = createShadow(0.65);
        moth.add(shadow);
        mat_array.push({ object: shadow.material, opacity: shadow.material.opacity });
        shadow.position.set(0, 0.1, 0);
        shadow.rotateX(Math.PI/2);
        
        super(`Moth-${mothCtr++}`, moth);
        this.whole_ob = moth;
        this.wing_left = wing1;
        this.wing_right = wing2;
        this.material_array = mat_array;

        this.x = params.x ? Number(params.x) : 0;
        this.y = params.y ? Number(params.y) : 0;
        this.z = params.z ? Number(params.z) : 0;
        this.angle = 0;
        this.rotate_direction = 1;
        this.wing_max_rotation = Math.PI/8;
        this.time = 0;
        
        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.x = params.rot_x ? Number(params.rot_x) : -Math.PI/2;
        this.whole_ob.rotation.y = params.rot_y ? Number(params.rot_y) : 0;
        this.whole_ob.rotation.z = params.rot_z ? Number(params.rot_z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
        this.scare = params.scare ? Boolean(params.scare) : false;
        this.covered = true;
        this.fleeing = false;
        this.time_flee = 0;
    }

    capture() {
        this.captured = true;
        this.whole_ob.position.set(0, -5, 0);
    }

    stepWorld(delta, timeOfDay) {
        // wings flapping
        if(this.wing_left.rotation.y >= Math.PI/4 + this.wing_max_rotation) {
            this.rotate_direction = -1;
        } else if(this.wing_left.rotation.y <= Math.PI/4 -this.wing_max_rotation) {
            this.rotate_direction = 1;
        }
        if(Math.random() < 0.01) {
            this.rotate_direction = -this.rotate_direction;
        }

        this.wing_left.rotation.y += this.rotate_direction * 0.0005 * delta;
        this.wing_right.rotation.y += this.rotate_direction * 0.0005 * delta;

        if(this.fleeing) {
            if(this.covered) {
                this.time += delta/1000;
            }
            if(this.time > 3) {
                this.fleeing = false;
                this.time = 0;
                restoreOpacity(this.material_array);
            } else {
                // this.whole_ob.position.z -= 0.01;
                clearOpacity(this.material_array);
            }
        }
    }
}

let fireflyCtr = 0;
export class GrFirefly extends GrObject {
    constructor(params = {}) {
        let firefly = new T.Group();
        let mat_array = [];

        let light = new T.PointLight("yellow", 1, 1);
        firefly.add(light);
        // let helper = new T.PointLightHelper(light, 1);
        // firefly.add(helper);

        super(`Firefly-${fireflyCtr++}`, firefly);
        this.whole_ob = firefly;
        this.light = light;
        this.material_array = mat_array;
        this.flicker = false;
        this.flicker_dir = -1;

        this.x = params.x ? Number(params.x) : 0;
        this.y = params.y ? Number(params.y) : 0;
        this.z = params.z ? Number(params.z) : 0;
        this.time = 0;
        this.x_dir = 1;
        this.y_dir = 1;
        this.x_prev = 1;
        this.y_prev = 1;
        
        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);

        // custom params
        this.captured = false;
        this.scare = params.scare ? Boolean(params.scare) : false;
        this.covered = true;
        this.fleeing = false;
        this.time_flee = 0;
    }

    capture() {
        this.captured = true;
        this.whole_ob.position.set(0, -5, 0);
    }

    stepWorld(delta, timeOfDay) {
        this.time += delta/1000;

        let x = this.whole_ob.position.x;
        let y = this.whole_ob.position.z;
        let dist = Math.sqrt((x-this.x)*(x-this.x) + (y-this.z)*(y-this.z)); // distance from center of the rock the snail is on

        // adjust x and y velocity randomly or if outside circle radius
        if(Math.random() < 0.1) {
            this.time = 0;
            this.x_prev = this.x_dir;
            this.y_prev = this.y_dir;

            this.x_dir += Math.random() - 0.5;
            this.y_dir += Math.random() - 0.5;
            let mag = Math.sqrt(Math.pow(this.x_dir, 2) + Math.pow(this.y_dir, 2));

            this.x_dir = this.x_dir / mag;
            this.y_dir = this.y_dir / mag;
        }
        if(dist > 1) {
            this.flipping = true;
            this.time = 0;
            this.x_dir = -this.x_dir;
            this.y_dir = -this.y_dir;
        }

        this.whole_ob.position.x += this.x_dir * 0.005;
        this.whole_ob.position.z += this.y_dir * 0.005;

        if(Math.random() < 0.01) {
            this.flicker = true;
        }

        if(this.flicker) {
            this.light.intensity += this.flicker_dir * 0.01;

            if(this.light.intensity <= 0.25) {
                this.flicker_dir = 1;
            } else if (this.light.intensity >= 1 && this.flicker_dir === 1) {
                this.flicker_dir = -1;
                this.flicker = false;
            }
        }
    }
}