

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Color, Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class Billboard {
    private asset: {
        url: string;
        scale: THREE.Vector3;
        recieveShadow?: boolean;
        castShadow: boolean;
        mtl?: string
    }
    private PhysicsWorld: CANNON.World;
    public initialized: boolean;
    public mesh: THREE.Object3D;
    public readonly position: Vector3;
    public scene: THREE.Scene;
    public movementSpeed: number;
    // public body: CANNON.Body;
    private shape: CANNON.Shape | null;
    public readonly mass: number;
    text: string
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, text: "coffee") {
        this.text = text;
        // this.asset.url = `/assets/environment/portofolio/billboard_${text}.fbx`;   this.PhysicsWorld = world;
        this.scene = scene;
        this.initialized = false;
        this.position = position;

        this.mass = 0;
        this.PhysicsWorld = world;
        this.asset = {
            url: `/assets/environment/portofolio/billboard_${text}.obj`,
            mtl: `/assets/environment/portofolio/billboard_${text}.mtl`,
            castShadow: false,
            scale: new THREE.Vector3(0.15, 0.15, 0.15)
        }
    }
    public async init() {
        await this.loadAsset();
    }
    public update(deltatime: number) {
        this.walk(deltatime);
        this.mesh.position.copy(this.position);

        // this.updatePhysics(deltatime);
    }
    protected walk(deltatime: number) {

    }
    private async loadAsset() {
        var size = new THREE.Vector3();

     
        this.position.y += 5;
        // this.mesh = fbx;
        const texture = await new THREE.TextureLoader().loadAsync(`/assets/environment/portofolio/coffee.jpg`);


        const geometry = new THREE.PlaneGeometry(3, 3);

        // const material = new THREE.MeshStandardMaterial({
        //     map: texture,
        //     side: THREE.DoubleSide,
        //     emissiveMap: texture,
        //     emissiveIntensity: 5,
        //     emissive: new Color(0.1, 0.1, 0.1)
        // });
        const material = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide,
            lightMap:texture,
        });
        const plane = new THREE.Mesh(geometry, material);
        // plane.scale.x = 10
        // plane.scale.y = 10
        this.scene.add(plane);
        this.mesh = plane;
        new THREE.Box3().setFromObject(plane).getSize(size);

        // this.body =
        //     new CANNON.Body({
        //         mass: this.mass, material: { friction: 1, restitution: 0.3, id: 1, name: "test" },
        //         shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2))
        //     });
        // this.body.position.set(this.position.x, this.position.y, this.position.z);
        // this.PhysicsWorld.addBody(this.body);

        this.initialized = true;
    }
    private updatePhysics(deltatime: number) {
        // this.position.copy(new Vector3(this.body.position.x, this.body.position.y, this.body.position.z));
        // this.mesh.quaternion.copy(this.body.quaternion);

    }

}