import * as THREE from "three";
import { Triangle, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Loading from "../../Loading/Loading";
import Wrapper from "../../Wrapper";
import RoadStone from "./RoadStone";


export default class RoadStones extends Wrapper<RoadStone>{
    keys: Array<RoadStone>;
    initialized: boolean;
    constructor(scene: THREE.Scene) {
        super();
        this.keys = [
            new RoadStone(scene, new Vector3(0, -4.9, 22)),
            new RoadStone(scene, new Vector3(-20, -4.9, 45)),
            new RoadStone(scene, new Vector3(20, -4.9, 45)),
            new RoadStone(scene, new Vector3(0, -4.9, 65)),
        ];

    }
    public async init() {
        await super.init();
        this.keys[0].mesh.rotateY(degToRad(-90));
        this.keys[3].mesh.rotateY(degToRad(-90));
        this.initialized = true;
    }
}