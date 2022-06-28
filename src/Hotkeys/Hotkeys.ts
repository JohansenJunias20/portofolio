import * as THREE from "three";
import { Vector3 } from "three";
import Wrapper from "../Wrapper";
import Key from "./Key";


export default class Hotkeys extends Wrapper<Key>{
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene, HOTKEYSPOSITION: Vector3) {
        super();
        this.keys = [
            new Key(world, scene, new Vector3().copy(HOTKEYSPOSITION).add(new Vector3(4, -5, 0)), "D"),
            new Key(world, scene, new Vector3().copy(HOTKEYSPOSITION).add(new Vector3(-4, -5, 0)), "A"),
            new Key(world, scene, new Vector3().copy(HOTKEYSPOSITION).add(new Vector3(0, -5, 0)), "S"),
            new Key(world, scene, new Vector3().copy(HOTKEYSPOSITION).add(new Vector3(0, -5, -4)), "W"),
            new Key(world, scene, new Vector3().copy(HOTKEYSPOSITION).add(new Vector3(0, -5, 6)), "SPACE"),

        ];

    }
    
}