import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Word from "./Word";


export default class Johansen {
    keys: Array<Word>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new Word(world, scene, new Vector3(0, 7, -11), "J", new Vector3(0.07, 0.055, 0.07)),
            new Word(world, scene, new Vector3(4.5, 7, -10), "O"),
            new Word(world, scene, new Vector3(10, 7, -10), "H"),
            new Word(world, scene, new Vector3(15, 7, -10), "A"),
            new Word(world, scene, new Vector3(19.5, 7, -10), "N", new Vector3(0.05, 0.07, 0.07)),
            new Word(world, scene, new Vector3(23, 7, -10), "S"),
            new Word(world, scene, new Vector3(26, 7, -10), "E"),
            new Word(world, scene, new Vector3(30, 7, -10), "N", new Vector3(0.05, 0.07, 0.07)),
        ];

    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
            key.body.quaternion.copy(key.mesh.quaternion)
            key.mesh.receiveShadow = false
        }
        this.initialized = true;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}