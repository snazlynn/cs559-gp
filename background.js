import * as T from "./libs/CS559-Three/build/three.module.js";
import { GrObject } from "./libs/CS559-Framework/GrObject.js";

/**
 * makes all materials in mat_array invisible
 * @param {*} mat_array 
 */
function clearOpacity(mat_array) {
    mat_array.forEach(mat => {
        mat.opacity = 0;
    });
}

let groundCtr = 0;
export class GrGround extends GrObject{
    constructor(params = {}) {
        let ground_geom = new T.BoxGeometry(20, 0.25, 20);
        let ground_mat = new T.MeshStandardMaterial({ color: 0x4f9f33 });
        let ground = new T.Mesh(ground_geom, ground_mat);

        super(`Ground-${groundCtr++}`, ground);
        this.whole_ob = ground;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }
}

let netCtr = 0;
export class GrNet extends GrObject{
    constructor(params = {}) {
        let net = new T.Group();

        // MESH //
        let mesh_geom = new T.CylinderGeometry(0.75, 1.25, 2);
        let mesh_mat = new T.MeshStandardMaterial({ color: "white", transparent: true, opacity: 0.5 });
        let mesh = new T.Mesh(mesh_geom, mesh_mat);
        net.add(mesh);
        mesh.position.set(0, 0, -1);

        // FRAME //
        let frame_geom = new T.TorusGeometry(1.25, 0.075);
        let frame_mat = new T.MeshStandardMaterial({ color: "brown" });
        let frame = new T.Mesh(frame_geom, frame_mat);
        mesh.add(frame);
        frame.rotateX(Math.PI/2);
        frame.position.set(0, -1, 0);

        let handle_geom = new T.CylinderGeometry(0.075, 0.075, 5);
        let handle = new T.Mesh(handle_geom, frame_mat);
        frame.add(handle);
        handle.position.set(0, 3.75, 0);

        mesh.rotateX(Math.PI/4 - 0.001); // preventing the catch bug animation from stopping prematurely on first mouse click

        let shadow_geom = new T.CylinderGeometry(1.25, 1.25, 0.01);
        let shadow_mat = new T.MeshStandardMaterial({ color: 0x100e5d, transparent: true, opacity: 0.5 });
        let shadow = new T.Mesh(shadow_geom, shadow_mat);
        net.add(shadow);
        shadow.position.set(0, -params.y+3, -1)

        super(`Net-${netCtr++}`, net);
        this.whole_ob = net;
        this.mesh = mesh;
        this.shadow = shadow;
        this.radius = 1;

        this.catching = false;
        this.max_rotation = Math.PI/4;
        this.rotate_direction = -1;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }

    catchBug() {
        this.catching = true;
    }

    stepWorld(delta, timeOfDay) {
        if(this.catching) {
            if(this.mesh.rotation.x <= -this.max_rotation) {
                this.rotate_direction = 1;
            } else if(this.mesh.rotation.x >= this.max_rotation) {
                this.rotate_direction = -1;
                this.mesh.rotation.x -= 0.001;
                this.catching = false;
            }
            this.mesh.rotation.x += this.rotate_direction * 0.0075 * delta;
        }
    }
}

let logCtr = 0;
export class GrLog extends GrObject {
    constructor(params = {}) {
        let log = new T.Group();
        let mat_array = [];

        // BARK //
        let bark_curve = new T.Shape();
        bark_curve.moveTo(0, 0);
        bark_curve.absarc(0, 0, 1.6);
        let hole_curve = new T.Path();
        hole_curve.moveTo(0, 0);
        hole_curve.absarc(0, 0, 1.4);
        bark_curve.holes.push(hole_curve);
        let bark_geom = new T.ExtrudeGeometry(bark_curve, { depth: 7, bevelEnabled: false });

        let bark_mat = new T.MeshStandardMaterial({ color: "brown", transparent: true });
        mat_array.push(bark_mat);

        let bark = new T.Mesh(bark_geom, bark_mat);
        log.add(bark);

        // RINGS //
        let rings_geom = new T.CylinderGeometry(1.4, 1.4, 6.5);
        let rings_mat = new T.MeshStandardMaterial({ color: 0xcc8b4e, transparent: true });
        mat_array.push(rings_mat);

        let rings = new T.Mesh(rings_geom, rings_mat);
        log.add(rings);
        rings.rotateX(Math.PI/2);
        rings.position.set(0, 0, 3.5);

        super(`Log-${logCtr++}`, log);
        this.whole_ob = log;
        this.material_array = mat_array;
        this.moved = false;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.x = params.rot_x ? Number(params.rot_x) : 0;
        this.whole_ob.rotation.y = params.rot_y ? Number(params.rot_y) : 0;
        this.whole_ob.rotation.z = params.rot_z ? Number(params.rot_z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }

    clear() {
        clearOpacity(this.material_array);
    }

    move() {
        if(this.moved) {
            this.whole_ob.rotation.y += Math.PI/4;
            this.moved = false;
        } else {
            this.whole_ob.rotation.y -= Math.PI/4;
            this.moved = true;
        }
    }
}

let rockBigCtr = 0;
export class GrRockBig extends GrObject {
    constructor(params = {}) {
        let rock = new T.Group();
        let mat_array = [];

        let geom = new T.TetrahedronGeometry(2.5, 1);
        let mat = new T.MeshStandardMaterial({ color: "gray", transparent: true });
        mat_array.push(mat);
        let r = new T.Mesh(geom, mat);
        rock.add(r);
        r.position.set(0, 0, -3);

        super(`RockBig-${rockBigCtr++}`, rock);
        this.whole_ob = rock;
        this.moved = false;
        this.material_array = mat_array;
        this.angle = [ params.rot_x ? Number(params.rot_x) : 0,
            params.rot_y ? Number(params.rot_y) : 0,
            params.rot_z ? Number(params.rot_z) : 0 ];

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.x = this.angle[0];
        this.whole_ob.rotation.y = this.angle[1];
        this.whole_ob.rotation.z = this.angle[2];
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }

    clear() {
        clearOpacity(this.material_array);
    }

    move() {
        if(this.moved) {
            this.whole_ob.rotation.y -= Math.PI/4;
            this.moved = false;
        } else {
            this.whole_ob.rotation.y += Math.PI/4;
            this.moved = true;
        }
    }
}

let flowerCtr = 0;
export class GrFlower extends GrObject {
    constructor(params = {}) {
        let flower = new T.Group();
        let mat_array = [];
        
        let center_geom = new T.CylinderGeometry(0.25, 0.25, 0.1);
        let center_mat = new T.MeshStandardMaterial({ color: "yellow", transparent: true });
        mat_array.push(center_mat);
        let center = new T.Mesh(center_geom, center_mat);
        flower.add(center);

        let petal_geom = new T.CylinderGeometry(0.25, 0.25, 0.09);
        let petal_mat = new T.MeshStandardMaterial({ color: params.color ? String(params.color) : "white", transparent: true });
        mat_array.push(petal_mat);
        let radius = 0.4;
        for(let i = 0; i < 5; i++) {
            let petal = new T.Mesh(petal_geom, petal_mat);
            flower.add(petal);
            let angle = (2 * Math.PI) * (i / 5);
            petal.position.set(radius*Math.sin(angle), 0, radius*Math.cos(angle));
        }
        
        super(`Flower-${flowerCtr++}`, flower);
        this.whole_ob = flower;
        this.moved = false;
        this.material_array = mat_array;
        this.angle = [ params.rot_x ? Number(params.rot_x) : 0,
            params.rot_y ? Number(params.rot_y) : 0,
            params.rot_z ? Number(params.rot_z) : 0 ];

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.x = this.angle[0];
        this.whole_ob.rotation.y = this.angle[1];
        this.whole_ob.rotation.z = this.angle[2];
        let scale = params.size ? Number(params.size) : 1;
        flower.scale.set(scale, scale, scale);
    }

    clear() {
        clearOpacity(this.material_array);
    }
}

let fPOneCtr = 0;
export class GrFlowerPatchOne extends GrObject {
    constructor(params = {}) {
        let patch = new T.Group();
        let mat_array = [];
        
        let f1 = new GrFlower({ y: 0.1, color: "pink" });
        patch.add(f1.objects[0]);
        // console.log(f1.material_array);
        f1.material_array.forEach(mat => mat_array.push(mat));
        let f2 = new GrFlower({ x: -1, y: 0.1, z: 0.5 });
        patch.add(f2.objects[0]);
        f2.material_array.forEach(mat => mat_array.push(mat));
        let f3 = new GrFlower({ x: 0.7, y: 0.2, z: 0.5, color: "lightBlue" });
        patch.add(f3.objects[0]);
        f3.material_array.forEach(mat => mat_array.push(mat));
        let f4 = new GrFlower({ x: 0.9, z: -0.5, size: 0.9 });
        patch.add(f4.objects[0]);
        f4.material_array.forEach(mat => mat_array.push(mat));
        let f5 = new GrFlower({ x: -0.8, z: -0.3, color: "lightBlue", size: 0.7 }); 
        patch.add(f5.objects[0]);
        f5.material_array.forEach(mat => mat_array.push(mat));
        let f6 = new GrFlower({ x: -2, z: -1, color: "pink", size: 0.6 }); 
        patch.add(f6.objects[0]);
        f6.material_array.forEach(mat => mat_array.push(mat));
        let f7 = new GrFlower({ x: -0.5, z: 2, color: "lightBlue", size: 0.8 }); 
        patch.add(f7.objects[0]);
        f7.material_array.forEach(mat => mat_array.push(mat));
        let f8 = new GrFlower({ x: 2, size: 0.5 }); 
        patch.add(f8.objects[0]);
        f8.material_array.forEach(mat => mat_array.push(mat));
        let f9 = new GrFlower({ z: -1, color: "lightBlue", size: 0.5 }); 
        patch.add(f9.objects[0]);
        f9.material_array.forEach(mat => mat_array.push(mat));

        super(`FlowerPatchOne-${fPOneCtr++}`, patch);
        this.whole_ob = patch;
        this.moved = false;
        this.material_array = mat_array;
        this.angle = params.angle ?
            [ Number(params.angle[0]), Number(params.angle[1]), Number(params.angle[2])] :
            [0, 0, 0];

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.x = this.angle[0];
        this.whole_ob.rotation.y = this.angle[1];
        this.whole_ob.rotation.z = this.angle[2];
        let scale = params.size ? Number(params.size) : 1;
        patch.scale.set(scale, scale, scale);
    }

    clear() {
        clearOpacity(this.material_array);
    }
}

let pondCtr = 0;
export class GrPond extends GrObject {
    constructor(params = {}) {
        let geom = new T.CylinderGeometry(7, 7, 0.1);
        let mat = new T.MeshStandardMaterial({ color: "blue", roughness: 0.5, metalness: 0.7 });
        let pond = new T.Mesh(geom, mat);

        super(`Pond-${pondCtr++}`, pond);
        this.whole_ob = pond;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }
}

let lightCtr = 0;
export class GrLight extends GrObject {
    constructor(params = {}) {
        let light = new T.DirectionalLight(0xfff4c8, 1);

        super(`Light-${lightCtr++}`, light);
        this.whole_ob = light;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }

    turnOff() {
        this.whole_ob.intensity = 0;
    }

    turnOn() {
        this.whole_ob.intensity = 1;
    }
}