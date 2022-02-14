import { Vec3 } from 'cannon';
import * as THREE from 'three';
import { Clock, Group, Material, Mesh, MeshPhongMaterial, Raycaster, Shader, ShaderMaterial, Vector3 } from 'three';
import Character from './Character';
import * as CANNON from 'cannon';
import Hotkeys from './Hotkeys/Hotkeys';
const canvas: HTMLCanvasElement = document.querySelector("#bg");
canvas.style.width = `${innerWidth}px`;
canvas.style.height = `${innerHeight}px`;
canvas.width = innerWidth;
canvas.height = innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
console.log("v1.5");
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true,
    alpha: true

})

// console.log("%c This website inspired by Bruno Simon Web https://bruno-simon.com", 'background: #222; color: #bada55; font-size:20px; font-weight:bold;')
declare var production: boolean; // from webpack config file.

const config = production ? prodConfig : devConfig;

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)


renderer.render(scene, camera)


//#region SUN directional lights
const SUN = new THREE.DirectionalLight(config.lights.sun.color, config.lights.sun.power)
SUN.position.copy(config.lights.sun.position)
SUN.target.position.copy(config.lights.sun.target);
// SUN.shadow.camera.visible = ENABLE_SHADOW;
// SUN.castShadow = ENABLE_SHADOW;
// SUN.shadow.camera.near = config.lights.;
// SUN.shadow.camera.far = 1000;
// const sizeAreaShadow = 200;
// SUN.shadow.camera.top = sizeAreaShadow;
// SUN.shadow.camera.bottom = -sizeAreaShadow;
// SUN.shadow.camera.left = sizeAreaShadow;
// SUN.shadow.camera.right = -sizeAreaShadow;
// SUN.shadow.mapSize.width = 700;
// SUN.shadow.mapSize.height = 700;
scene.add(SUN)
// const helper = new THREE.DirectionalLightHelper(SUN, 1);
// scene.add(helper);
//#endregion

const AMBIENT_LIGHT = new THREE.AmbientLight(config.lights.ambient.color, config.lights.ambient.power);
scene.add(AMBIENT_LIGHT)


const world = new CANNON.World();
world.gravity.copy(config.world.gravity);
world.broadphase = new CANNON.NaiveBroadphase(); //metode physics
world.solver.iterations = config.world.iteration; //fps

const sizeGround = config.ground.size;

const plane = new Plane(world, scene, new THREE.Vector3(0, 0, 0), sizeGround);
plane.init()

