import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import DB from "./DB";


export default class DBs {
    keys: Array<DB>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new DB(world, scene, new Vector3(10, -5, 100), "redis"),
            new DB(world, scene, new Vector3(10, -5, 120), "mongo"),
        ];

    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
            key.mesh.rotateY(degToRad(-45));
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