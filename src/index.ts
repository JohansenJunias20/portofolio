import { Vec3 } from 'cannon';
import * as THREE from 'three';
import { AmbientLight, TorusBufferGeometry, Vector3, WebGLRenderer } from 'three';
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

// scene.add(box2);

// const box1Geometry = new THREE.BoxGeometry(3, 3, 3);
// const box1material = new THREE.MeshToonMaterial({ color: "lightred", side: THREE.DoubleSide });
// const box1 = new THREE.Mesh(box1Geometry, box1material);
// // box1.position.x = 0 + 10;
// box1.position.z = 0 - 10;
// box1.position.y = 10;
// box1.castShadow = true;
// box1.traverse(obj => {
//     obj.castShadow = true;
// })
// scene.add(box1);

// const box1Body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new Vec3(1.5, 1.5, 1.5)) });
// box1Body.position.copy(box1.position);

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
const character = new Character(world, scene, new Vector3(0, 0, -10));
character.init();







canvas.onclick = (e) => {
    canvas.requestPointerLock();
}
const speed = 1;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.shadowMap = true;

const OFFSET_CAMERA = new Vector3(15, 35, 50);

camera.position.copy(character.position)
camera.position.copy(camera.position.add(OFFSET_CAMERA));

const HOTKEYSPOSITION = new Vector3(-5, 1, 5);

const hotkeys = new Hotkeys(world, scene, HOTKEYSPOSITION);
hotkeys.init();

var deltatime = 0;
var start = 0;
function animate() {

    requestAnimationFrame(animate);

    if (character.initialized)
        character.update(deltatime);

    if (hotkeys.initialized)
        hotkeys.update(deltatime);


    // box1.position.copy(box1Body.position)
    // box1.quaternion.copy(box1Body.quaternion)
    const { x, y, z } = character.mesh.position;
    var disiredPosition = new Vector3(x, y, z).add(OFFSET_CAMERA)
    const finalPosition = new Vector3().lerpVectors(camera.position, disiredPosition, 1);

    camera.position.copy(finalPosition)
    camera.lookAt(character.position);


    renderer.render(scene, camera)

    deltatime = Date.now() - start
    start = Date.now();
}

animate();