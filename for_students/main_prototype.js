/*jshint esversion: 6 */
// @ts-check

/**
 * bug catching game - main file
 */
import * as T from "../libs/CS559-Three/build/three.module.js"; 
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrButterfly, GrSnail, GrCicada, GrBeetle, GrBee, GrSpider, GrWaterBug, GrMoth, GrFirefly } from "./insects_prototype.js";
import { GrGround, GrNet, GrLog, GrRockBig, GrFlowerPatchOne, GrLight, GrPond } from "./background.js";
import { GrNetMechanicUI, GrLOneDoneCtr, GrFleeMechanicUI, GrLTwoDoneCtr, GrLThreeDoneCtr } from "./ui_overlay.js";

// CREATING OBJECTS //

// WORLD //
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplane: false,
    lightBrightness: 0.05
});

let ground = new GrGround({ y: -0.25 });
world.add(ground);
let light = new GrLight({ y: 10 });
world.add(light);

// camera
let cam = world.camera;
cam.position.set(0, 14, 0);
world.orbitControlOff();

// UI //
let uiEnabled = true;
let netMech = new GrNetMechanicUI({ y: 7 });
let l1Done = new GrLOneDoneCtr({ y: 7 });
let fleeMech = new GrFleeMechanicUI({ y: 7 });
let l2Done = new GrLTwoDoneCtr({ y: 7 });
let l3Done = new GrLThreeDoneCtr({ y: 7 });

let curUI = 0; // displays UI in order
let allUI = [netMech, l1Done, fleeMech, l2Done, l3Done];

// NET //
let netActivated = false;
let useNet = true;
let idlePos = [4, 5, 2.5];

let net = new GrNet({ x: idlePos[0], y: idlePos[1], z: idlePos[2] });
net.shadow.material.opacity = document.getElementById("shadow")?.checked ? 0.5 : 0; // sets to shadow toggle on load
world.add(net);

// LEVEL ONE //
let level_one_insects = [
    new GrButterfly({ x: -3, y: 1, z: 2, color: "blue" }),
    new GrSnail({ x: -3, y: 2.25, z: 2, color: "yellow" }),
    new GrCicada({ x: -3, y: 3, z: -3 }),
    new GrBeetle({ x: 1, y: 0.5, move: "eight", color: "green" })
];
let level_one_background = [
    new GrLog({ x: -8, y: 1, z: -6, rot_y: Math.PI/3 }),
    new GrRockBig({ x: 0, z: 3, rot_y: Math.PI/2, rot_z: Math.PI/4 }),
    new GrFlowerPatchOne({ x: 4 }),
    new GrFlowerPatchOne({ x: 1, z: -5, angle: [0, Math.PI, 0], size: 0.75 }),
    new GrFlowerPatchOne({ x: -6.5, z: 3, angle: [0, Math.PI/4, 0], size: 0.8 })
];

let level_two_insects = [
    new GrBeetle({ x: 5, y: 0.5, z: -1.5, move: "line", scare: true, color: "black" }),
    new GrSnail({ x: -3.75, y: 0.25, z: -2.75, scare: true, color: "white" }),
    new GrBee({ x: -4, y: 1, z: 2.5}),
    new GrButterfly({ y: 1, z: 1, color: "orange" })
];
let level_two_background = [
    new GrLog({ x: 10, y: 1, z: -2, rot_y: -Math.PI/2 }),
    new GrRockBig({ x: -6.5, z: -3, rot_y: -Math.PI/2 }),
    new GrFlowerPatchOne({ x: -4, z: 0, angle: [0, Math.PI/4, 0], }),
    new GrFlowerPatchOne({ x: 4, angle: [0, Math.PI, 0], size: 0.75 }),
    new GrFlowerPatchOne({ x: 3, z: -4, angle: [0, Math.PI/3, 0], size: 0.75 }),
    new GrFlowerPatchOne({ x: -6.5, z: 3, angle: [0, Math.PI/4, 0], size: 0.8 }),
    new GrFlowerPatchOne({ x: -3.5, z: 3, size: 1.25}),
    new GrRockBig({ x: -0.5, z: 4, rot_y: -Math.PI/4, rot_z: Math.PI/4, size: 0.6 })
];

