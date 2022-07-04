import { Vec3 } from 'cannon';
import * as THREE from 'three';
import { Clock, Group, Material, Mesh, MeshPhongMaterial, Raycaster, Shader, ShaderMaterial, Vector2, Vector3 } from 'three';
import Character from './Character/Character';
import * as CANNON from 'cannon';
import Hotkeys from './Hotkeys/Hotkeys';
const canvas: HTMLCanvasElement = document.querySelector("#bg");
canvas.style.width = `${innerWidth}px`;
canvas.style.height = `${innerHeight}px`;
canvas.width = innerWidth;
canvas.height = innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
console.log("v2.1");//just to make sure on production mode ts compiled correctly (newest version)
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

var followCharacter = false;
var leftMouseDown = false;
canvas.onmousedown = (e) => {




}

// document.onpointerdown = (e) => {
//     panCameraStart();
// }
canvas.ontouchstart = (e) => {
    MouselastPos.x = e.touches[0].pageX;
    MouselastPos.y = e.touches[0].pageY;
    panCameraStart();
}
canvas.ontouchend = (e) => {
    // alert("touch end")
    joystick.ontouchend();
    leftMouseDown = false;
}
function panCameraStart() {
    // if (controls.enablePan)
    if (followCharacter && character.initialized) {
        followCharacter = false;
        // const { x, y, z } = character.mesh.position;
        // var disiredPosition = new Vector3(x, y, z).add(CURRENT_OFFSET_CAMERA)
        // camera.position.set(disiredPosition.x, disiredPosition.y, disiredPosition.z)
        alpha = 0;

        // controls.target.copy(character.position);
        // controls.update();
    }
    leftMouseDown = true;
    // canvas.requestPointerLock();
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
    // mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    // deltaPos.x = MouselastPos.x - e.pageX;
    // deltaPos.y = MouselastPos.y - e.pageY;
    // MouselastPos.x = e.pageX;
    // MouselastPos.y = e.pageY;
    // // camera.getWorldDirection(frontCam);
    // if (!followCharacter && leftMouseDown) {

    //     //x camera local axis logic
    //     camera.getWorldDirection(frontCam);
    //     leftCam = frontCam.cross(camera.up);
    //     leftCam = leftCam.normalize()
    //     camera.position.add(leftCam.multiplyScalar(deltaPos.x).multiplyScalar(CameraPanSpeed));

    //     //y camera local axis logic
    //     camera.getWorldDirection(frontCam);
    //     frontCam.y = 0;
    //     frontCam = frontCam.normalize()
    //     frontCam.multiplyScalar(deltaPos.y)
    //     frontCam.multiplyScalar(CameraPanSpeed);
    //     frontCam.multiplyScalar(-1.5);
    //     camera.position.add(frontCam);
    // }
    dragCamera(e);
}


//karena dragCamera pada ontouchmove hanya dipanggil saat user touch
//kalau  dragCamera pada onmousemove dipanggil terus walaupun tidak mouse down
document.ontouchmove = (e) => {
    dragCamera(e.touches[0]);
}
var touchPos = {
    x: 0,
    y: 0,
    isMoved: false
};
(document.querySelector("#outer_joystick") as HTMLDivElement).ontouchmove = (e) => {
    touchPos.x = e.touches[0].clientX;
    touchPos.y = e.touches[0].clientY;
    joystick.ontouchmove(touchPos.x, touchPos.y);
    followCharacter = true;
    touchPos.isMoved = true;
}