var followCharacter = true;
var leftMouseDown = false;
document.onmousedown = (e) => {

    // alert("mousedown")
    if (e.which == 1) {
        // alert("mousedown1")

        // if (controls.enablePan)
        if (followCharacter && character.initialized) {
            followCharacter = false;
            const { x, y, z } = character.mesh.position;
            var disiredPosition = new Vector3(x, y, z).add(CURRENT_OFFSET_CAMERA)
            camera.position.set(disiredPosition.x, disiredPosition.y, disiredPosition.z)
            alpha = 0;

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


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.shadowMap = true;
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { clamp, degToRad } from 'three/src/math/MathUtils';
import NavigationBoards from './NavigationBoards/NavigationBoards';
import Lobby from './Lobby/Lobby';
import RoadStones from './Lobby/RoadStones/RoadStones';
import Johansen from './johansen/johansen';
import ProLangs from './Knowledges/ProLang/ProLangs';
//#region 3D OBJECTS
const HOTKEYSPOSITION = new Vector3(-15, 1, 0);

const hotkeys = new Hotkeys(world, scene, HOTKEYSPOSITION);

const navigationBoards = new NavigationBoards(world, scene);

const lobby = new Lobby(world, scene);
const character = new Character(world, scene, new Vector3(0, 0, -5));
const roadStones = new RoadStones(scene)

const johansen = new Johansen(world, scene)

const trees = new Trees(world, scene)

const knowledge = new Knowledge(world, scene);

const billboards = new Billboards(world, scene, camera)

const digitRegocnition = new DigitRecognition(world, scene, camera, new THREE.Vector3(-50, 0.2, 50))
//#endregion

var key: string;
document.onkeydown = (e) => {
    key = e.key.toLowerCase();
    if (key == "w") {
    }
    else if (key == "s") {
    }
    else if (key == "a") {
    }
    else if (key == "d") {
    }
    else if (key == "z") {
        //for placing trees purposes.
        debug = !debug;
        // console.log(`${character.position.x.toFixed(0)}, -5, ${character.position.z.toFixed(0)}`);
        return;
    }
    else if (key == "g") {
        const raycast3 = new Raycaster();
        raycast3.setFromCamera(mouse, camera);
        var intersects = raycast3.intersectObjects(scene.children)
        console.log(intersects)
        return;
    }
    else {
        return
    }
    character.isPress[key] = true;
    followCharacter = true;

}

document.onkeyup = (e) => {
    key = e.key.toLowerCase();
    if (key == "w") {
    }
    else if (key == "s") {
    }
    else if (key == "a") {

    }
    else if (key == "d") {

    }
    else {
        return;
    }
    character.isPress[key] = false;
}


canvas.onmousedown = (e) => {
    // const raycast = new Raycaster();
    // raycast.setFromCamera(mouse, camera);
    // const intsCenterScreen = raycast.intersectObjects(scene.children);
    // if (intsCenterScreen.length != 0) {
    //     for (let i = 0; i < intsCenterScreen.length; i++) {
    //         const obj = intsCenterScreen[i];
    //         if (character.mesh.children[0].uuid != obj.object.uuid) {
    //             const mesh: Mesh = obj.object as any;
    //             if (Array.isArray(mesh.material)) {
    //                 const material = mesh.material[0];
    //                 var val = (material as ShaderMaterial).uniforms?._opacity?.value;
    //                 // if (!val) continue;
    //                 val -= 4 * deltatime;
    //                 const opacity = clamp(val, 0.2, 1);
    //                 setOpacity(mesh.parent as Group, scene.uuid, parseFloat(opacity.toFixed(2)));


    //                 continue;
    //             }
    //             var val = (mesh.material as ShaderMaterial).uniforms?._opacity?.value;
    //             // if (!val) continue;
    //             val -= 4 * deltatime;
    //             const opacity = clamp(val, 0.2, 1);
    //             setOpacity(mesh.parent as Group, scene.uuid, parseFloat(opacity.toFixed(2)));
    //         }

    //     }
    // }

}


const LOBBY_OFFSET_CAMERA = new Vector3(25, 35, 30);
const KNOWLEDGE_OFFSET_CAMERA = new Vector3(15, 20, 35);
const PORTOFOLIO_OFFSET_CAMERA = new Vector3(5, 40, 20);
const PLAYGROUND_OFFSET_CAMERA = new Vector3(15, 35, 50);
const OFFSET_AREA = {
    lobby: new Vector3(25, 35, 30),
    knowledge: new Vector3(15, 20, 35),
    portofolio: new Vector3(5, 40, 20),
    playground: new Vector3(15, 35, 50)
}
var START_OFFSET_CAMERA = new Vector3().copy(OFFSET_AREA.lobby);
var alphaOffsetCamera_knowledge = 0;
var alphaOffsetCamera_lobby = 0;
var alphaOffsetCamera_portofolio = 0;
var alphaOffsetCamera_playground = 0;
var offsetChanged = false;

var CURRENT_OFFSET_CAMERA = new Vector3().copy(LOBBY_OFFSET_CAMERA);
camera.position.copy(character.position)
camera.position.add(CURRENT_OFFSET_CAMERA)
camera.lookAt(character.position)
var deltatime = 0;
var alpha = 0;
const clock = new Clock()

import Trees from './Trees/Trees';
import Billboards from './Billboards/Billboards';
import Plane from './PlaneGround/Plane';
import Connection from './Connection/Connection';
import DigitRecognition from './Playgrounds/DigitRegocnition';
import Loading from './Loading/Loading';
import Knowledge from './Knowledges/Knowledges';
import setOpacity from './utility/setOpacity';
import { WaveEffect } from './waveEffect';
import prodConfig from './config/config.prod';
import devConfig from './config/config.dev';
var debug = false;

interface IHash<T> {
    [key: string]: T
}
const otherPlayers: IHash<Character> = {};
window.onresize = (e) => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.innerWidth / window.innerHeight)
}
var cameraPos = new THREE.Vector3();
var cameraDir = new THREE.Vector3();
const raycast2 = new THREE.Raycaster();
function animate() {
    deltatime = clock.getDelta()
    // if (deltatime < 0.2)
    world.step(config.world.step);
    // else return

    raycast.setFromCamera(mouse, camera);
    const intersects = raycast.intersectObjects(scene.children);

    // checking intersect mouse with objects
    if (character.initialized && loading.isFull && initialized && startHides) {
        camera.getWorldPosition(cameraPos)
        camera.getWorldDirection(cameraDir)
        raycast2.set(cameraPos, cameraDir);
        const intsCenterScreen = raycast2.intersectObjects(scene.children);
        if (intsCenterScreen.length != 0) {
            for (let i = 0; i < intsCenterScreen.length; i++) {
                const obj = intsCenterScreen[i];
                if (character.mesh.children[0].uuid != obj.object.uuid) {
                    const mesh: Mesh = obj.object as any;
                    if (Array.isArray(mesh.material)) { // bila 1 mesh terdiri dari beberapa material, biasanya .obj file
                        const material: ShaderMaterial = mesh.material[0] as ShaderMaterial;
                        var val = material.uniforms?._opacity?.value;
                        // if (!val) continue;
                        val -= config.invisibleEffect.speed * deltatime;
                        const opacity = clamp(val, 0.2, 1);
                        setOpacity(mesh.parent as Group, scene.uuid, parseFloat(opacity.toFixed(2)));


                        continue;
                    }


                    var val = (mesh.material as ShaderMaterial).uniforms?._opacity?.value;

                    val -= config.invisibleEffect.speed * deltatime;
                    const opacity = clamp(val, 0.2, 1);
                    if (debug) {
                        console.log(mesh.parent);
                    }
                    // if (mesh.parent.name == "" && mesh.parent.type == "Group" && mesh.parent.children.length == 3 && mesh.parent.children[2].name == "Circle_Circle.001") {
                    //     console.log(opacity)
                    //     console.log(mesh)
                    //     // throw "err"
                    // }
                    setOpacity(mesh.parent as Group, scene.uuid, parseFloat(opacity.toFixed(2)));
                }

            }
        }
    }

    document.body.style.cursor = "default";

    //#region update mesh & body
    if (trees.initialized) {
        trees.setWaveEffect(waveEffect)
        trees.updateWaveEffect()
        trees.update(deltatime)
    }
    if (character.initialized) {
        // alert(camera.position.distanceTo(character.position))
        // character.setWaveEffect(waveEffect)
        character.update(deltatime);
    }
    if (hotkeys.initialized) {
        hotkeys.setWaveEffect(waveEffect)
        hotkeys.updateWaveEffect()
        hotkeys.update(deltatime);

    }

    if (navigationBoards.initialized) {
        navigationBoards.setWaveEffect(waveEffect)
        navigationBoards.updateWaveEffect()
        navigationBoards.update(deltatime)

    }
    if (lobby.initialized) {
        lobby.setWaveEffect(waveEffect)
        lobby.updateWaveEffect()
        lobby.update(deltatime)
    }

    if (roadStones.initialized) {
        roadStones.setWaveEffect(waveEffect)
        roadStones.updateWaveEffect()
        roadStones.update(deltatime)
    }

    if (johansen.initialized) {
        johansen.setWaveEffect(waveEffect)
        johansen.updateWaveEffect()
        johansen.update(deltatime)
    }

    if (knowledge.initialized) {
        knowledge.setWaveEffect(waveEffect)
        knowledge.updateWaveEffect()
        knowledge.update(deltatime)
    }

    if (billboards.initialized) {
        billboards.setWaveEffect(waveEffect)
        billboards.updateWaveEffect()
        billboards.updateBillboard(deltatime, character.body, intersects) // give intersects because contain popup mesh
    }

    if (digitRegocnition.initialized) {
        // digitRegocnition.setWaveEffect(waveEffect)
        digitRegocnition.update(deltatime, character.body, intersects) // give intersects because contain popup mesh
    }

    for (var key in otherPlayers) {
        const player = otherPlayers[key];
        if (player.initialized) {
            player.update(deltatime);
        }
    }

    if (plane.initialized) {
        plane.update(deltatime);
    }
    //#endregion


    if (followCharacter) {
        if (character.position.z >= config.area.knowledge.offset) {
            if (character.on != "knowledge") {
                //first time character hit knowledge area
                START_OFFSET_CAMERA.copy(CURRENT_OFFSET_CAMERA);
                alphaOffsetCamera_knowledge = 0;
                character.on = "knowledge";
            }
            alphaOffsetCamera_portofolio = 0;
            alphaOffsetCamera_lobby = 0;
            alphaOffsetCamera_playground = 0;
            //on knowledge position
            if (clamp(alphaOffsetCamera_knowledge, 0, 1) < 1) {
                console.log({ alphaOffsetCamera_knowledge })
                //tambah 1 variable yaitu LAST_OFFSET_CAMARA -> INI TIDAK BOLEH BERUBAH VALUENYA SAMPAI TRANSISI SELESAI
                //diset tepat pertama x melakukan transisi(hanya 1x)
                CURRENT_OFFSET_CAMERA = new Vector3().copy(START_OFFSET_CAMERA).lerp(KNOWLEDGE_OFFSET_CAMERA, alphaOffsetCamera_knowledge);
                console.log({ x: CURRENT_OFFSET_CAMERA.x, y: CURRENT_OFFSET_CAMERA.y, z: CURRENT_OFFSET_CAMERA.z })
                console.log({ START_OFFSET_CAMERA })
                console.log({ KNOWLEDGE_OFFSET_CAMERA })
                offsetChanged = true;
            } else {
                // alert("changed")
            }
            alphaOffsetCamera_knowledge += deltatime * config.area.knowledge.camera.transition.speed;
        }
        else if (character.position.x >= 40) {
            if (character.on != "portofolio") {
                //first time character hit portofolio area
                START_OFFSET_CAMERA.copy(CURRENT_OFFSET_CAMERA);
                character.on = "portofolio";
                alphaOffsetCamera_portofolio = 0;
            }
            alphaOffsetCamera_knowledge = 0;
            alphaOffsetCamera_lobby = 0;
            alphaOffsetCamera_playground = 0;
            alphaOffsetCamera_portofolio += deltatime * config.area.portofolio.camera.transition.speed;
            if (clamp(alphaOffsetCamera_portofolio, 0, 1) < 1) {
                CURRENT_OFFSET_CAMERA = new Vector3().copy(START_OFFSET_CAMERA).lerp(PORTOFOLIO_OFFSET_CAMERA, alphaOffsetCamera_portofolio);
            } else
                offsetChanged = true;
        }
        else if (character.position.x <= -40) {
            if (character.on != "playground") {
                //first time character hit playground area
                START_OFFSET_CAMERA.copy(CURRENT_OFFSET_CAMERA);
                character.on = "playground";
                alphaOffsetCamera_playground = 0;
            }
            //player on playground
            alphaOffsetCamera_knowledge = 0;
            alphaOffsetCamera_lobby = 0;
            alphaOffsetCamera_portofolio = 0;

            alphaOffsetCamera_playground += deltatime * config.area.playground.camera.transition.speed;
            if (clamp(alphaOffsetCamera_playground, 0, 1) < 1) {
                CURRENT_OFFSET_CAMERA = new Vector3().copy(START_OFFSET_CAMERA).lerp(PLAYGROUND_OFFSET_CAMERA, alphaOffsetCamera_playground);
            } else
                offsetChanged = true;
        }
        else {
            //on knowledge lobby position
            if (character.on != "lobby") {
                //first time character hit lobby area
                START_OFFSET_CAMERA.copy(CURRENT_OFFSET_CAMERA);
                character.on = "lobby";
                alphaOffsetCamera_lobby = 0;
            }
            alphaOffsetCamera_portofolio = 0;
            alphaOffsetCamera_playground = 0;
            alphaOffsetCamera_knowledge = 0;

            alphaOffsetCamera_lobby += deltatime * config.area.lobby.camera.transition.speed;
            if (clamp(alphaOffsetCamera_lobby, 0, 1) < 1) {
                CURRENT_OFFSET_CAMERA = new Vector3().copy(START_OFFSET_CAMERA).lerp(LOBBY_OFFSET_CAMERA, alphaOffsetCamera_lobby);
                offsetChanged = true;
            }
            // else
        }

        if (character.initialized) {
            const { x, y, z } = character.mesh.position;
            var disiredPosition = new Vector3(x, y, z).add(CURRENT_OFFSET_CAMERA)

            alpha += deltatime * 0.3
            const finalPosition = new Vector3().copy(camera.position).lerp(disiredPosition, clamp(alpha, 0, 1));
            camera.position.copy(finalPosition)
            if (clamp(alpha, 0, 1) >= 1) {
                // camera.lookAt(character.position); // lookAt juga perlu di lerp
            }
            alpha = clamp(alpha, 0, 1);
        }

        //bila offset posisi kamera sedang berubah maka camera lookAt harus diganti juga
        if (offsetChanged) {
            camera.lookAt(character.position)
        }

    }
    else {
        alpha = 0.0;

    }



    // if (connection && character.body && connection.id)
    //     connection.send({ channel: "transform", id: connection.id, position: character.body.position, quaternion: character.body.quaternion });
    if (initialized)
        renderer.render(scene, camera)
    requestAnimationFrame(animate);

}

animate();


// const connection = new Connection();
const joinButton: HTMLButtonElement = document.querySelector('#join');
joinButton.onclick = () => {
    // connection.connect();
}
// connection.onrecieve = (e) => {
//     // console.log(e.data)
//     const message = JSON.parse(e.data);
//     switch (message.channel) {
//         case "transform":
//             message.id = message.id.toString();
//             for (var key in otherPlayers) {
//             }
//             otherPlayers[message.id].body.position.copy(message.position);
//             otherPlayers[message.id].body.quaternion.copy(message.quaternion);
//             break;
//         default:
//             break;
//     }
// }
// connection.onnewplayer = async (id: string) => {
//     otherPlayers[id] = (new Character(world, scene, new Vector3(0, 150, 0), 0));
//     await otherPlayers[id].init();
//     otherPlayers[id].body.mass = 0;//not affected to gravity
// }
var startWaveEffect = false;
const waveEffect: WaveEffect = {
    originPos: new Vector3(),
    range: 0
}
var initialized = false;
const loading = new Loading();
async function init() {
    loading.setText("Loading Environment");
    hotkeys.init().then(() => {
        loading.addProgress(2);

    });
    navigationBoards.init().then(() => {
        loading.addProgress(5);
    });
    lobby.init().then(() => {
        loading.addProgress(10);
    });
    roadStones.init().then(() => {
        loading.addProgress(3);
    })
    loading.setText("Loading Character");
    character.init().then(() => {
        loading.addProgress(2);
    });
    // johansen.init().then(() => {
    //     loading.addProgress(5);

    // })
    loading.setText("Loading Knowledges");
    knowledge.init(loading).then(() => {
        loading.addProgress(5);
    });
    loading.setText("Loading Trees");
    trees.init().then(() => {
        loading.addProgress(15);
    })
    loading.setText("Loading Billboards");
    billboards.init().then(() => {
        loading.addProgress(15);
    })
    loading.setText("Loading Playgrounds");
    digitRegocnition.init().then(() => {
        loading.addProgress(3);
    })

}
loading.onfull = () => {
    initialized = true;
    startHides = true;
    startWaveEffect = true;
    waveEffect.range = 5000;
    //     setInterval(() => {
    //         waveEffect.range += 10;
    //     }, 500);
}
var startHides = false;
init();