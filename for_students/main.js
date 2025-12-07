/*jshint esversion: 6 */
// @ts-check

/**
 * bug catching game - main file
 */
import * as T from "../libs/CS559-Three/build/three.module.js"; 
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrButterfly, GrSnail } from "./insects.js";
import { GrNet, GrLog, GrRockBig } from "./background.js";
import { GrNetMechanicUI } from "./ui_overlay.js";

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 10,
    lightBrightness: 1
});

let cam = world.camera;
cam.position.set(0, 14, 0);
// world.orbitControlOff();

// UI //
let uiEnabled = false;
let netMech = new GrNetMechanicUI({ y: 7 });
// LEVEL ONE //
let level_one_insects = [
    new GrButterfly({ x: -3, y: 1, z: 2 }),
    new GrSnail({ x: -3, y: 2.25, z: 2 })
];
let level_one_background = [
    new GrLog({ x: -8, y: 1, z: -6, rot_y: Math.PI/3 }),
    new GrRockBig({ x: -3, z: 3, rot_y: Math.PI/2, rot_z: Math.PI/4 }),
];

// currently visible items
// world.add(netMech);
let curUI = netMech;
let cur_insects = [...level_one_insects];
let cur_background = [...level_one_background];

///////////////////////////////////////////////////////////////

// NET CONTROLS //
let netActivated = false;
let idlePos = [4, 5, 2.5];

let net = new GrNet({ x: idlePos[0], y: idlePos[1], z: idlePos[2] });
world.add(net);

window.addEventListener('keypress', (event) => {
    // net
    if(event.key === "e" && !uiEnabled) {
        if(netActivated) {
            net.whole_ob.position.set(idlePos[0], idlePos[1], idlePos[2])
        }
        netActivated = !netActivated;
    }

    // ui controls
    if(uiEnabled && event.key === "q") {
        curUI.disableUI();
    }
});
window.addEventListener('mousemove', (event) => {
    if(netActivated) {
        net.whole_ob.position.x = -5 + (10 * event.clientX) / (window.innerWidth);
        net.whole_ob.position.z = -1.5 + (7 * event.clientY) / (window.innerHeight);
    }
});
window.addEventListener('mousedown', (event) => {
    if(netActivated) {
        net.catchBug();
        cur_insects.forEach(insect => {
            let ins_x = insect.whole_ob.position.z;
            let ins_y = insect.whole_ob.position.x;
            let net_x = net.whole_ob.position.z - 1;
            let net_y = net.whole_ob.position.x;
            console.log("ins x", ins_x);
            console.log("ins y", ins_y);
            console.log("net x", net_x - net.radius, net_x, net_x + net.radius);
            console.log("net y", net_y - net.radius, net_y, net_y + net.radius);
            if(ins_x > net_x - net.radius && ins_x < net_x + net.radius &&
                ins_y > net_y - net.radius && ins_y < net_y + net.radius) {
                insect.capture();
                cur_insects = cur_insects.filter(i => i != insect);
                console.log(cur_insects);
            }
        });
    }
});

cur_insects.forEach(insect => world.add(insect));
cur_background.forEach(obj => world.add(obj));


///////////////////////////////////////////////////////////////
// @ts-ignore       // we're sticking a new thing into the world
// now make it go!
world.go();


// CS559 2025 Workbook
