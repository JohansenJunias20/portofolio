import { Vec3 } from 'cannon';
import * as THREE from 'three';
import { TorusBufferGeometry, Vector3, WebGLRenderer } from 'three';
import Character from './Character';
import * as CANNON from 'cannon';

const canvas: HTMLCanvasElement = document.querySelector("#bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)



const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg")
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

// camera.position.setZ(100)
camera.position.setY(50)
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
const material = new THREE.MeshPhongMaterial({ color: "#EDA37C", side: THREE.DoubleSide, shininess: 25 });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = (THREE.MathUtils.degToRad(-90))
scene.add(plane);


const box2Geometry = new THREE.BoxGeometry(3, 3, 3);
const box2material = new THREE.MeshPhongMaterial({ color: "lightred", side: THREE.DoubleSide, shininess: 20 });
const box2 = new THREE.Mesh(box2Geometry, box2material);
box2.position.x = 0 + 20;
box2.position.z = 0 - 10;
scene.add(box2);

const box1Geometry = new THREE.BoxGeometry(3, 3, 3);
const box1material = new THREE.MeshPhongMaterial({ color: "lightred", side: THREE.DoubleSide, shininess: 20 });
const box1 = new THREE.Mesh(box1Geometry, box1material);
box1.position.x = 0 + 10;
box1.position.z = 0 - 10;
box1.position.y = 1;
scene.add(box1);

const box1Body = new CANNON.Body({ mass: 1, shape: new CANNON.Box(new Vec3(1.5, 1.5, 1.5)) });
box1Body.position.copy(box1.position);

const SUN = new THREE.DirectionalLight(0xffffff, 0.9)
SUN.position.set(0, 300, 0)
scene.add(SUN)

const world = new CANNON.World();
world.gravity.set(0, -10, 0);
world.broadphase = new CANNON.NaiveBroadphase(); //metode physics
world.solver.iterations = 40; //fps

const groundBody = new CANNON.Body({ mass: 0, material: { friction: 1, restitution: 0.1, id: 1, name: "test" }, shape: new CANNON.Box(new Vec3(sizeGround.x, 0.1, sizeGround.z)) });

world.addBody(box1Body)
world.addBody(groundBody);
const character = new Character(world, scene, new Vector3(0, 0, 0));
character.init();








canvas.onclick = (e) => {
    canvas.requestPointerLock();
}
const speed = 1;
function animate() {
    requestAnimationFrame(animate);



    character.update();

    box1.position.copy(box1Body.position)
    box1.quaternion.copy(box1Body.quaternion)

    // camera.position.x = character.position.x + 30;
    camera.position.copy(character.position);
    camera.position.y += 50;
    camera.position.z += 30;
    camera.lookAt(character.position);
    // character.render();
    renderer.render(scene, camera)
}

animate();