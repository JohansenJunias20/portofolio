import { Float32BufferAttribute, Group, Mesh, MeshLambertMaterial, MeshPhongMaterial, ShaderMaterial, TextureLoader, Uint8ClampedBufferAttribute, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as CANNON from 'cannon';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import getVertices from "./utility/getVertices";
import { degToRad } from "three/src/math/MathUtils";
interface IPhysicsObject3dConstructor {
    world: CANNON.World,
    scene: THREE.Scene,
    position: Vector3,
    movementSpeed?: number,
    shapeType: "TRIMESH" | "BOX" | "SPHERE" | "CUSTOM",
    mass: number, shape?: CANNON.Shape
}
export default class PhysicsObject3d {
    protected asset: {
        url: string;
        scale: THREE.Vector3;
        recieveShadow?: boolean;
        castShadow: boolean;
        floorShadow?: {
            textureUrl: string;
            modelUrl: string;
        };
        mtl?: string
    }
    protected PhysicsWorld: CANNON.World;
    public initialized: boolean;
    public mesh: THREE.Object3D;
    public readonly position: Vector3;
    public scene: THREE.Scene;
    public movementSpeed: number;
    public body: CANNON.Body;
    public shapeType: "BOX" | "SPHERE" | "CUSTOM" | "TRIMESH";
    private shape: CANNON.Shape | null;
    public readonly mass: number;
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, movementSpeed = 10, shapeType: "TRIMESH" | "BOX" | "SPHERE" | "CUSTOM", mass: number, shape: null | CANNON.Shape = null) {
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
        const ref = this;
        if (this.asset.url.indexOf(".fbx") > -1) {

            const fbx = await new Promise<THREE.Object3D>((res, rej) => {
                const loader = new FBXLoader();
                loader.load(this.asset.url, (f) => {
                    f.traverse(async (c: Mesh) => {
                        if (c.isMesh) {

                            c.castShadow = this.asset.castShadow;
                            const oldMat: any = c.material;
                            if (Array.isArray(oldMat)) {
                                for (let i = 0; i < oldMat.length; i++) {
                                    var element: any = oldMat[i];
                                    element = await ref.customShader(element.color);
                                }
                                // oldMat.forEach((mat, index) => {
                                //     mat = new THREE.MeshLambertMaterial({
                                //         color: oldMat[index].color,
                                //         // map: oldMat.map,
                                //         //etc
                                //     });
                                // });
                            }
                            else
                                c.material = await ref.customShader(oldMat.color);
                            if (this.asset.recieveShadow != undefined)
                                c.receiveShadow = this.asset.recieveShadow;
                        }
                        return c;
                    })
                    f.scale.x = this.asset.scale.x;
                    f.scale.y = this.asset.scale.y;
                    f.scale.z = this.asset.scale.z;
                    res(f);
                })
            })
            // console.log({ fbx: fbx.children.map(child => child.material) })
            this.scene.add(fbx);
            this.position.y += 5;
            this.mesh = fbx;


            new THREE.Box3().setFromObject(fbx).getSize(size);
            if (this.shapeType == "TRIMESH") {
                const temp: THREE.Mesh = this.mesh.children[0] as THREE.Mesh;
                const vertices = temp.geometry.attributes.position.array;
                const indices = Object.keys(vertices).map(Number);
                this.shape = new CANNON.Trimesh(vertices as number[], indices);
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
                    object.traverse(async (c: THREE.Mesh) => {
                        if (c.isMesh) {
                            c.castShadow = ref.asset.castShadow;
                            const oldMat: MeshPhongMaterial | MeshPhongMaterial[] = c.material as MeshPhongMaterial | MeshPhongMaterial[];
                            if (Array.isArray(oldMat)) {
                                for (let i = 0; i < oldMat.length; i++) {
                                    var element: MeshPhongMaterial | ShaderMaterial = oldMat[i];
                                    element = await ref.customShader(element.color);
                                }
                                // oldMat.forEach(asyn(mat: THREE.MeshLambertMaterial | THREE.MeshPhongMaterial, index) => {
                                //     mat = new THREE.MeshLambertMaterial({
                                //         color: oldMat[index].color,
                                //         // map: oldMat.map,
                                //         //etc
                                //     });
                                // });
                            }
                            else {
                                c.material = await ref.customShader(oldMat.color)
                            }
                            // c.material = new THREE.MeshLambertMaterial({
                            //     color: oldMat.color,
                            //     // map: oldMat.map,
                            //     //etc
                            // });
                            // c.receiveShadow = ref.asset.recieveShadow;
                        }
                        return c;
                    })
                    object.scale.copy(ref.asset.scale)
                    res(object)
                });
            });
            this.mesh = object;

            if (this.shapeType == "TRIMESH") {
                const temp: THREE.Mesh = this.mesh.children[0] as Mesh;
                const vertices = temp.geometry.attributes.position.array;
                const indices = Object.keys(vertices).map(Number);
                this.shape = new CANNON.Trimesh(vertices as number[], indices);
                const tempShape: any = this.shape;
                tempShape.setScale(new CANNON.Vec3(10, 10, 10) as any)
                this.position.y += 5;
            }



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

        //#region load floorShadow
        if (this.asset.floorShadow) {
            await this.loadFloorShadow();
        }
        //#endregion
        this.initialized = true;
    }
    private async loadFloorShadowModel(material: THREE.ShaderMaterial) {
        const ref = this;
        const object = await new Promise<Group>((res, rej) => {
            var objLoader = new OBJLoader();
            objLoader.load(ref.asset.floorShadow.modelUrl, function (object) {
                object.traverse(async (c: THREE.Mesh) => {
                    if (c.isMesh) {
                    }
                    c.material = material;
                    return c;
                })
                object.scale.copy(new Vector3(11, 11, 11))
                res(object)
            });
        });
        // var box = new THREE.Box3().setFromObject(this.mesh);
        // var size = new THREE.Vector3();
        // box.getSize(size);
        // const geom = new THREE.PlaneBufferGeometry(size.x, size.z);
        // const object = new THREE.Mesh(geom, material);
        console.log({ scale: ref.asset.scale })
        // object.scale.copy(ref.asset.scale);
        object.position.copy(this.position);
        // object.position.copy(new Vector3(0, 0, 0));
        object.position.y = 0;
        // object.rotateX(degToRad(-90))
        return object;

    }
    private async loadFloorShadow() {
        // alert(`loading floor shadow ${this.asset.floorShadow.textureUrl}`)
            console.log({textureUrl:this.asset.floorShadow.textureUrl})
            const texture = await new TextureLoader().loadAsync(this.asset.floorShadow.textureUrl);
      
        const material = new ShaderMaterial({
            vertexShader: await (await fetch(`/assets/shaders/floorShadow.vert`)).text(),
            fragmentShader: await (await fetch(`/assets/shaders/floorShadow.frag`)).text(),
            uniforms: {
                textureMap: {
                    value: texture
                }
            },
            transparent: true
        })
        const model = await this.loadFloorShadowModel(material);
        this.scene.add(model);

    }
    private updatePhysics(deltatime: number) {
        this.position.copy(new Vector3(this.body.position.x, this.body.position.y, this.body.position.z));
        this.mesh.quaternion.copy(this.body.quaternion as any);

    }
    private async customShader(color: THREE.ColorRepresentation) {
        return new THREE.ShaderMaterial({
            uniforms: {
                ...THREE.UniformsLib["common"],
                ...THREE.UniformsLib["fog"],
                ...THREE.UniformsLib["lights"],
                ...THREE.UniformsLib["bumpmap"],
                ...THREE.UniformsLib["displacementmap"],
                ...THREE.UniformsLib["normalmap"],
                diffuse: {
                    value: color
                }
            },
            lights: true,
            // defines:{'LAMBERT'}
            vertexShader: await (await fetch("/assets/shaders/default.vert"))?.text(),
            fragmentShader: await (await fetch("/assets/shaders/default.frag"))?.text()
        })

    }
}