let captured_firefly = false;
let level_three_insects = [
    new GrSpider({ x: 4, y: -1, z: 3 }),
    new GrWaterBug({ x: -4, y: -0.5, z: -3 }),
    new GrMoth({ x: 4, y: 0.5, z: -3, scare: true }),
    new GrFirefly({ x: -5, y: 0.2 }),
    new GrFirefly({ x: 3, y: 0.2, z: 4 })
];
let level_three_background = [
    new GrPond({ x: -7, z: -7 }),
    new GrLog({ x: 4, y: 1, z: -9 }),
    new GrRockBig({ x: -4, z: 7 }),
    new GrFlowerPatchOne({ x: 2, z: -3, angle: [0, Math.PI/8, 0] }),
    new GrFlowerPatchOne({ x: -6.5, z: 3, angle: [0, Math.PI/4, 0], size: 0.8 }),
    new GrFlowerPatchOne({ x: 5, z: 4, size: 0.75 }),
];

let garden_insects = [
    new GrButterfly({ x: -1, y: 1, z: -3.5, color: "blue" }),
    new GrSnail({ x: 5, y: 1, z: -4, color: "white" }),
    new GrCicada({ x: -5.5, y: 3, z: 1, rot_z: -Math.PI/4 }),
    new GrBeetle({ x: 1, y: 0.5, move: "eight", color: "green" }),
    new GrBee({ x: 4, y: 1, z: 2.5}),
    new GrSpider({ x: -2.5, y: -1, z: -2.5 }),
    new GrWaterBug({ x: -3, y: -0.5, z: -3, angle: [0, Math.PI, 0] }),
    new GrMoth({ x: -4, y: 2, z: 3.25, rot_x: -Math.PI/4, rot_y: Math.PI/8 }),
    new GrFirefly({ x: -5, y: 0.2, z: -0.5 })
];
let garden_background = [
    new GrLog({ x: -3, y: 1, z: 1, rot_y: -Math.PI/3 }),
    new GrPond({ x: -6, z: -8 }),
    new GrRockBig({ x: 6, z: -2, rot_y: Math.PI/2, rot_z: Math.PI/4 }),
    new GrFlowerPatchOne({ x: -4, z: 0.5, angle: [0, Math.PI/4, 0], }),
    new GrFlowerPatchOne({ x: 1.5, angle: [0, Math.PI, 0], size: 0.8 }),
    new GrFlowerPatchOne({ x: -3.5, z: 3, size: 1.25}),
    new GrFlowerPatchOne({ x: 5, z: 4, angle: [0, Math.PI/4, 0] }),
    new GrFlowerPatchOne({ x: 5, z: -4, size: 0.75 }),
];

// currently visible items
let captured = 0;

world.add(allUI[curUI]);
let cur_level = 1;
let all_insects = [level_one_insects, level_two_insects, level_three_insects, garden_insects];
let all_backgrounds = [level_one_background, level_two_background, level_three_background, garden_background];

///////////////////////////////////////////////////////////////

// UI INTERACTION //
window.addEventListener('keypress', (event) => { // toggling UI
    // net
    if(event.key === "e" && !uiEnabled) {
        if(netActivated) {
            net.whole_ob.position.set(idlePos[0], idlePos[1], idlePos[2])
        }
        netActivated = !netActivated;
    }

    // ui controls
    if(uiEnabled) {
        if(event.key === "q" && useNet) { // disabling UI
            allUI[curUI].disableUI();
            curUI++;
            uiEnabled = false;

            if(captured === 4) {
                all_backgrounds[cur_level].forEach(obj => obj.whole_ob.position.set(0, -5, 0));
                cur_level++;
                captured = 0;

                if(cur_level === 1) { // extra mechanic UI
                    world.add(allUI[curUI]);
                    uiEnabled = true;
                }
                if(cur_level === 2) { // adjusting lighting
                    light.turnOff();
                }
                if(cur_level === 3) {
                    all_insects[2].forEach(insect => insect.capture());
                    net.whole_ob.position.y = -5
                    useNet = false;
                }
            
                all_insects[cur_level].forEach(insect => world.add(insect));
                all_backgrounds[cur_level].forEach(obj => world.add(obj));
            }
        }
    }
});

// html toggles
document.getElementById("shadow")?.addEventListener('change', (event) => {
    let shadow = document.getElementById("shadow")?.checked;
    if(shadow) {
        net.shadow.material.opacity = 0.5;
    } else {
        net.shadow.material.opacity = 0;
    }
});