function dragCamera(e: Touch | MouseEvent) {
    // if(!leftMouseDown) return;
    // if (!e.clientX) {
    //     alert("welost");
    //     return;
    // }
    // if (e.touches[0]) {
    // return;
    // }
    if (MouselastPos.x == 0 && MouselastPos.y == 0) {
        MouselastPos.x = e.clientX;
        MouselastPos.y = e.clientY;
        return;
    }
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    deltaPos.x = MouselastPos.x - e.clientX;
    deltaPos.y = MouselastPos.y - e.clientY;
    MouselastPos.x = e.clientX;
    MouselastPos.y = e.clientY;
    // camera.getWorldDirection(frontCam);
    if (!followCharacter && leftMouseDown) {
        // console.log({pageX:e.pageX,pageY:e.pageY})
        //x camera local axis logic
        camera.getWorldDirection(frontCam);
        leftCam = frontCam.cross(camera.up);
        leftCam = leftCam.normalize()
        camera.position.add(leftCam.multiplyScalar(deltaPos.x).multiplyScalar(isMobile() ? 1.5 * 1.5 : 1).multiplyScalar(CameraPanSpeed));

        //y camera local axis logic
        camera.getWorldDirection(frontCam);
        frontCam.y = 0;
        frontCam = frontCam.normalize()
        frontCam.multiplyScalar(deltaPos.y)
        frontCam.multiplyScalar(CameraPanSpeed);
        frontCam.multiplyScalar(-1.5);
        frontCam.multiplyScalar(isMobile() ? 1.5 : 1);
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
const character = new Character(world, scene, camera, new Vector3(0, 20, 5), 25, true);
const roadStones = new RoadStones(scene)

const johansen = new Johansen(world, scene)

const trees = new Trees(world, scene)

const knowledge = new Knowledge(world, scene);

const billboards = new Billboards(world, scene, camera)

const digitRegocnition = new DigitRecognition(world, scene, camera, new THREE.Vector3(-50, 0.2, 50))

const contacts = new Contacts(world, scene, camera)
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
    else if (key == " ") {
    }
    else if (key == "z") {
        debug = !debug;
        return;
    }
    else if (key == "p") {
        // for placing trees purposes.
        console.log(`${character.position.x.toFixed(0)}, -5, ${character.position.z.toFixed(0)}`);
        return;

    }
    else if (key == "g") {
        const raycast3 = new Raycaster();
        raycast3.setFromCamera(mouse, camera);
        var intersects = raycast3.intersectObjects(scene.children)
        return;
    }
    else {
        return
    }
    character.isPress[key] = true;
    followCharacter = true;
    isCamUnderTransition = true;

}

var joystick = new Joystick(canvas, character);
joystick.followCharacter = () => { followCharacter = true; }
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
    // document.body.style.cursor = "grabbing";
    if (e.which == 1) {
        panCameraStart()

    }
    const raycast = new Raycaster();
    raycast.setFromCamera(mouse, camera);
    const intsCenterScreen = raycast.intersectObjects(scene.children);
    if (intsCenterScreen.length != 0) {
        console.log({ intsCenterScreen })
        return;
        // for (let i = 0; i < intsCenterScreen.length; i++) {
        //     const obj = intsCenterScreen[i];
        //     if (character.mesh.children[0].uuid != obj.object.uuid) {
        //         const mesh: Mesh = obj.object as any;
        //         if (Array.isArray(mesh.material)) {
        //             const material = mesh.material[0];
        //             var val = (material as ShaderMaterial).uniforms?._opacity?.value;
        //             // if (!val) continue;
        //             val -= 4 * deltatime;
        //             const opacity = clamp(val, 0.2, 1);
        //             setOpacity(mesh.parent as Group, scene.uuid, parseFloat(opacity.toFixed(2)));


        //             continue;
        //         }
        //         var val = (mesh.material as ShaderMaterial).uniforms?._opacity?.value;
        //         // if (!val) continue;
        //         val -= 4 * deltatime;
        //         const opacity = clamp(val, 0.2, 1);
        //         setOpacity(mesh.parent as Group, scene.uuid, parseFloat(opacity.toFixed(2)));
        //     }

        // }
    }

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
var alpha = 1;
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
import Joystick from './Joystick';
import isMobile from 'is-mobile';
var debug = false;
//

interface IHash<T> {
    [key: string]: T
}
const otherPlayers: IHash<Character> = {};
window.onresize = (e) => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(2)
    if (isMobile()) {
        joystick.show()
    }
    // renderer.setPixelRatio(window.innerWidth / window.innerHeight)
}
var cameraPos = new THREE.Vector3();
var cameraDir = new THREE.Vector3();
var lastPosCamUnfollPlayer = new THREE.Vector3(); // posisi kamera terakhir saat unfollow player
const raycast2 = new THREE.Raycaster();
var isCamUnderTransition = false; //saat follow character false -> true ini di set true sehingga kamera lookAt berpindah ke posisi karakter secara pelan-pelan
var alphaTransition = 0; // alpha used for lerp transition camera lookat target position
function animate() {
    deltatime = clock.getDelta()
    // if (deltatime < 0.2)
    // world.step(config.world.step,);
    // console.log({ deltatime })
    if (character.initialized && plane.initialized && initialized)
        world.step((1 / 60) * Math.min(0.1, deltatime) * 100);
    // world.step((1 / 60));
    // else return
    // console.log((1 / 60) * Math.min(0.1, deltatime) * 80)

    raycast.setFromCamera(mouse, camera);
    const intersects = raycast.intersectObjects(scene.children); // diakses oleh floor fence mesh

    if (!leftMouseDown)
        document.body.style.cursor = "grab";
    else
        document.body.style.cursor = "grabbing";
    //#region update mesh & body
    if (trees.initialized) {
        trees.setWaveEffect(waveEffect)
        trees.updateWaveEffect(deltatime)
        trees.update(deltatime)

        // console.log({ x, y, z });
    }
    if (contacts.initialized && character.initialized) {
        contacts.setWaveEffect(waveEffect)
        contacts.updateWaveEffect(deltatime)
        contacts.customUpdate(deltatime, character, intersects)

        // console.log({ x, y, z });
    }
    if (character.initialized) {
        // alert(camera.position.distanceTo(character.position))
        // character.setWaveEffect(waveEffect)
        if (isMobile())
            joystick.update(deltatime)
        // joystick.ontouchmove(touchPos.x, touchPos.y, deltatime)
        else {
            character.walk(deltatime);

        }
        touchPos.isMoved = false; //reset
        //leftmousedown digunakan nickname untuk mengubah durasi gsap
        character.update(deltatime, leftMouseDown, followCharacter); //customupdate karena tambah 1 parameter leftmousedown

    }
    if (hotkeys.initialized) {
        hotkeys.setWaveEffect(waveEffect)
        hotkeys.updateWaveEffect(deltatime)
        hotkeys.update(deltatime);

    }

    if (navigationBoards.initialized) {
        navigationBoards.setWaveEffect(waveEffect)
        navigationBoards.updateWaveEffect(deltatime)
        navigationBoards.update(deltatime)

    }
    if (lobby.initialized) {
        lobby.setWaveEffect(waveEffect)
        lobby.updateWaveEffect(deltatime)
        lobby.update(deltatime)
    }

    if (roadStones.initialized) {
        roadStones.setWaveEffect(waveEffect)
        roadStones.updateWaveEffect(deltatime)
        roadStones.update(deltatime)
    }

    if (johansen.initialized) {
        johansen.setWaveEffect(waveEffect)
        johansen.updateWaveEffect(deltatime)
        johansen.update(deltatime)
    }

    if (knowledge.initialized) {
        knowledge.setWaveEffect(waveEffect)
        knowledge.updateWaveEffect(deltatime)
        knowledge.update(deltatime)
    }

    if (billboards.initialized) {
        billboards.setWaveEffect(waveEffect)
        billboards.updateWaveEffect()
        billboards.updateBillboard(deltatime, character, intersects) // give intersects because contain popup mesh
    }

    if (digitRegocnition.initialized) {
        // digitRegocnition.setWaveEffect(waveEffect)
        digitRegocnition.update(deltatime, character, intersects) // give intersects because contain popup mesh
    }

    // console.log({ playercount: Object.keys(otherPlayers).length })
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

    // checking intersect mouse with objects
    if (character.initialized && loading.isFull && initialized && startHides) {
        camera.getWorldPosition(cameraPos)
        camera.getWorldDirection(cameraDir)

        var pos = character.mesh.position.clone();
        pos.project(camera);
        var posv2 = new Vector2(pos.x, pos.y);
        raycast2.setFromCamera(posv2, camera);
        //direverse sehingga mulai dari yang terjauh dulu
        const intsCenterScreen = raycast2.intersectObjects(scene.children).reverse();
        if (intsCenterScreen.length != 0) {
            if (intsCenterScreen.length != 1) {
                // console.log({ intsCenterScreen })
            }
            var isFrontCharacter = false; // intersects object itu arraynya sudah terurut dari distance yang paling dekat ke jauh
            //sehingga diiterasi mulai dari isFrontCharacter true -> ini diset sampai ketemu character bola.
            for (let i = 0; i < intsCenterScreen.length; i++) {
                const obj = intsCenterScreen[i];
                if (character.mesh.children[0].uuid == obj.object.uuid && !isFrontCharacter) {
                    isFrontCharacter = true;
                    // console.log({ isFrontCharacter })
                    continue;
                }
                if (!isFrontCharacter) continue;
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
    // console.log({ campos: camera.position });

    if (initialized) {
        if (waveEffect.range <= config.waveEffect.range.max) {
            waveEffect.range += deltatime * config.waveEffect.speed;
        }
    }

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
                // console.log({ alphaOffsetCamera_knowledge })
                //tambah 1 variable yaitu LAST_OFFSET_CAMARA -> INI TIDAK BOLEH BERUBAH VALUENYA SAMPAI TRANSISI SELESAI
                //diset tepat pertama x melakukan transisi(hanya 1x)
                CURRENT_OFFSET_CAMERA = new Vector3().copy(START_OFFSET_CAMERA).lerp(KNOWLEDGE_OFFSET_CAMERA, alphaOffsetCamera_knowledge);
            } else {
                offsetChanged = true;
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
            }
            else {
                offsetChanged = true;
            }
        }

        if (character.initialized) {
            const { x, y, z } = character.mesh.position;
            var disiredPosition = new Vector3(x, y, z).add(CURRENT_OFFSET_CAMERA)

            alpha += 1.5 * deltatime;
            // bila mau lebih smooth ganti lastPosCamUnfollPlayer dengan camera.position
            // tetapi cara itu tidak rekomen mengingat value camera.position berubah terus (padahal di lerp)
            const finalPosition = new Vector3().copy(lastPosCamUnfollPlayer).lerp(disiredPosition, clamp(alpha, 0, 1));
            camera.position.copy(finalPosition)
            if (clamp(alpha, 0, 1) >= 1) {
                // camera.lookAt(character.position); // lookAt juga perlu di lerp
                isCamUnderTransition = false;
            }
            else {
                // offsetChanged = false; // ini ketriggered membuat saat transisi kamera billbaord langsung rusak
            }
            alpha = clamp(alpha, 0, 1);
        }

        //bila offset posisi kamera sedang berubah maka camera lookAt harus diganti juga
        if (offsetChanged) {
            // character.position.angleTo(camera.position)
            camera.lookAt(character.position)
        }
        else {
            // camera.get
        }

    }
    else {
        alpha = 0.0;
        lastPosCamUnfollPlayer = camera.position.clone();

    }

    if (connection && connection.connected && character.body && connection.id && ticks >= 0.1) {
        console.log({ duration: _clock.getDelta().toFixed(4) })
        connection.send({ channel: "transform", id: connection.id, position: character.body.position, quaternion: character.body.quaternion });
        ticks = 0.0;
    }
    ticks += deltatime;
    if (initialized)
        renderer.render(scene, camera)
    requestAnimationFrame(animate);

}
const _clock = new Clock()

