import Loading from "../Loading/Loading";
import PhysicsObject3d from "../PhysicsObject";
import { WaveEffect } from "../waveEffect";
import Wrapper from "../Wrapper";
import Statues from "./Statues/Statues";



export default class Lobby {
    keys: Array<Statues>
    // Statues: Statues
    initialized: boolean
    // RoadStones:RoadStones
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new Statues(world, scene)
        ]
        this.initialized = false;
    }
    async init() {
        await this.keys[0].init();
        this.initialized = true;
    }
    setWaveEffect(waveEffect: WaveEffect) {
        this.keys[0].setWaveEffect(waveEffect);
    }
    updateWaveEffect() {
        this.keys[0].updateWaveEffect();
    }
    update(deltatime: number) {
        this.keys[0].update(deltatime);
    }

}