let timestamp = 0;
let prev_x = 0;
let prev_y = 0;
// GAME INTERACTION //
window.addEventListener('mousemove', (event) => { // moving net
    // console.log(event.clientX, event.clientY);
    if(netActivated) {
        net.whole_ob.position.x = -8 + (17 * event.clientX) / (window.innerWidth);
        net.whole_ob.position.z = -3 + (9 * event.clientY) / (window.innerHeight);

        if(cur_level > 0) {
            all_insects[cur_level].forEach(insect => {
                if(insect.scare && !insect.covered) { // checking net speed if near scareable insect
                    if(timestamp) {
                        let now = Date.now();
                        let dt = now - timestamp;
                        let dx = event.clientX - prev_x;
                        let dy = event.clientY - prev_y;

                        let speed_x = dt != 0 ? Math.round(dx/dt*100) : 0;
                        let speed_y = dt != 0 ? Math.round(dy/dt*100) : 0;
                        let mag = Math.sqrt(speed_x*speed_x + speed_y*speed_y);

                        let net_x = net.whole_ob.position.x;
                        let net_z = net.whole_ob.position.z;
                        let ins_x = insect.whole_ob.position.x;
                        let ins_z = insect.whole_ob.position.z;
                        let dist = Math.sqrt((net_x - ins_x)*(net_x - ins_x) + (net_z - ins_z)*(net_z - ins_z));

                        if(mag > 150 && dist < 5) {
                            insect.fleeing = true;
                        }
                    }

                    timestamp = Date.now();
                    prev_x = event.clientX;
                    prev_y = event.clientY;
                }
            })
        }
    }
});
window.addEventListener('mousedown', (event) => { // catching bugs
    if(netActivated) {
        net.catchBug();
        all_insects[cur_level].forEach(insect => {
            let ins_x = insect.whole_ob.position.z;
            let ins_y = insect.whole_ob.position.x;
            let net_x = net.whole_ob.position.z - 1;
            let net_y = net.whole_ob.position.x;
            
            if(!insect.captured && !insect.flee) { // if not captured or fleeing
                if( ins_x > net_x - net.radius && ins_x < net_x + net.radius &&
                ins_y > net_y - net.radius && ins_y < net_y + net.radius ) { // capture if within radius
                    if(!(captured_firefly && insect.name.includes("Firefly"))) { // if not catching a duplicate firefly
                        insect.capture();
                        captured++;
                        if(insect.name.includes("Firefly")) {
                            captured_firefly = true;
                        }
                    }
                } else if(insect.scare && !insect.covered && ins_x > net_x - 3*net.radius && ins_x < net_x + 3*net.radius &&
                    ins_y > net_y - 3*net.radius && ins_y < net_y + 3*net.radius) { // else if w/in bigger radius + able to be scared, will flee
                        insect.fleeing = true;
                }
                
            }
        });

        if(captured === 4) {
            setTimeout(() => { // waiting for net animation to finish
                netActivated = false;
                net.whole_ob.position.set(idlePos[0], idlePos[1], idlePos[2])
                uiEnabled = true;
                world.add(allUI[curUI]);
                if(cur_level === 2) {
                    light.turnOn();
                }
            }, 1000);
        }
    } else if(!uiEnabled && cur_level > 0) { // move object
        let x = event.clientX;
        let y = event.clientY;
        if(cur_level === 1) {
            if(x > 960 && x < 1170 && y > 10 && y < 400) { // move log
                level_two_insects[0].covered = !level_two_insects[0].covered;
                level_two_background[0].move();
            } else if(x > 470 && x < 710 && y > 10 && y < 400) { // move big rock
                level_two_insects[1].covered = !level_two_insects[1].covered;
                level_two_background[1].move();
            } else if(x > 700 && x < 850 && y > 320 && y < 450) { // small rock
                level_two_background[7].move();
            }
        } else if(cur_level === 2) {
            if(x > 625 && x < 1175 && y > 10 && y < 330) {
                level_three_insects[2].covered = !level_three_insects[2].covered;
                level_three_background[1].move();
            }
        }
    }
});

all_insects[cur_level].forEach(insect => world.add(insect));
all_backgrounds[cur_level].forEach(obj => world.add(obj));


///////////////////////////////////////////////////////////////
// @ts-ignore       // we're sticking a new thing into the world
// now make it go!
world.go();


// CS559 2025 Workbook
