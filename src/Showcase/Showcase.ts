import { Vector3 } from "three";
import Wrapper from "../Wrapper"
import Projector from "./Projector"
import * as CANNON from 'cannon';
import LightCast from "./LightCast";
import ImageSequence from "./ImageSequence";
import Loading from "../Loading/Loading";
import Desc from "./Desc";
interface IImageSequenceParameter {
    imageLength: number;
    image_path: string;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    position: Vector3
}
interface IParameterShowcaseProjector {
    position: Vector3;
    scene: THREE.Scene;
    world: CANNON.World;
    camera: THREE.PerspectiveCamera;
    name: ShowcaseName;
    imageCount: number;
    url:string;
}
export type ShowcaseName = "WPU" | "MRPRT"

export default class Showcase extends Wrapper<Projector | LightCast | Desc>{
    image: ImageSequence;
    scene: THREE.Scene
    name: ShowcaseName;
    constructor({ scene, world, position, camera, name, imageCount,url }: IParameterShowcaseProjector) {
        super()
        this.name = name;
        // var desc_position = ;
        this.keys = [
            new Projector({ position, rotationDeg: 0, scale: new Vector3(1, 1, 1), scene, world, shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)) }),
            new LightCast({ position: position.clone().add(new Vector3(0, -15.5, 0)), rotationDeg: 0, scale: new Vector3(1, 1, 1), scene, world, shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)) }),
            new Desc(scene, position.clone().add(new Vector3(2, 0, -14)).setY(0), `/assets/environment/Showcase/${name}/showcase_desc.png`),
            new Desc(scene, position.clone().add(new Vector3(-10.5, 0.6, 0)), `/assets/environment/projector/click_me.png`, 0, 90, new Vector3(255 / 255, 255 / 255, 255 / 255)),
        ];
        this.scene = scene;
        // this.image = new ImageSequence(scene, position.clone().add(new Vector3(-10.6,-4,0)));
        this.image = new ImageSequence(scene, position.clone().add(new Vector3(-10.6, -4, 0)), camera, name, imageCount,url);
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