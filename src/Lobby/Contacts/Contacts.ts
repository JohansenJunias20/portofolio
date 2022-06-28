import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Character from "../../Character";
import Wrapper from "../../Wrapper";
import Contact from "./Contact";


export default class Contacts extends Wrapper<Contact> {
    keys: Array<Contact>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        super()
        this.keys = [
            new Contact(world, scene, camera, new Vector3(10, -5,-25), "linkedin", "https://www.linkedin.com/in/johansen-junias-203b111bb/"),
            new Contact(world, scene, camera, new Vector3(20, -5, -25), "github", "https://github.com/JohansenJunias20"),
        ];

    }
    public customUpdate(deltatime: number, character: Character, intersect: THREE.Intersection<THREE.Object3D<THREE.Event>>[]): void {
        this.keys.forEach(key => {
            key.customUpdate(deltatime, character, intersect);
        })
    }

}