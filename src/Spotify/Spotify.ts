import { Vector3 } from "three";
import Character from "../Character/Character";
import Wrapper from "../Wrapper";
import DJMixer from "./DJMixer";
import SpotifyFloor from "./SpotifyFloor";


export default class Spotify extends Wrapper<SpotifyFloor | DJMixer>{
    constructor(scene: THREE.Scene, world: CANNON.World, position: THREE.Vector3, camera: THREE.PerspectiveCamera, character: Character) {
        super();
        this.keys = [
            new SpotifyFloor(world, scene, camera, position, character),
            new DJMixer(world, scene, position.clone())
        ]
    }
}