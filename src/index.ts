import { Vec3 } from 'cannon';
import * as THREE from 'three';
import { AmbientLight, CameraHelper, Clock, Raycaster, TorusBufferGeometry, TrianglesDrawModes, Vector3, WebGLRenderer } from 'three';
import Character from './Character';
import * as CANNON from 'cannon';
import Key from './Hotkeys/Key';
import Hotkeys from './Hotkeys/Hotkeys';
const ENABLE_SHADOW = true;
const canvas: HTMLCanvasElement = document.querySelector("#bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
declare var hideModal: () => void;
// hideModal();
declare var showModal: () => void;
showModal();
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true

})
console.log("%c This website inspired by Bruno Simon Web https://bruno-simon.com", 'background: #222; color: #bada55; font-size:20px; font-weight:bold;')
declare var production: boolean; // from webpack config file.

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.quaternion.x = THREE.MathUtils.degToRad(-25)
camera.quaternion.y = THREE.MathUtils.degToRad(15)
renderer.render(scene, camera)
var temp = new THREE.Vector3();
camera.getWorldDirection(temp)



const SUN = new THREE.DirectionalLight(0xffffff, 0.5)
camera.projectionMatrix;
camera.modelViewMatrix;
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

const sizeGround = {
    x: 1000,
    y: 0.1,
    z: 1000
}
const groundBody = new CANNON.Body({ mass: 0, material: { friction: 1, restitution: 0.1, id: 1, name: "test" }, shape: new CANNON.Box(new Vec3(sizeGround.x, 0.1, sizeGround.z)) });
world.addBody(groundBody);

const plane = new Plane(world, scene, SUN, new THREE.Vector3(0, 0, 0), sizeGround, "#c49a66", "#fffff");
// const geometry = new THREE.PlaneGeometry(sizeGround.x, sizeGround.z);
// const material = new THREE.MeshToonMaterial({ color: "#c49a66", side: THREE.FrontSide });
// const plane = new THREE.Mesh(geometry, material);
// plane.rotation.x = (THREE.MathUtils.degToRad(-90))
// plane.receiveShadow = true;
// plane.position.set(0,0,0)
// scene.add(plane);

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
var mouse = new THREE.Vector2();
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
const raycast = new Raycaster();
canvas.onmousemove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    deltaPos.x = MouselastPos.x - e.pageX;
    deltaPos.y = MouselastPos.y - e.pageY;
    MouselastPos.x = e.pageX;
    MouselastPos.y = e.pageY;
    // camera.getWorldDirection(frontCam);
    if (!followCharacter && leftMouseDown) {

        //x camera local axis logic
        camera.getWorldDirection(frontCam);
        leftCam = frontCam.cross(camera.up);
        leftCam = leftCam.normalize()
        camera.position.add(leftCam.multiplyScalar(deltaPos.x).multiplyScalar(CameraPanSpeed));

        //y camera local axis logic
        camera.getWorldDirection(frontCam);
        frontCam.y = 0;
        frontCam = frontCam.normalize()
        frontCam.multiplyScalar(deltaPos.y)
        frontCam.multiplyScalar(CameraPanSpeed);
        frontCam.multiplyScalar(-1.5);
        camera.position.add(frontCam);
    }
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

const popups = new PopUps(world, scene)
popups.init()
//#endregion

