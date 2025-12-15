import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { FontLoader } from "../libs/CS559-Three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../libs/CS559-Three/examples/jsm/geometries/TextGeometry.js";
import { GrButterfly, GrSnail, GrCicada, GrBeetle } from "./insects_prototype.js";

let prototype = document.getElementById("prototype") ? true : false;
const bold_path = './libs/CS559-Three/examples/jsm/fonts/helvetiker_bold.typeface.json';
const reg_path = './libs/CS559-Three/examples/jsm/fonts/helvetiker_regular.typeface.json';
const ital_path = './libs/CS559-Three/examples/jsm/fonts/helvetiker_italic.typeface.json';

/**
 * makes all materials in mat_array invisible
 * @param {*} mat_array 
 */
function clearOpacity(mat_array) {
    mat_array.forEach(mat => {
        mat.opacity = 0;
    });
}

let screenCtr = 0;
class GrScreen extends GrObject {
    constructor(params = {}) {
        // SCREEN //
        let screen_geom = new T.BoxGeometry(6, 4, 0.1);
        let screen_mat = new T.MeshStandardMaterial({ color: 0xd2e097, transparent: true });
        let screen = new T.Mesh(screen_geom, screen_mat);

        super(`Screen-${screenCtr++}`, screen);
        this.whole_ob = screen;
        this.material = screen_mat;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }
}

let titleScrCtr = 0;
export class GrNetMechanicUI extends GrObject {
    constructor(params = {}) {
        let titleScreen = new T.Group();
        let mat_array = [];

        let screen = new GrScreen();
        titleScreen.add(screen.objects[0]);
        mat_array.push(screen.objects[0].material);

        // TEXT //
        const loader = new FontLoader();
        let text_mat = new T.MeshStandardMaterial({ color: 0x135158, transparent: true });
        mat_array.push(text_mat);

        // bold
        loader.load(bold_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.2,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Welcome to Bug Catching!', text_settings), text_mat);
            titleScreen.add(text);
            text.position.set(-1.75, 1.25, 0.25);
        });

        // regular
        loader.load(reg_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.15,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Your net can be activated by pressing \'E\'. Position the\nnet over a bug with your mouse and left-click to catch!', 
                text_settings), text_mat);
            titleScreen.add(text);
            text.position.set(-2.5, 0.75, 0.25);
            let toggle_string = `The net shadow can be enabled for extra aiming\nassistance. ${prototype ? `You can navigate to the \'texture display\'\npage if you\'d like to see the bugs with their custom\n meshes!` : `You can navigate to the \'prototype display\'\npage if you\'d like to see the bugs with just their\nprimitive meshes!`}`;
            let text2 = new T.Mesh(new TextGeometry(toggle_string, 
                text_settings), text_mat);
            text.add(text2);
            text2.position.set(0, -0.75, 0);
        });

        // italic
        loader.load(ital_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.125,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('press \'Q\' to continue', text_settings), text_mat);
            titleScreen.add(text);
            text.position.set(-0.75, -1.7, 0.25);
        });

        titleScreen.rotateX(-Math.PI/2);

        super(`TitleScreen-${titleScrCtr++}`, titleScreen);
        this.whole_ob = titleScreen;
        this.material_array = mat_array;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }

    disableUI() {
        clearOpacity(this.material_array);
    }
}

let lOneDoneCtr = 0;
export class GrLOneDoneCtr extends GrObject {
    constructor(params = {}) {
        let lvlOne = new T.Group();
        let mat_array = [];

        let screen = new GrScreen();
        lvlOne.add(screen.objects[0]);
        mat_array.push(screen.objects[0].material);

        // TEXT //
        const loader = new FontLoader();
        let text_mat = new T.MeshStandardMaterial({ color: 0x135158, transparent: true });
        mat_array.push(text_mat);

        // bold
        loader.load(bold_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.2,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Level One Complete!', text_settings), text_mat);
            lvlOne.add(text);
            text.position.set(-1.25, 1.25, 0.25);
        });

        // regular
        loader.load(reg_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.15,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Bugs caught:', 
                text_settings), text_mat);
            lvlOne.add(text);
            text.position.set(-2.5, 0.75, 0.25);
            let text2 = new T.Mesh(new TextGeometry('- Blue morpho butterfly\n- Mint leaf beetle\n- Common garden snail\n- Thin-winged cicada', 
                text_settings), text_mat);
            text.add(text2);
            text2.position.set(0, -0.5, 0);
        });

        // italic
        loader.load(ital_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.125,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('press \'Q\' to continue', text_settings), text_mat);
            lvlOne.add(text);
            text.position.set(-0.75, -1.7, 0.25);
        });

        lvlOne.rotateX(-Math.PI/2);

        super(`LOneDone-${lOneDoneCtr++}`, lvlOne);
        this.whole_ob = lvlOne;
        this.material_array = mat_array;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }

    disableUI() {
        clearOpacity(this.material_array);
    }
}

