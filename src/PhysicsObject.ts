import { Group, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as CANNON from 'cannon';
import * as THREE from "three";


export default class PhysicsObject3d {
    protected asset: {
        url: string;
        scale: THREE.Vector3;
        recieveShadow?: boolean;
        castShadow: boolean;
    }
    protected PhysicsWorld: CANNON.World;
    public initialized: boolean;
    public mesh: THREE.Group;
    public readonly position: Vector3;
    public scene: THREE.Scene;
    public movementSpeed: number;
    public body: CANNON.Body;
    public shapeType: "BOX" | "SPHERE" | "CUSTOM";
    private shape: CANNON.Shape | null;
    public readonly mass: number;
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, movementSpeed = 10, shapeType: "BOX" | "SPHERE" | "CUSTOM", mass: number, shape: null | CANNON.Shape = null) {
        this.PhysicsWorld = world;
        this.scene = scene;
        this.initialized = false;
        this.position = position;
        this.movementSpeed = movementSpeed;
        this.shapeType = shapeType;
        this.shape = shape;
        this.mass = mass;
    }
    protected async init() {
        await this.loadAsset();
    }
    public update(deltatime: number) {
        this.walk(deltatime);
        this.mesh.position.copy(this.position);

        this.updatePhysics(deltatime);
    }
    protected walk(deltatime: number) {

    }
    private async loadAsset() {
        const fbx = await new Promise<Group>((res, rej) => {
            const loader = new FBXLoader();
            loader.load(this.asset.url, (f) => {
                f.traverse(c => {
                    c.castShadow = this.asset.castShadow;
                    if (this.asset.recieveShadow != undefined)
                        c.receiveShadow = this.asset.recieveShadow;
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
        var size = new THREE.Vector3();
        new THREE.Box3().setFromObject(fbx).getSize(size);
        this.body = new CANNON.Body({ mass: this.mass, material: { friction: 1, restitution: 1, id: 1, name: "test" }, shape: this.shapeType == "CUSTOM" ? this.shape : this.shapeType == "BOX" ? new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)) : new CANNON.Sphere(1) });
        this.body.position.set(this.position.x, this.position.y, this.position.z);
        console.log(this.asset.url)
        console.log(this.position)
        this.PhysicsWorld.addBody(this.body);

        this.initialized = true;
    }
    private updatePhysics(deltatime: number) {
        this.position.copy(new Vector3(this.body.position.x, this.body.position.y, this.body.position.z));
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}