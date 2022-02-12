import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Wrapper from "../../Wrapper";
import Statue from "./Statue";


export default class Statues extends Wrapper<Statue> {
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        super()
        this.keys = [
            new Statue(world, scene, new Vector3(-20, -3, 25), "waving"),
            new Statue(world, scene, new Vector3(20, -3, 25), "dab"),
            new Statue(world, scene, new Vector3(20, -3, 65), "style"),
            new Statue(world, scene, new Vector3(-20, -3, 65), "clapping"),
        ];

    }
}