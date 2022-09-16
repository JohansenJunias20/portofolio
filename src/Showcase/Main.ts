import { Vector3 } from "three";
import Wrapper from "../Wrapper"
import Projector from "./Projector"
import * as CANNON from 'cannon';
import LightCast from "./LightCast";
import ImageSequence from "./ImageSequence";
import Loading from "../Loading/Loading";
import Desc from "./Desc";
interface IParameterMainProjector {
    position: Vector3;
    scene: THREE.Scene;
    world: CANNON.World;
    camera: THREE.PerspectiveCamera;
}
export default class Main extends Wrapper<Projector | LightCast | Desc>{
    image: ImageSequence;
    scene: THREE.Scene
    constructor({ scene, world, position, camera }: IParameterMainProjector) {
        super()
        // var desc_position = ;
        this.keys = [
            new Projector({ position, rotationDeg: 0, scale: new Vector3(1, 1, 1), scene, world, shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)) }),
            new LightCast({ position: position.clone().add(new Vector3(0, -15.5, 0)), rotationDeg: 0, scale: new Vector3(1, 1, 1), scene, world, shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)) }),
            new Desc(scene, position.clone().add(new Vector3(2, 0, -14)).setY(0), `/assets/environment/projector/showcase_desc.png`),
            new Desc(scene, position.clone().add(new Vector3(-10.5, 0.6, 0)), `/assets/environment/projector/click_me.png`, 0, 90, new Vector3(255 / 255, 255 / 255, 255 / 255)),
        ];
        this.scene = scene;
        // this.image = new ImageSequence(scene, position.clone().add(new Vector3(-10.6,-4,0)));
        this.image = new ImageSequence(scene, position.clone().add(new Vector3(-10.6, -4, 0)), camera);
    }
    public async init(loading?: Loading, onEachInitialized?: (key: Projector | LightCast) => void): Promise<void> {
        var promises: Promise<any>[] = [];
        var promise = super.init(loading, onEachInitialized);
        promises.push(promise);
        promise = this.image.init();
        promises.push(promise);
        await Promise.all(promises);
        this.initialized = true;
        //only lightcast because lightcast always the fastest load
        this.scene.add(this.keys[1].mesh);
        // (this.keys[3].mesh as any).isBlooming = true;
    }
    public update(deltatime: number): void {
        super.update(deltatime);
        this.image.update(deltatime);
    }

}