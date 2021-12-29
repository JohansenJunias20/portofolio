import PhysicsObject3d from "../PhysicsObject";
import Statues from "./Statues/Statues";



export default class Lobby {
    Statues: Statues
    initialized: boolean
    // RoadStones:RoadStones
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.Statues = new Statues(world, scene);
        this.initialized = false;
    }
    async init() {
        await this.Statues.init();
        this.initialized = true;
    }
    update(deltatime: number) {
        this.Statues.update(deltatime);
    }

}