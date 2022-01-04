import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import PopUp from "./PopUp";


export default class PopUps {
    keys: Array<PopUp>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new PopUp(world, scene, new Vector3(0.0, 15.0, 0.0), {
                x: 15, y: 2, z: 8
            },0.3)
        ];

    }
    public async init() {
        this.initialized = true;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}