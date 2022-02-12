import PhysicsObject3d from "../PhysicsObject";
import Wrapper from "../Wrapper";
import Statues from "./Statues/Statues";



export default class Lobby extends Wrapper<any> {
    keys: Array<Statues>
    // Statues: Statues
    initialized: boolean
    // RoadStones:RoadStones
    constructor(world: CANNON.World, scene: THREE.Scene) {
        super()
        this.keys = [
            new Statues(world, scene)
        ]
        this.initialized = false;
    }

}