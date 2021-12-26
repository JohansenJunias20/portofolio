import { Group, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as CANNON from 'cannon';


export default class Object3d {
    protected asset: {
        url: string;
        scale: THREE.Vector3;
        castShadow: boolean;
    }
    protected PhysicsWorld: CANNON.World;
    public initialized: boolean;
    protected mesh: THREE.Group;
    public position: Vector3;
    public scene: THREE.Scene;
    public movementSpeed: number;
    protected body: CANNON.Body;
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, movementSpeed = 10) {
        this.PhysicsWorld = world;
        this.scene = scene;
        this.initialized = false;
        this.position = position;
        this.movementSpeed = movementSpeed;
    }
    protected async init() {
        await this.loadAsset();
    }
    public update() {
        this.mesh.position.copy(this.position);
        this.updatePhysics();

    }
    private async loadAsset() {
        console.log("initializing..")
        console.log(this.asset)
        const fbx = await new Promise<Group>((res, rej) => {
            const loader = new FBXLoader();
            loader.load(this.asset.url, (f) => {
                f.traverse(c => {
                    c.castShadow = this.asset.castShadow;
                    return c;
                })
                f.scale.x = this.asset.scale.x;
                f.scale.y = this.asset.scale.y;
                f.scale.z = this.asset.scale.z;
                res(f);
            })
        })
        this.scene.add(fbx);

        this.position.y += 5;
        this.mesh = fbx;
        this.scene.add(fbx);
        this.body = new CANNON.Body({ mass: 3, material: { friction: 1, restitution: 1, id: 1, name: "test" }, shape: new CANNON.Sphere(1) });
        this.PhysicsWorld.addBody(this.body);
        this.body.position.set(this.position.x, this.position.y, this.position.z);

        this.initialized = true;
        console.log("initialized")
    }
    private updatePhysics() {
        this.PhysicsWorld.step(1 / 60);
        this.position.copy(new Vector3(this.body.position.x, this.body.position.y, this.body.position.z));
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}