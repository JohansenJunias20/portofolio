import { Float32BufferAttribute, Group, Mesh, MeshLambertMaterial, MeshPhongMaterial, ShaderMaterial, TextureLoader, Uint8ClampedBufferAttribute, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as CANNON from 'cannon';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { clamp, degToRad } from "three/src/math/MathUtils";
import setOpacity from "./utility/setOpacity";
interface IPhysicsObject3dConstructor {
    world: CANNON.World,
    scene: THREE.Scene,
    position: Vector3,
    movementSpeed?: number,
    shapeType: "TRIMESH" | "BOX" | "SPHERE" | "CUSTOM",
    mass: number, shape?: CANNON.Shape
}

import defaultFrag from '../public/assets/shaders/default.frag';
import defaultVert from '../public/assets/shaders/default.vert';
import shadowVert from '../public/assets/shaders/floorShadow.vert';
import shadowFrag from '../public/assets/shaders/floorShadow.frag';
//please load default custom shader here (only once)

export default class PhysicsObject3d {
    protected asset: {
        url: string;
        scale: THREE.Vector3;
        recieveShadow?: boolean;
        castShadow: boolean;
        floorShadow?: {
            textureUrl: string | THREE.Texture;
            modelUrl: string;
            scale?: THREE.Vector3
            offset?: THREE.Vector3;
            Mesh?: THREE.Mesh | THREE.Group; // ada valuenya bila preload = true karena mesh sudah diload
            preload?: boolean // artinya model shadow sudah selesai diload jadi tidak perlu this.loadfloorshadow() lagi saat init dipanggil
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
        this.resetOpacity(deltatime);

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
                    for (let i = 0; i < f.children.length; i++) {
                        const c: Mesh = f.children[i] as any;
                        if (c.isMesh) {
                            c.castShadow = this.asset.castShadow;
                            const oldMat: any = c.material;
                            if (Array.isArray(oldMat)) {
                                for (let i = 0; i < oldMat.length; i++) {
                                    var element: any = oldMat[i];
                                    element = ref.customShader(element.color);
                                }
                            }
                            else
                                c.material = ref.customShader(oldMat.color);
                            if (this.asset.recieveShadow != undefined)
                                c.receiveShadow = this.asset.recieveShadow;
                        }
                    }

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
                objLoader.load(ref.asset.url, async function (object) {
                    for (let i = 0; i < object.children.length; i++) {
                        const c: Mesh = object.children[i] as any;
                        if (c.isMesh) {
                            c.castShadow = ref.asset.castShadow;
                            if (Array.isArray(c.material)) {
                                for (let i = 0; i < c.material.length; i++) {
                                    c.material[i] = (await ref.customShader((c as any).material[i].color)) as any;
                                }

                            }
                            else {
                                c.material = await ref.customShader((c.material as MeshPhongMaterial).color)
                            }

                        }
                    }

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
            if (this.asset.floorShadow.preload) {
                this.asset.floorShadow.Mesh.position.copy(this.position);
                this.asset.floorShadow.Mesh.position.add((this.asset.floorShadow.offset || new THREE.Vector3()));
                this.asset.floorShadow.Mesh.position.y = 0;
                const newfloorShadow = this.asset.floorShadow.Mesh.clone();
                this.mesh.children.push(newfloorShadow);
            }
            else
                await this.loadFloorShadow();

        }
        //#endregion
        this.initialized = true;
    }
    private async loadFloorShadowModel(material: THREE.ShaderMaterial) {
        const ref = this;
        const object = await new Promise<Group>((res, rej) => {
            var objLoader = new OBJLoader();
            objLoader.load(ref.asset.floorShadow.modelUrl == "" ? ref.asset.floorShadow.modelUrl : "/assets/floorShadow.obj", function (object) {
                object.traverse(async (c: THREE.Mesh) => {
                    if (c.isMesh) {
                    }
                    c.material = material;
                    return c;
                })
                object.scale.copy(ref.asset.floorShadow.scale ? ref.asset.floorShadow.scale : new Vector3(11, 0, 11))
                res(object)
            });
        });

        object.position.copy(this.position);
        object.position.add((this.asset.floorShadow.offset || new THREE.Vector3()));
        object.position.y = 0;
        return object;

    }
    private async loadFloorShadow() {
        var texture: THREE.Texture;
        if (typeof this.asset.floorShadow.textureUrl === 'string' || this.asset.floorShadow.textureUrl instanceof String)
            texture = await new TextureLoader().loadAsync(this.asset.floorShadow.textureUrl as string);
        else {
            texture = this.asset.floorShadow.textureUrl;
        }


        const material = new ShaderMaterial({
            depthWrite: false,
            vertexShader: shadowVert,
            fragmentShader: shadowFrag,
            uniforms: {
                textureMap: {
                    value: texture
                },
                _opacity: {
                    value: 1
                }
            },
            transparent: true
        })
        const model = await this.loadFloorShadowModel(material);
        this.mesh.children.push(model);
        // this.scene.add(model);

    }
    private updatePhysics(deltatime: number) {
        this.position.copy(new Vector3(this.body.position.x, this.body.position.y, this.body.position.z));
        this.mesh.quaternion.copy(this.body.quaternion as any);

    }
    private resetOpacity(deltatime: number) {
        // return
        const meshChild = (this.mesh.children.find(({ type }) => type == "Mesh") as THREE.Mesh) as any;
        if (Array.isArray(meshChild.material)) {
            if (meshChild.material[0].uniforms?.hasOwnProperty('_opacity')) {
                const opacity = meshChild.material[0].uniforms._opacity.value;
                setOpacity(this.mesh as THREE.Group, this.scene.uuid,
                    clamp(opacity ? parseFloat(opacity) + (1.5 * deltatime) : 1, 0.2, 1));
            }
        }
        else {
            if (meshChild.material.uniforms?.hasOwnProperty('_opacity')) {
                const opacity = meshChild.material.uniforms._opacity.value;
                setOpacity(this.mesh as THREE.Group, this.scene.uuid,
                    clamp(opacity ? parseFloat(opacity) + (1.5 * deltatime) : 1, 0.2, 1));
            }
        }
    }
    private customShader(color: THREE.ColorRepresentation) {
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
                },
                _opacity: {
                    value: 1
                }
            },
            lights: true,
            transparent: true,
            // defines:{'LAMBERT'}
            vertexShader: defaultVert,
            fragmentShader: defaultFrag
        })

    }
}
