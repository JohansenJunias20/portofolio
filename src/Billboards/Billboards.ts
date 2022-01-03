import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Billboard from "./Billboard";


export default class Billboards {
    keys: Array<Billboard>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new Billboard(world, scene, new Vector3(0, 5, 0), "coffee")
        ];

    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
            // key.body.quaternion.copy(key.mesh.quaternion)
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