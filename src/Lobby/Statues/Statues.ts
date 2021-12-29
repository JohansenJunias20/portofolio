import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Statue from "./Statue";


export default class Statues {
    keys: Array<Statue>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new Statue(world, scene, new Vector3(-20, -3, 25), "waving"),
            new Statue(world, scene, new Vector3(20, -3, 25), "dab"),
            new Statue(world, scene, new Vector3(20, -3, 65), "style"),
            new Statue(world, scene, new Vector3(-20, -3, 65), "clapping"),
        ];

    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
            // key.mesh.rotateY(degToRad(-90));
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