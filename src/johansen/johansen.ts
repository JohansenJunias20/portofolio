import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Word from "./word";


export default class Johansen {
    keys: Array<Word>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new Word(world, scene, new Vector3(0.5, 0, -10), "J"),
            new Word(world, scene, new Vector3(4, 0, -10), "O"),
            new Word(world, scene, new Vector3(8, 0, -10), "H"),
            new Word(world, scene, new Vector3(12, 0, -10), "A"),
            new Word(world, scene, new Vector3(16, 0, -10), "N"),
            new Word(world, scene, new Vector3(19.5, 0, -10), "S"),
            new Word(world, scene, new Vector3(23, 0, -10), "E"),
            new Word(world, scene, new Vector3(26.5, 0, -10), "N"),
        ];

    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
            key.body.quaternion.copy(key.mesh.quaternion as any)
            key.mesh.receiveShadow = false
            key.mesh.castShadow = true
        }
        this.initialized = true;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}