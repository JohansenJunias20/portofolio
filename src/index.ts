import * as THREE from 'three';
import { TorusBufferGeometry, WebGLRenderer } from 'three';

const canvas: HTMLCanvasElement = document.querySelector("#bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)



const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg")
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

// camera.position.setZ(100)
camera.position.setY(100)
renderer.render(scene, camera)

const geometry = new THREE.PlaneGeometry(1000, 1000);
const material = new THREE.MeshPhongMaterial({ color: "#EDA37C", side: THREE.DoubleSide, shininess: 25 });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);


const boxGeometry = new THREE.BoxGeometry(50, 50);
const boxmaterial = new THREE.MeshPhongMaterial({ color: "red", side: THREE.DoubleSide, shininess: 50 });
const box = new THREE.Mesh(boxGeometry, boxmaterial);
scene.add(box);

const SUN = new THREE.DirectionalLight(0xffffff, 0.9)
SUN.position.set(0, 300, 0)
scene.add(SUN)

var mousePos = {
    x: 0,
    y: 0
}
const sensitivity = 0.002;
canvas.onmousemove = (e) => {
    const diffX = mousePos.x - e.pageX;
    const diffY = mousePos.y - e.pageY;
    camera.rotateY(-e.movementX * sensitivity)
    camera.rotateX(-e.movementY * sensitivity)
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;
}

const speed = 1;
var currentMove: "w" | "a" | "s" | "d" | null = null;
document.onkeydown = (e) => {
    if (e.key == "w") {
        currentMove = "w"
        return;
    }
    else if (e.key == "s") {
        currentMove = "s";
        return;
    }
}

document.onkeyup = (e) => {
    if (e.key == "w") {
    }
    else if (e.key == "s") {
    }
    else {
        return;
    }
    currentMove = null;
}


canvas.onclick = (e) => {
    canvas.requestPointerLock();
}

function animate() {
    requestAnimationFrame(animate);
    if (currentMove) {
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        switch (currentMove) {
            case "w":
                camera.position.add(direction.multiplyScalar(speed));
                break;

            case "a":
                camera.position.add(direction.multiplyScalar(speed));
                break;

            case "s":
                camera.position.sub(direction.multiplyScalar(speed));
                break;

            case "d":
                camera.position.add(direction.multiplyScalar(speed));
                break;

            default:
                break;
        }
    }

    renderer.render(scene, camera)
}

animate();