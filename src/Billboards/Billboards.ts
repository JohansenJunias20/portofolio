import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Billboard from "./Billboard";


export default class Billboards {
    keys: Array<Billboard>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new Billboard(world, scene, new Vector3(50, 0, 40), "miles madness",new Vector3(0.5,0.5,0.5))
        ];

    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
            // key.body.quaternion.copy(key.mesh.quaternion)
        }
        this.initialized = true;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}