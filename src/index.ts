import { Vec3 } from 'cannon';
import * as THREE from 'three';
import { AmbientLight, Clock, TorusBufferGeometry, Vector3, WebGLRenderer } from 'three';
import Character from './Character';
import * as CANNON from 'cannon';
import Key from './Hotkeys/Key';
import Hotkeys from './Hotkeys/Hotkeys';
const ENABLE_SHADOW = true;
const canvas: HTMLCanvasElement = document.querySelector("#bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)



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
console.log({ temp })

const sizeGround = {
    x: 1000,
    z: 1000
}

const geometry = new THREE.PlaneGeometry(sizeGround.x, sizeGround.z);
const material = new THREE.MeshToonMaterial({ color: "#EDA37C", side: THREE.FrontSide });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = (THREE.MathUtils.degToRad(-90))
plane.receiveShadow = true;
scene.add(plane);

const SUN = new THREE.DirectionalLight(0xffffff, 0.5)
SUN.position.set(0, 500, 0)
SUN.shadow.camera.visible = ENABLE_SHADOW;
SUN.castShadow = ENABLE_SHADOW;
SUN.shadow.camera.near = 0.1;
SUN.shadow.camera.far = 1000;
const sizeAreaShadow = 50;
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
const character = new Character(world, scene, new Vector3(0, 0, 0));
character.init();






var followCharacter = true;
canvas.onmousedown = (e) => {
    if (e.which == 1) {
        if (followCharacter) {

            followCharacter = false;
            const { x, y, z } = character.mesh.position;
            var disiredPosition = new Vector3(x, y, z).add(OFFSET_CAMERA)
            // const finalPosition = new Vector3().lerpVectors(camera.position, disiredPosition, 1);
            camera.position.set(disiredPosition.x, disiredPosition.y, disiredPosition.z)
            // camera.lookAt(character.position);
            controls.target.copy(character.position);
            controls.update();
        }
        // canvas.requestPointerLock();
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

const OFFSET_CAMERA = new Vector3(15, 35, 50);

camera.position.copy(character.position)
camera.position.add(OFFSET_CAMERA)

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { clamp } from 'three/src/math/MathUtils';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableRotate = false;
controls.mouseButtons = {
    LEFT: THREE.MOUSE.RIGHT,
    RIGHT: THREE.MOUSE.LEFT,
    MIDDLE: THREE.MOUSE.MIDDLE,
}


const HOTKEYSPOSITION = new Vector3(-5, 1, 5);

const hotkeys = new Hotkeys(world, scene, HOTKEYSPOSITION);
hotkeys.init();

var deltatime = 0;
var start = 0;
var alpha = 0;
var cameraInitialized = false;
const clock = new Clock()
function animate() {
    deltatime = clock.getDelta()
    requestAnimationFrame(animate);

    if (character.initialized) {
        character.update(deltatime);
        // if (!cameraInitialized) {
        //     camera.lookAt(character.position);
        //     controls.target = character.position;
        //     controls.update();
        //     cameraInitialized = true;
        // }
    }

    if (hotkeys.initialized)
        hotkeys.update(deltatime);

    if (followCharacter) {

        const { x, y, z } = character.mesh.position;
        var disiredPosition = new Vector3(x, y, z).add(OFFSET_CAMERA)

        alpha += deltatime * 0.3
        const finalPosition = new Vector3().copy(camera.position).lerp(disiredPosition, clamp(alpha, 0, 1));
        console.log(clamp(alpha, 0, 1))
        camera.position.copy(finalPosition)
        if(clamp(alpha,0,1) >= 1)
        camera.lookAt(character.position); // lookAt juga perlu di lerp

    }
    else {
        alpha = 0.0;
    }
    renderer.render(scene, camera)

}

animate();