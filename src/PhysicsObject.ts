import { Float32BufferAttribute, Group, Uint8ClampedBufferAttribute, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as CANNON from 'cannon';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import getVertices from "./utility/getVertices";
export default class PhysicsObject3d {
    protected asset: {
        url: string;
        scale: THREE.Vector3;
        recieveShadow?: boolean;
        castShadow: boolean;
        mtl?: string
    }
    protected PhysicsWorld: CANNON.World;
    public initialized: boolean;
    public mesh: THREE.Object3D;
    public readonly position: Vector3;
    public scene: THREE.Scene;
    public movementSpeed: number;
    public body: CANNON.Body;
    public shapeType: "BOX" | "SPHERE" | "CUSTOM" | "TRIMESH" | "CONVEX";
    private shape: CANNON.Shape | null;
    public readonly mass: number;
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, movementSpeed = 10, shapeType: "TRIMESH" | "BOX" | "SPHERE" | "CUSTOM" | "CONVEX", mass: number, shape: null | CANNON.Shape = null) {
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
        var size = new THREE.Vector3();

        if (this.asset.url.indexOf(".fbx") > -1) {

            const fbx = await new Promise<THREE.Object3D>((res, rej) => {
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


            new THREE.Box3().setFromObject(fbx).getSize(size);
            if (this.shapeType == "TRIMESH") {
                console.log({ mesh: this.mesh })
                const vertices = this.mesh.children[0].geometry.attributes.position.array;
                const indices = Object.keys(vertices).map(Number);
                this.shape = new CANNON.Trimesh(vertices, indices);
            }
            if (this.shapeType == "CONVEX") {
                console.log({ mesh: this.mesh })
                const vertices = this.mesh.children[0].geometry.attributes.position.array;
                const faces = []
                for (let i = 0; i < vertices.length / 3; i += 3) {
                    faces.push([i, i + 1, i + 2])
                }
                this.shape = new CANNON.ConvexPolyhedron(vertices, faces);
            }
            this.body =
                new CANNON.Body({
                    mass: this.mass, material: { friction: 1, restitution: 0.3, id: 1, name: "test" },
                    shape: this.shapeType == "CUSTOM" ? this.shape :
                        this.shapeType == "BOX" ? new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)) :
                            this.shapeType == "TRIMESH" ? this.shape :
                                new CANNON.Sphere(1)
                });
            this.body.position.set(this.position.x, this.position.y, this.position.z);
            this.PhysicsWorld.addBody(this.body);
        }
        else {
            const ref = this;
            const mtlLoader = new MTLLoader();
            const mtl = await mtlLoader.loadAsync(this.asset.mtl);
            const object = await new Promise<Group>((res, rej) => {

                var objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load(ref.asset.url, function (object) {
                    object.traverse(c => {
                        if(c.isMesh){
                            c.castShadow = ref.asset.castShadow;
                            // c.receiveShadow = ref.asset.recieveShadow;
                        }
                        // return c;
                    })
                    object.scale.copy(ref.asset.scale)
                    res(object)
                });
            });
            this.mesh = object;
            console.log({ mesh: this.mesh.children })

            if (this.shapeType == "TRIMESH") {
                const vertices = this.mesh.children[0].geometry.attributes.position.array;
                const indices = Object.keys(vertices).map(Number);
                this.shape = new CANNON.Trimesh(vertices, indices);
                this.shape.setScale(new CANNON.Vec3(10, 10, 10))
                console.log("set scaled")
                this.position.y += 5;
            }
            else if (this.shapeType == "CONVEX") {
                console.log({ geometry: this.mesh.children[0].geometry })
                const oldScale = this.mesh.children[0].geometry.scale;
                this.mesh.children[0].geometry.scale.x = 20;
                this.mesh.children[0].geometry.scale.y = 20;
                this.mesh.children[0].geometry.scale.z = 20;
                const vertices = this.mesh.children[0].geometry.attributes.position.array;
                const faces = []
                const points = []
                for (let i = 0; i < vertices.length; i += 3) {
                    points.push(new CANNON.Vec3(vertices[i], vertices[i + 1], vertices[i + 2]))
                }
                for (let i = 0; i < vertices.length / 3; i += 3) {
                    faces.push([i, i + 1, i + 2])
                }
                this.shape = new CANNON.ConvexPolyhedron(points, faces);
                // this.shape.setScale(new CANNON.Vec3(10, 10, 10))
                this.position.y += 5;
                this.mesh.children[0].geometry.scale.x = oldScale.x;
                this.mesh.children[0].geometry.scale.y = oldScale.y;
                this.mesh.children[0].geometry.scale.z = oldScale.z;
            }



            // this.shape = new CANNON.Trimesh(vertices as unknown as number[], indices)
            console.log({ shape: this.shape })

            // object.scale.multiplyScalar(10)
            // new THREE.Box3().setFromObject(object).getSize(size);
            this.body =
                new CANNON.Body({
                    mass: this.mass, material: { friction: 1, restitution: 1, id: 1, name: "test" },
                    shape: this.shapeType == "CUSTOM" ? this.shape :
                        this.shapeType == "BOX" ? new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)) :
                            this.shapeType == "TRIMESH" ? this.shape : new CANNON.Sphere(1)
                });
            this.body.position.set(this.position.x, this.position.y, this.position.z);
            this.PhysicsWorld.addBody(this.body);
            this.scene.add(object);
        }
        this.initialized = true;
    }
    private updatePhysics(deltatime: number) {
        this.position.copy(new Vector3(this.body.position.x, this.body.position.y, this.body.position.z));
        this.mesh.quaternion.copy(this.body.quaternion);

    }
}