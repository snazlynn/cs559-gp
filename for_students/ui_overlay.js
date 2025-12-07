import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { FontLoader } from "../libs/CS559-Three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../libs/CS559-Three/examples/jsm/geometries/TextGeometry.js";

/**
 * makes all materials in mat_array invisible
 * @param {*} mat_array 
 */
function clearOpacity(mat_array) {
    mat_array.forEach(mat => {
        mat.opacity = 0;
    });
}

let titleScrCtr = 0;
export class GrNetMechanicUI extends GrObject {
    constructor(params = {}) {
        let titleScreen = new T.Group();
        let mat_array = [];

        // SCREEN //
        let screen_geom = new T.BoxGeometry(6, 4, 0.1);
        let screen_mat = new T.MeshStandardMaterial({ color: 0xd2e097, transparent: true });
        mat_array.push(screen_mat);
        let screen = new T.Mesh(screen_geom, screen_mat);
        titleScreen.add(screen);

        // TEXT //
        const loader = new FontLoader();
        let text_mat = new T.MeshStandardMaterial({ color: 0x135158, transparent: true });
        mat_array.push(text_mat);

        // bold
        loader.load( '../libs/CS559-Three/examples/jsm/fonts/helvetiker_bold.typeface.json', (font) => {
            let text_settings = {
                font: font,
                size: 0.2,
                height: 0.25,
                depth: 0.01
            };
            // Your net can be activated by pressing \'E\'. Position the net over the bug with your mouse and left-click to catch!
            let text = new T.Mesh(new TextGeometry('Welcome to Bug Catching!', text_settings), text_mat);
            titleScreen.add(text);
            text.position.set(-1.75, 1.25, 0.25);
        });

        // regular
        loader.load( '../libs/CS559-Three/examples/jsm/fonts/helvetiker_regular.typeface.json', (font) => {
            let text_settings = {
                font: font,
                size: 0.15,
                height: 0.25,
                depth: 0.01
            };
            // Your net can be activated by pressing \'E\'. Position the net over the bug with your mouse and left-click to catch!
            let text = new T.Mesh(new TextGeometry('Your net can be activated by pressing \'E.\'', 
                text_settings), text_mat);
            titleScreen.add(text);
            text.position.set(-2.25, -0.5, 0.25);
            let text2 = new T.Mesh(new TextGeometry('Position the net over the bug with\nyour mouse and left-click to catch!', 
                text_settings), text_mat);
            text.add(text2);
            text2.position.set(0, -0.5, 0);
        });

        // italic
        loader.load( '../libs/CS559-Three/examples/jsm/fonts/helvetiker_italic.typeface.json', (font) => {
            let text_settings = {
                font: font,
                size: 0.125,
                height: 0.25,
                depth: 0.01
            };
            // Your net can be activated by pressing \'E\'. Position the net over the bug with your mouse and left-click to catch!
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