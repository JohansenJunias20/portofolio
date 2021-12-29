import * as THREE from "three";
import { Triangle, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import RoadStone from "./RoadStone";


export default class RoadStones {
    keys: Array<RoadStone>;
    initialized: boolean;
    constructor(scene: THREE.Scene) {
        this.keys = [
            new RoadStone(scene, new Vector3(0, -4.9,22)),
            new RoadStone(scene, new Vector3(-20, -4.9,45)),
            new RoadStone(scene, new Vector3(20, -4.9,45)),
            new RoadStone(scene, new Vector3(0, -4.9,65)),
        ];

    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
            key.mesh.receiveShadow = true
        }
        this.keys[0].mesh.rotateY(degToRad(-90));
        this.keys[3].mesh.rotateY(degToRad(-90));
        this.initialized = true;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}