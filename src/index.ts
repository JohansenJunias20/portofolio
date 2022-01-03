import { Vec3 } from 'cannon';
import * as THREE from 'three';
import { AmbientLight, CameraHelper, Clock, TorusBufferGeometry, TrianglesDrawModes, Vector3, WebGLRenderer } from 'three';
import Character from './Character';
import * as CANNON from 'cannon';
import Key from './Hotkeys/Key';
import Hotkeys from './Hotkeys/Hotkeys';
const ENABLE_SHADOW = true;
const canvas: HTMLCanvasElement = document.querySelector("#bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true
})


renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.quaternion.x = THREE.MathUtils.degToRad(-25)
camera.quaternion.y = THREE.MathUtils.degToRad(15)
renderer.render(scene, camera)
var temp = new THREE.Vector3();
camera.getWorldDirection(temp)

const sizeGround = {
    x: 1000,
    z: 1000
}

const geometry = new THREE.PlaneGeometry(sizeGround.x, sizeGround.z);
const material = new THREE.MeshToonMaterial({ color: "#c49a66", side: THREE.FrontSide });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = (THREE.MathUtils.degToRad(-90))
plane.receiveShadow = true;
scene.add(plane);

const SUN = new THREE.DirectionalLight(0xffffff, 0.5)
SUN.position.set(0, 200, 15)
SUN.target.position.set(0, 0, 0);
SUN.shadow.camera.visible = ENABLE_SHADOW;
SUN.castShadow = ENABLE_SHADOW;
SUN.shadow.camera.near = 0.1;
SUN.shadow.camera.far = 1000;
const sizeAreaShadow = 200;
SUN.shadow.camera.top = sizeAreaShadow;
SUN.shadow.camera.bottom = -sizeAreaShadow;
SUN.shadow.camera.left = sizeAreaShadow;
SUN.shadow.camera.right = -sizeAreaShadow;
SUN.shadow.mapSize.width = 700;
SUN.shadow.mapSize.height = 700;
scene.add(SUN)

const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(AMBIENT_LIGHT)


const world = new CANNON.World();
world.gravity.set(0, -10, 0);
world.broadphase = new CANNON.NaiveBroadphase(); //metode physics
world.solver.iterations = 40; //fps

const groundBody = new CANNON.Body({ mass: 0, material: { friction: 1, restitution: 0.1, id: 1, name: "test" }, shape: new CANNON.Box(new Vec3(sizeGround.x, 0.1, sizeGround.z)) });

// world.addBody(box1Body)
world.addBody(groundBody);



// lobby.init();


var followCharacter = true;
var leftMouseDown = false;
canvas.onmousedown = (e) => {
    if (e.which == 1) {
        // if (controls.enablePan)
        if (followCharacter) {
            followCharacter = false;
            const { x, y, z } = character.mesh.position;
            var disiredPosition = new Vector3(x, y, z).add(CURRENT_OFFSET_CAMERA)
            camera.position.set(disiredPosition.x, disiredPosition.y, disiredPosition.z)
            // controls.target.copy(character.position);
            // controls.update();
        }
        leftMouseDown = true;
        // canvas.requestPointerLock();
    }


}
canvas.onmouseup = (e) => {
    if (e.which == 1) {
        leftMouseDown = false;
    }
}
var MouselastPos = {
    x: 0,
    y: 0
}
var deltaPos = {
    x: 0,
    y: 0
}
var frontCam = new Vector3()
var leftCam = new Vector3()
const CameraPanSpeed = 0.035;
canvas.onmousemove = (e) => {
    deltaPos.x = MouselastPos.x - e.pageX;
    deltaPos.y = MouselastPos.y - e.pageY;
    MouselastPos.x = e.pageX;
    MouselastPos.y = e.pageY;
    if (!followCharacter && leftMouseDown) {

        //x camera local axis logic
        camera.getWorldDirection(frontCam);
        leftCam = frontCam.cross(camera.up);
        camera.position.add(leftCam.multiplyScalar(deltaPos.x).multiplyScalar(CameraPanSpeed));

        //y camera local axis logic
        camera.getWorldDirection(frontCam);
        camera.position.x += frontCam.multiplyScalar(deltaPos.y).x * CameraPanSpeed * 3 * -1
        camera.position.z += frontCam.y * CameraPanSpeed * 3 * -1
    }
}
document.onkeydown = (e) => {
    if (e.key == "w") {
    }
    else if (e.key == "s") {
    }
    else if (e.key == "a") {
    }
    else if (e.key == "d") {
    }
    else {
        return
    }
    character.isPress[e.key] = true;
    followCharacter = true;

}

