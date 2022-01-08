import * as THREE from "three";
import { Vector3 } from "three";
import Key from "./Key";


export default class Hotkeys {
    keys: Array<Key>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene, HOTKEYSPOSITION: Vector3) {
        this.keys = [
            new Key(world, scene, new Vector3().copy(HOTKEYSPOSITION).add(new Vector3(4, 0, 0)), "D"),
            new Key(world, scene, new Vector3().copy(HOTKEYSPOSITION).add(new Vector3(-4, 0, 0)), "A"),
            new Key(world, scene, new Vector3().copy(HOTKEYSPOSITION).add(new Vector3(0, 0, 0)), "S"),
            new Key(world, scene, new Vector3().copy(HOTKEYSPOSITION).add(new Vector3(0, 0, -4)), "W")
        ];
        
    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
        }
        this.initialized = true;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}