import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Wrapper from "../Wrapper";
import Word from "./word";


export default class Johansen extends Wrapper<Word>{
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        super()
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
  
}