document.onkeyup = (e) => {
    if (e.key == "w") {
    }
    else if (e.key == "s") {
    }
    else if (e.key == "a") {

    }
    else if (e.key == "d") {

    }
    else {
        return;
    }
    character.isPress[e.key] = false;
}
const speed = 1;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.shadowMap = true;
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { clamp } from 'three/src/math/MathUtils';
import NavigationBoards from './NavigationBoards/NavigationBoards';
import Lobby from './Lobby/Lobby';
import RoadStones from './Lobby/RoadStones/RoadStones';
import Johansen from './johansen/johansen';
import ProLangs from './ProLang/ProLangs';
//#region 3D OBJECTS
const HOTKEYSPOSITION = new Vector3(-15, 1, 0);

const hotkeys = new Hotkeys(world, scene, HOTKEYSPOSITION);
hotkeys.init();

const navigationBoards = new NavigationBoards(world, scene);
navigationBoards.init();

const lobby = new Lobby(world, scene);
lobby.init();
const character = new Character(world, scene, new Vector3(0, 0, -5));
character.init();
const roadStones = new RoadStones(scene)
roadStones.init()

const johansen = new Johansen(world, scene)
johansen.init()

const prolang = new ProLangs(world, scene)
prolang.init()

const trees = new Trees(world, scene)
trees.init()

const dbs = new DBs(world, scene)
dbs.init()

const frameworks = new Frameworks(world, scene)
frameworks.init()

const softwares = new Softwares(world, scene)
softwares.init()

const billboards = new Billboards(world, scene)
billboards.init()
//#endregion

const LOBBY_OFFSET_CAMERA = new Vector3(15, 35, 50);
var CURRENT_OFFSET_CAMERA = new Vector3().copy(LOBBY_OFFSET_CAMERA);
const KNOWLEDGE_OFFSET_CAMERA = new Vector3(15, 20, 35);
camera.position.copy(character.position)
camera.position.add(CURRENT_OFFSET_CAMERA)
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false;
// controls.enablePan = false;
// controls.enableRotate = false;
// controls.mouseButtons = {
//     LEFT: THREE.MOUSE.RIGHT,
//     RIGHT: THREE.MOUSE.LEFT,
//     MIDDLE: THREE.MOUSE.MIDDLE,
// }
// controls.target.copy(character.position)
camera.lookAt(character.position)
var deltatime = 0;
var alpha = 0;
// var cameraInitialized = false;
const clock = new Clock()
// var allowControlCamera = false;
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import Trees from './Trees/Trees';
import DBs from './DB/DBs';
import Frameworks from './Frameworks/Frameworks';
import Softwares from './Softwares/Softwares';
import Billboards from './Billboards/Billboards';

// const bokehPass = new BokehPass(scene, camera, {
//     focus: 60,
//     aperture: 0.00001,
//     maxblur: 0.1,

//     width: window.innerWidth,
//     height: window.innerHeight
// });
console.log({ distance: new Vector3().copy(character.position).distanceTo(camera.position) });
// console.log({ uniform: bokehPass.uniforms })
// bokehPass.uniforms.aperture.value = 4 * 0.00001;
const renderPass = new RenderPass(scene, camera);

