import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

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
        let shadow_mat = new T.MeshStandardMaterial({ color: "black", transparent: true, opacity: 0.5 });
        let shadow = new T.Mesh(shadow_geom, shadow_mat);
        net.add(shadow);
        shadow.position.set(0, -params.y+2, -1)

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

        let bark_mat = new T.MeshStandardMaterial({ color: "brown" });
        mat_array.push({ object: bark_mat, opacity: bark_mat.opacity});

        let bark = new T.Mesh(bark_geom, bark_mat);
        log.add(bark);

        // RINGS //
        let rings_geom = new T.CylinderGeometry(1.4, 1.4, 6.5);
        let rings_mat = new T.MeshStandardMaterial({ color: 0xcc8b4e });
        mat_array.push({ object: rings_mat, opacity: rings_mat.opacity });

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
}

let rockBigCtr = 0;
export class GrRockBig extends GrObject {
    constructor(params = {}) {
        let rock = new T.Group();
        let mat_array = [];

        let r_geom = new T.TetrahedronGeometry(2.5, 1);
        let r_mat = new T.MeshStandardMaterial({ color: "gray" });
        mat_array.push({ object: r_mat, opacity: r_mat.opacity });
        let r = new T.Mesh(r_geom, r_mat);
        rock.add(r);

        super(`RockBig-${rockBigCtr++}`, rock);
        this.whole_ob = rock;
        this.material_array = mat_array;
        this.moved = false;
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
}