import Wrapper from "../Wrapper";
import DJMixer from "./DJMixer";
import SpotifyFloor from "./SpotifyFloor";


export default class Spotify extends Wrapper<SpotifyFloor | DJMixer>{
    constructor(scene: THREE.Scene, world: CANNON.World, position: THREE.Vector3) {
        super();
        this.keys = [
            new SpotifyFloor(scene, position),
            new DJMixer(world, scene, position)
        ]
    }
}