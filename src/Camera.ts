import * as THREE from "three";
import { Camera, Vector3 } from "three";


export default class _Camera {
    private _camera: Camera
    public position: Vector3;
    constructor(position: Vector3) {

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

        camera.quaternion.x = THREE.MathUtils.degToRad(-25)
        camera.quaternion.y = THREE.MathUtils.degToRad(15)


        camera.position.copy(position.add(OFFSET_CAMERA));
    }
}