var ticks = 0.0;
// import { TweenLite } from 'gsap/all';
// const test = TweenLite.fromTo({x:0,y:0,z:0},durat)
animate();

const connection = new Connection();
window.onblur = () => {
    if (initialized && connection.connected) {
        connection.emit("blur", ({ position: character.body.position, quaternion: character.body.quaternion }));
    }
};
connection.onrecievePlayers = (players: IHash<any>) => {
    // if (character.initialized)
    character.nickname.text = connection.nickname;
    //rename each nickname otherplayer based on players
    for (let key in players) {
        if (key != connection.id) {
            otherPlayers[key].nickname.text = players[key].nickname ? players[key].nickname : `guest${players[key].guest_id}`;
        }
    }

}
// const joinButton: HTMLButtonElement = document.querySelector('#join');
// joinButton.onclick = () => {
// }
// var lastTween
connection.onrecieve = (e) => {
    // console.log(e.data)
    const message = JSON.parse(e.data);
    switch (message.channel) {
        case "transform":
            message.id = message.id.toString();
            if (!otherPlayers[message.id]) return;
            if (otherPlayers[message.id].lastTweenPos) {
                otherPlayers[message.id].lastTweenPos.pause();
                otherPlayers[message.id].lastTweenPos.kill();
            }
            if (otherPlayers[message.id].lastTweenRot) {
                otherPlayers[message.id].lastTweenRot.pause();
                otherPlayers[message.id].lastTweenRot.kill();
            }
            // otherPlayers[message.id].position.copy(message.position);
            otherPlayers[message.id].lastTweenPos = gsap.to(otherPlayers[message.id].position, {
                duration: 0.095,
                ...message.position,
                ease: Linear.easeNone,// ease: Back.easeOut.config(Config.waveEffect.overshoot),
                onComplete: () => {
                    // ref.addBody();
                    // ref.body.mass = ref.originMass;
                    // ref.body.updateMassProperties();
                    // ref.body.position.copy(ref.position)
                    // ref.body.updateMassProperties();

                }
            })
            otherPlayers[message.id].lastTweenRot = gsap.to(otherPlayers[message.id].body.quaternion, {
                duration: 0.095,
                ...message.quaternion,
                onUpdate: () => {
                    otherPlayers[message.id].body.angularVelocity.setZero()
                },
                ease: Linear.easeNone,
                // ease: Back.easeOut.config(Config.waveEffect.overshoot),
                onComplete: () => {
                    // ref.addBody();
                    // ref.body.mass = ref.originMass;
                    // ref.body.updateMassProperties();
                    // ref.body.position.copy(ref.position)
                    // ref.body.updateMassProperties();

                }
            })
            // otherPlayers[message.id].body.position.copy(message.position);
            // otherPlayers[message.id].mesh.quaternion.copy(message.quaternion);
            // otherPlayers[message.id].body.quaternion.copy(message.quaternion);
            otherPlayers[message.id].body.angularVelocity.setZero()
            // otherPlayers[message.id].mesh.position.copy(message.position);
            break;
        default:
            break;
    }
}
connection.onPlayerNameClick = (player: any, socketid: string) => {
    gotoPlayer(socketid);
}
connection.onnewplayer = async (id: string) => {
    otherPlayers[id] = (new Character(world, scene, camera, new Vector3(0, 150, 0), 0));
    otherPlayers[id].followWaveEffect = false;
    otherPlayers[id].nickname.text = connection.players[id].nickname ? connection.players[id].nickname : `guest${connection.players[id].guest_id}`;
    await otherPlayers[id].init();
    // otherPlayers[id].
    if (connection.players[id].lastPos) {
        const { x, y, z } = connection.players[id].lastPos;
        otherPlayers[id].position.set(x, y, z);
    }
    //do same with quaternion
    if (connection.players[id].lastQuaternion) {
        const { x: qx, y: qy, z: qz, w: qw } = connection.players[id].lastQuaternion;
        otherPlayers[id].body.quaternion.set(qx, qy, qz, qw);
    }

    otherPlayers[id].body.mass = 0;//not affected to gravity
}
connection.onleft = async (id: string) => {
    scene.remove(otherPlayers[id].mesh);
    world.remove(otherPlayers[id].body);
    otherPlayers[id].nickname.clear();
    delete otherPlayers[id];
}
var startWaveEffect = false;
const waveEffect: WaveEffect = {
    originPos: new Vector3(),
    range: config.waveEffect.range.start
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
    character.followWaveEffect = false;
    character.init().then(() => {
        loading.addProgress(2);
        console.log({ uuidcharacter: character.mesh.uuid })
    });
    johansen.init().then(() => {
        // loading.addProgress(5);

    })

    contacts.init().then(() => {
    })
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
    loading.hide()
    initialized = true;
    startHides = true;
    followCharacter = false;
    camera.position.set(25, 36.099988, 35);
    setTimeout(() => {
        startWaveEffect = true;
        connection.setFocus(connection.id);
    }, 500);
    setTimeout(() => {
        character.nickname.start();
    }, 1000);
    connection.connect();

    // waveEffect.range = 5000;ads
    //     setInterval(() => {
    //         waveEffect.range += 10;
    //     }, 500);
}
var startHides = false;
init();

import gsap, { Linear } from "gsap"
import Contacts from './Lobby/Contacts/Contacts';
function gotoPlayer(socketid: string) {
    if (socketid == connection.id) return; // yang dipencet username diri sendiri.
    const targetPosition = otherPlayers[socketid].position.clone();
    targetPosition.add(CURRENT_OFFSET_CAMERA);
    followCharacter = false;
    gsap.to(camera.position, {
        ...targetPosition,
        duration: 1,
        onComplete: () => {
        }
    });
}