document.onkeydown = (e) => {
    if (e.key == "w") {
    }
    else if (e.key == "s") {
    }
    else if (e.key == "a") {
    }
    else if (e.key == "d") {
    }
    else if (e.key == "z") {
        billboards.keys[0].onPopUpMouseHover();
        return;
    }
    else if (e.key == "x") {
        billboards.keys[0].onPopUpMouseNotHover();
        return;
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



canvas.onclick = (e) => {
    //
    raycast.setFromCamera(mouse, camera);
    const intersects = raycast.intersectObjects(scene.children);
    for (let i = 0; i < billboards.keys.length; i++) {
        const billboard = billboards.keys[i];
        for (let j = 0; j < intersects.length; j++) {
            const intersect = intersects[j];
            if (intersect.object.uuid == billboard.PopUpObject.borderFloor.mesh.uuid) {
                for (let k = 0; k < billboard.urlRef.length; k++) {
                    const url = billboard.urlRef[k];
                    window.open(url, "_blank")

                }
                return;
            }

        }
    }

}

const LOBBY_OFFSET_CAMERA = new Vector3(15, 35, 50);
const KNOWLEDGE_OFFSET_CAMERA = new Vector3(15, 20, 35);
const PORTOFOLIO_OFFSET_CAMERA = new Vector3(5, 40, 20);
var CURRENT_OFFSET_CAMERA = new Vector3().copy(LOBBY_OFFSET_CAMERA);
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
import PopUps from './PopUps/PopUps';
import Plane from './PlaneGround/Plane';
import isintersect from './utility/isIntersect';
import Connection from './Connection/Connection';

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
interface IHash<T> {
    [key: string]: T
}
const otherPlayers: IHash<Character> = {};

function animate() {
    deltatime = clock.getDelta()
    // if (deltatime < 0.2)
    world.step(1 / 30);
    // else return
    //#region update mesh & body
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

    if (popups.initialized) {
        popups.update(deltatime)
    }

    for (var key in otherPlayers) {
        const player = otherPlayers[key];
        if (player.initialized) {
            player.update(deltatime);
        }

    }

    //#endregion
    if (followCharacter) {
        offsetChanged = false;
        if (character.position.z >= 100) {
            alphaOffsetCamera_portofolio = 0;
            alphaOffsetCamera_lobby = 0;
            //on knowledge position
            alphaOffsetCamera_knowledge += deltatime * 0.1;
            if (clamp(alphaOffsetCamera_knowledge, 0, 1) < 1) {
                CURRENT_OFFSET_CAMERA = new Vector3().copy(CURRENT_OFFSET_CAMERA).lerp(KNOWLEDGE_OFFSET_CAMERA, alphaOffsetCamera_knowledge);
                offsetChanged = true;
            }
        }
        else if (character.position.x >= 40) {
            alphaOffsetCamera_knowledge = 0;
            alphaOffsetCamera_lobby = 0;

            alphaOffsetCamera_portofolio += deltatime * 0.04;
            if (clamp(alphaOffsetCamera_portofolio, 0, 1) < 1) {
                CURRENT_OFFSET_CAMERA = new Vector3().copy(CURRENT_OFFSET_CAMERA).lerp(PORTOFOLIO_OFFSET_CAMERA, alphaOffsetCamera_portofolio);
                offsetChanged = true;
            }
        }
        else {
            //on knowledge lobby position
            alphaOffsetCamera_portofolio = 0;
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
    if (billboards.initialized)

        raycast.setFromCamera(mouse, camera);
    // checking intersect mouse with objects
    const intersects = raycast.intersectObjects(scene.children);
    document.body.style.cursor = "default";
    if (billboards.initialized)
        for (let j = 0; j < billboards.keys.length; j++) {
            var hovered = false;

            if (isintersect(character.body, billboards.keys[j].PopUpObject.borderFloor.body, world)) {
                document.body.style.cursor = "pointer";
                billboards.keys[j].onPopUpMouseHover(); // start animating fence to go up
                hovered = true;
                continue;
            }
            else {
            }

            for (let i = 0; i < intersects.length; i++) {
                if (billboards.keys[j].PopUpObject.borderFloor.mesh.uuid == intersects[i].object.uuid) {
                    billboards.keys[j].onPopUpMouseHover(); // start animating fence to go up
                    document.body.style.cursor = "pointer";

                    hovered = true;
                    console.log("hovering")
                    break;
                }
            }
            if (!hovered)
                billboards.keys[j].onPopUpMouseNotHover(); // start animating fence to go up
        }

    if (connection && character.body && connection.id)
        connection.send({ channel: "transform", id: connection.id, position: character.body.position, quaternion: character.body.quaternion });
    renderer.render(scene, camera)
    plane.setDepthTexture(SUN.shadow.map.texture);
    plane.setWorldMatrix(SUN.matrixWorld);
    requestAnimationFrame(animate);
    // composer2.render(deltatime)

}
var alphaOffsetCamera_knowledge = 0;
var alphaOffsetCamera_lobby = 0;
var alphaOffsetCamera_portofolio = 0;
var offsetChanged = false;
animate();


const connection = new Connection();
const joinButton: HTMLButtonElement = document.querySelector('#join');
joinButton.onclick = () => {
    connection.connect();
}
connection.onrecieve = (e) => {
    // console.log(e.data)
    const message = JSON.parse(e.data);
    switch (message.channel) {
        case "transform":
            // console.log({ otherPlayers });
            message.id = message.id.toString();
            // console.log({ id: message.id });
            // console.log({ x: message.quaternion.x });
            for (var key in otherPlayers) {
                // console.log({ key })
            }
            otherPlayers[message.id].body.position.copy(message.position);
            otherPlayers[message.id].body.quaternion.copy(message.quaternion);
            break;
        default:
            break;
    }
    // console.log("onrecieve...")
}
connection.onnewplayer = async (id: string) => {
    console.log("new player...")
    otherPlayers[id] = (new Character(world, scene, new Vector3(0, 150, 0), 0));
    await otherPlayers[id].init();
    otherPlayers[id].body.mass = 0;//not affected to gravity
}

