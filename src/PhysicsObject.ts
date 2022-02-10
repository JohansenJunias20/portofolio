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
import createBody from "./utility/createBody";
import loadFBX from "./utility/loadFBX";
import loadOBJ from "./utility/loadOBJ";
import isFBX from "./utility/isFBX";
import isOBJ from "./utility/isOBJ";
//please load default custom shader here (only once)

export default class PhysicsObject3d {
    public asset: {
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
        additionalMesh?: THREE.Mesh[],
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
    public shape: CANNON.Shape | null;
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
        const { url, scale, mtl } = this.asset;
        const object = await (isFBX(url) ? loadFBX(url, scale) : loadOBJ(url, mtl, scale));
        this.position.y += 5;
        this.mesh = object;
        if (this.shapeType == "TRIMESH") {
            const temp: THREE.Mesh = this.mesh.children[0] as Mesh;
            this.shape = createBody(temp);
        }
        if (isOBJ(url))
            (this.shape as any).setScale(new CANNON.Vec3(10, 10, 10) as any)
        if (this.shapeType == "BOX")
            new THREE.Box3().setFromObject(object).getSize(size);

        this.body = new CANNON.Body({
            mass: this.mass, material: { friction: 1, restitution: 0, id: 1, name: "test" },
            shape: this.shapeType == "CUSTOM" ?
                this.shape :
                this.shapeType == "BOX" ?
                    new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)) :
                    this.shapeType == "TRIMESH" ?
                        this.shape :
                        new CANNON.Sphere(1)
        });
        this.body.position.set(this.position.x, this.position.y, this.position.z);
        this.PhysicsWorld.addBody(this.body);
        this.scene.add(this.mesh);

        //#region load floorShadow
        if (this.asset.floorShadow) {
            if (this.asset.floorShadow.preload) {
                // await this.loadFloorShadow();

                const newfloorShadow = this.asset.floorShadow.Mesh.clone();
                newfloorShadow.position.copy(this.position);
                newfloorShadow.position.add((this.asset.floorShadow.offset || new THREE.Vector3()));
                newfloorShadow.position.y = 0;
                this.mesh.children.push(newfloorShadow)
                // this.mesh.children.push(newfloorShadow);
            }
            else
                await this.loadFloorShadow();

        }
        //#endregion

        //adding additional mesh if available
        if (!this.asset.additionalMesh) {
            this.initialized = true;
            return;
        }
        if (this.asset.additionalMesh.length == 0) {
            this.initialized = true;
            return;
        }
    
        if (!this.text) {
            this.initialized = true;
            return;
        }
        if (this.text != "ts" && this.text != "golang") {
            this.initialized = true;
            return;
        }
        // this.asset.additionalMesh[0].position.set(0, 0, 0);
        // this.mesh.children.push(this.asset.additionalMesh[0]);
        // this.asset.additionalMesh[0].position.copy(this.position);
        // console.log({ addmesh: this.asset.additionalMesh[0] })
        // this.asset.additionalMesh[0].scale.copy(object.scale);
        this.mesh.add(...this.asset.additionalMesh)

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