let fleeCtr = 0;
export class GrFleeMechanicUI extends GrObject {
    constructor(params = {}) {
        let fleeScreen = new T.Group();
        let mat_array = [];

        let screen = new GrScreen();
        fleeScreen.add(screen.objects[0]);
        mat_array.push(screen.objects[0].material);

        // TEXT //
        const loader = new FontLoader();
        let text_mat = new T.MeshStandardMaterial({ color: 0x135158, transparent: true });
        mat_array.push(text_mat);

        // bold
        loader.load(bold_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.2,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Shy bugs:', text_settings), text_mat);
            fleeScreen.add(text);
            text.position.set(-0.75, 1.25, 0.25);
        });

        // regular
        loader.load(reg_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.15,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Some bugs are shy and like to hide under objects.\nLeft-click on an object in the scene with your net\ndisabled to move it and see if there are any critters\nunder there!', 
                text_settings), text_mat);
            fleeScreen.add(text);
            text.position.set(-2.5, 0.75, 0.25);
            let text2 = new T.Mesh(new TextGeometry('If you move too fast or fail to catch them, they might\nrun away. Not to worry; they will usually come back\nquickly if you move the object they were hiding under\nback to its original position.', 
                text_settings), text_mat);
            text.add(text2);
            text2.position.set(0, -1.25, 0);
        });

        // italic
        loader.load(ital_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.125,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('press \'Q\' to continue', text_settings), text_mat);
            fleeScreen.add(text);
            text.position.set(-0.75, -1.7, 0.25);
        });

        fleeScreen.rotateX(-Math.PI/2);

        super(`FleeScreen-${fleeCtr++}`, fleeScreen);
        this.whole_ob = fleeScreen;
        this.material_array = mat_array;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }

    disableUI() {
        clearOpacity(this.material_array);
    }
}

let lTwoDoneCtr = 0;
export class GrLTwoDoneCtr extends GrObject {
    constructor(params = {}) {
        let lvlTwo = new T.Group();
        let mat_array = [];

        let screen = new GrScreen();
        lvlTwo.add(screen.objects[0]);
        mat_array.push(screen.objects[0].material);

        // TEXT //
        const loader = new FontLoader();
        let text_mat = new T.MeshStandardMaterial({ color: 0x135158, transparent: true });
        mat_array.push(text_mat);

        // bold
        loader.load(bold_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.2,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Level Two Complete!', text_settings), text_mat);
            lvlTwo.add(text);
            text.position.set(-1.25, 1.25, 0.25);
        });

        // regular
        loader.load(reg_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.15,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Bugs caught:', 
                text_settings), text_mat);
            lvlTwo.add(text);
            text.position.set(-2.5, 0.75, 0.25);
            let text2 = new T.Mesh(new TextGeometry('- Brassy ball leaf beetle\n- Milk snail\n- Monarch butterfly\n- Bumblebee', 
                text_settings), text_mat);
            text.add(text2);
            text2.position.set(0, -0.5, 0);
        });

        // italic
        loader.load(ital_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.125,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('press \'Q\' to continue', text_settings), text_mat);
            lvlTwo.add(text);
            text.position.set(-0.75, -1.7, 0.25);
        });

        lvlTwo.rotateX(-Math.PI/2);

        super(`LTwoDone-${lTwoDoneCtr++}`, lvlTwo);
        this.whole_ob = lvlTwo;
        this.material_array = mat_array;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }

    disableUI() {
        clearOpacity(this.material_array);
    }
}

let lThreeDoneCtr = 0;
export class GrLThreeDoneCtr extends GrObject {
    constructor(params = {}) {
        let lvlThree = new T.Group();
        let mat_array = [];

        let screen = new GrScreen();
        lvlThree.add(screen.objects[0]);
        mat_array.push(screen.objects[0].material);

        // TEXT //
        const loader = new FontLoader();
        let text_mat = new T.MeshStandardMaterial({ color: 0x135158, transparent: true });
        mat_array.push(text_mat);

        // bold
        loader.load(bold_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.2,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Level Three Complete!', text_settings), text_mat);
            lvlThree.add(text);
            text.position.set(-1.25, 1.25, 0.25);
        });

        // regular
        loader.load(reg_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.15,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('Bugs caught:', 
                text_settings), text_mat);
            lvlThree.add(text);
            text.position.set(-2.5, 0.75, 0.25);
            let text2 = new T.Mesh(new TextGeometry('- Polyphemus moth\n- Common eastern firefly\n- Giant water bug\n- Wolf spider', 
                text_settings), text_mat);
            text.add(text2);
            text2.position.set(0, -0.5, 0);
            let text3 = new T.Mesh(new TextGeometry('Thank you for playing Bug Catching! Cotinue if you\'d\nlike to view your bug garden :)', 
                text_settings), text_mat);
            text2.add(text3);
            text3.position.set(0, -1.25, 0);
        });

        // italic
        loader.load(ital_path, (font) => {
            let text_settings = {
                font: font,
                size: 0.125,
                height: 0.25,
                depth: 0.01
            };
            let text = new T.Mesh(new TextGeometry('press \'Q\' to continue', text_settings), text_mat);
            lvlThree.add(text);
            text.position.set(-0.75, -1.7, 0.25);
        });

        lvlThree.rotateX(-Math.PI/2);

        super(`LThreeDone-${lThreeDoneCtr++}`, lvlThree);
        this.whole_ob = lvlThree;
        this.material_array = mat_array;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale, scale, scale);
    }

    disableUI() {
        clearOpacity(this.material_array);
    }
}