// const fxaaPass = new ShaderPass(FXAAShader);
// const pixelRatio = window.devicePixelRatio;
// fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
// fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);

// renderer.physicallyCorrectLights = true;
// const composer2 = new EffectComposer(renderer);
// composer2.setSize(window.innerWidth, window.innerHeight)
// composer2.addPass(renderPass);
// composer2.addPass(fxaaPass);
// composer2.addPass(bokehPass);

function animate() {
    deltatime = clock.getDelta()
    requestAnimationFrame(animate);
    // if (deltatime < 0.2)
    world.step(1 / 30);
    // else return
    if (trees.initialized) {
        trees.update(deltatime)
    }
    if (character.initialized) {
        // alert(camera.position.distanceTo(character.position))
        character.update(deltatime);
    }
    if (hotkeys.initialized)
        hotkeys.update(deltatime);

    if (navigationBoards.initialized)
        navigationBoards.update(deltatime)

    if (lobby.initialized) {
        lobby.update(deltatime)
    }

    if (roadStones.initialized) {
        roadStones.update(deltatime)
    }

    if (johansen.initialized) {
        johansen.update(deltatime)
    }

    if (prolang.initialized) {
        prolang.update(deltatime)
    }

    if (dbs.initialized) {
        dbs.update(deltatime)
    }

    if (frameworks.initialized) {
        frameworks.update(deltatime)
    }

    if (softwares.initialized) {
        softwares.update(deltatime)
    }

    if (billboards.initialized) {
        billboards.update(deltatime)
    }

    if (followCharacter) {
        offsetChanged = false;
        if (character.position.z >= 100) {
            //on knowledge position
            alphaOffsetCamera_knowledge += deltatime * 0.1;
            if (clamp(alphaOffsetCamera_knowledge, 0, 1) < 1) {
                CURRENT_OFFSET_CAMERA = new Vector3().copy(CURRENT_OFFSET_CAMERA).lerp(KNOWLEDGE_OFFSET_CAMERA, alphaOffsetCamera_knowledge);
                offsetChanged = true;
            }
            alphaOffsetCamera_lobby = 0;
        }
        else {
            //on knowledge lobby position
            alphaOffsetCamera_knowledge = 0;
            alphaOffsetCamera_lobby += deltatime * 0.1;
            if (clamp(alphaOffsetCamera_lobby, 0, 1) < 1) {
                CURRENT_OFFSET_CAMERA = new Vector3().copy(CURRENT_OFFSET_CAMERA).lerp(LOBBY_OFFSET_CAMERA, alphaOffsetCamera_lobby);
                offsetChanged = true;
            }
        }

        if (character.initialized) {
            const { x, y, z } = character.mesh.position;
            var disiredPosition = new Vector3(x, y, z).add(CURRENT_OFFSET_CAMERA)
            if (camera.position == disiredPosition) {

            }
            alpha += deltatime * 0.3
            const finalPosition = new Vector3().copy(camera.position).lerp(disiredPosition, clamp(alpha, 0, 1));
            camera.position.copy(finalPosition)
            if (clamp(alpha, 0, 1) >= 1) {
                camera.lookAt(character.position); // lookAt juga perlu di lerp
            }
        }

        //bila offset posisi kamera sedang berubah maka camera lookAt harus diganti juga
        if (offsetChanged) {
            camera.lookAt(character.position)
        }

    }
    else {
        alpha = 0.0;

    }

    // if (character.isPress.w || character.isPress.a || character.isPress.s || character.isPress.d) {
    //     controls.enablePan = false;
    // }
    // else {
    //     controls.enablePan = true;
    // }

    renderer.render(scene, camera)
    // composer2.render(deltatime)

}
var alphaOffsetCamera_knowledge = 0;
var alphaOffsetCamera_lobby = 0;
var offsetChanged = false;
animate();