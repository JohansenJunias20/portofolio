import { Float32BufferAttribute, Group, Mesh, MeshLambertMaterial, MeshPhongMaterial, ShaderMaterial, TextureLoader, Uint8ClampedBufferAttribute, Vector2, Vector3 } from "three";
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
import gsap from "gsap"
import defaultFrag from '../public/assets/shaders/default.frag';
import defaultVert from '../public/assets/shaders/default.vert';
import shadowVert from '../public/assets/shaders/floorShadow.vert';
import shadowFrag from '../public/assets/shaders/floorShadow.frag';
import createBody from "./utility/createBody";
import loadFBX from "./utility/loadFBX";
import loadOBJ from "./utility/loadOBJ";
import isFBX from "./utility/isFBX";
import isOBJ from "./utility/isOBJ";
import { WaveEffect } from "./waveEffect";
import { Back, Bounce, Elastic, Power2, Sine } from "gsap/all";
//please load default custom shader here (only once)

export default class PhysicsObject3d {
    public waveEffect: WaveEffect
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
    public position: Vector3; // current posisi mesh.
    public originPosition: Vector3; // posisi saat disurface
    public spawnPosition: Vector3; //posisi saat berada diundergrond
    public scene: THREE.Scene;
    public alphaSpawn: number;
    public movementSpeed: number;
    public body: CANNON.Body;
    public shapeType: "BOX" | "SPHERE" | "CUSTOM" | "TRIMESH";
    public shape: CANNON.Shape | null;
    public originMass: number;
    floorShadowModel: THREE.Group;
    isSpawned: boolean;
    public followWaveEffect: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, movementSpeed = 10, shapeType: "TRIMESH" | "BOX" | "SPHERE" | "CUSTOM", mass: number, shape: null | CANNON.Shape = null) {
        this.PhysicsWorld = world;
        this.scene = scene;
        this.initialized = false;
        this.position = position;
        this.movementSpeed = movementSpeed;
        this.shapeType = shapeType;
        this.shape = shape;
        this.followWaveEffect = true;
        if (this.key) {
            console.log({ poskey: this.position })
        }
        this.originPosition = new THREE.Vector3()
        this.originPosition.copy(position);
        this.originPosition.y += 5;
        this.spawnPosition = new THREE.Vector3(); //posisi saat berada diundergrond
        this.waveEffect = {
            originPos: new Vector3(),
            range: 0
        }
        this.originMass = mass;
        this.alphaSpawn = 0;
        this.isSpawned = false;
    }

    public async init() {
        await this.loadAsset();
        this.prepare();
        this.initialized = true;
    }
    public updateWaveEffect(deltatime: number) {
        const ref = this;
        if (!this.followWaveEffect) return;
        if (this.isSpawned) return;
        if (this.mesh.position.distanceTo(this.waveEffect.originPos) < this.waveEffect.range) {
            if (ref.key == "W") {
                console.log({ pos: ref.position })
                console.log({ originPosition: ref.originPosition })
            }
            //lerp from underground to surface.
            this.alphaSpawn += 2 * deltatime;
            gsap.to(this.position, {
                duration: 1,
                ...this.originPosition,
                ease: Back.easeOut.config(2),
                onComplete: () => {
                    ref.addBody();
                    // ref.body.mass = ref.originMass;
                    // ref.body.updateMassProperties();
                    // ref.body.position.copy(ref.position)
                    // ref.body.updateMassProperties();

                }
            })
            // this.position.copy(new Vector3().copy(this.spawnPosition).lerp(this.originPosition, clamp(this.alphaSpawn, 0, 1)));
            // this.position.copy(this.originPosition);
            this.isSpawned = true;
            // console.log({ spawnpos: this.spawnPosition })
        }
    }
    public update(deltatime: number) {
        this.walk(deltatime);
        this.mesh.position.copy(this.position);
        this.resetOpacity(deltatime);
        this.updatePhysics(deltatime);
    }
    protected walk(deltatime: number) {
    }
    public async loadAsset() {
        var size = new THREE.Vector3();
        const { url, scale, mtl } = this.asset;
        const ref = this;
        var promises = [];
        // var object: THREE.Group;
        var object: THREE.Group = await (isFBX(url) ? loadFBX(url, scale) : loadOBJ(url, mtl, scale));
        // promises.push((async () => { object = await (isFBX(url) ? loadFBX(url, scale) : loadOBJ(url, mtl, scale)) })())
        var floorShadowModel: THREE.Group;
        if (this.asset.floorShadow && !this.asset.floorShadow.preload) {
            promises.push((async () => { ref.floorShadowModel = await ref.loadFloorShadow() })())
        }
        await Promise.all(promises);
        this.mesh = object;



    }
    public size: THREE.Vector3;
    private addBody() {
        this.body = new CANNON.Body({
            mass: this.originMass, material: { friction: 1, restitution: 0, id: 1, name: "test" },
            shape: this.shapeType == "CUSTOM" ?
                this.shape :
                this.shapeType == "BOX" ?
                    new CANNON.Box(new CANNON.Vec3(this.size.x / 2, this.size.y / 2, this.size.z / 2)) :
                    this.shapeType == "TRIMESH" ?
                        this.shape :
                        new CANNON.Sphere(1)
        });
        this.body.position.set(this.position.x, this.position.y, this.position.z);
        this.body.quaternion.set(this.mesh.quaternion.x, this.mesh.quaternion.y, this.mesh.quaternion.z, this.mesh.quaternion.w);
        this.PhysicsWorld.addBody(this.body);
    }
    public prepare() {
        const { url, scale, mtl } = this.asset;
        const ref = this;
        this.size = new THREE.Vector3()
        // this.position.y += 5;

        if (this.shapeType == "TRIMESH") {
            const temp: THREE.Mesh = this.mesh.children[0] as Mesh;
            this.shape = createBody(temp);
        }
        if (isOBJ(url))
            (this.shape as any).setScale(new CANNON.Vec3(10, 10, 10) as any)

        new THREE.Box3().setFromObject(ref.mesh).getSize(this.size);

        if (!this.followWaveEffect) this.addBody();
        // this.body = new CANNON.Body({
        //     mass: this.followWaveEffect ? 0 : this.originMass, material: { friction: 1, restitution: 0, id: 1, name: "test" },
        //     shape: this.shapeType == "CUSTOM" ?
        //         this.shape :
        //         this.shapeType == "BOX" ?
        //             new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)) :
        //             this.shapeType == "TRIMESH" ?
        //                 this.shape :
        //                 new CANNON.Sphere(1)
        // });
        // this.body.position.set(this.position.x, this.position.y, this.position.z);
        // this.PhysicsWorld.addBody(this.body);

        this.scene.add(this.mesh);
        if (this.floorShadowModel) // ini ditaruh setelah create body karena bila tidak maka floorshadowmodel akan juga dibuatkan body
            this.mesh.children.push(this.floorShadowModel);

        //#region load floorShadow
        if (this.asset.floorShadow) {
            if (this.asset.floorShadow.preload) {

                const newfloorShadow = this.asset.floorShadow.Mesh.clone();
                newfloorShadow.position.copy(this.position);
                newfloorShadow.position.add((this.asset.floorShadow.offset || new THREE.Vector3()));
                newfloorShadow.position.y = 0;
                this.scene.add(newfloorShadow)
                this.floorShadowModel = newfloorShadow as THREE.Group;
            }

        }
        //#endregion


        this.spawnPosition.copy(this.position);
        this.spawnPosition.y = this.position.y - this.size.y;
        this.position.copy(this.spawnPosition);
        this.mesh.position.copy(this.position);

        //adding additional mesh if available
        if (!this.asset.additionalMesh) {
            this.initialized = true;
            return;
        }
        if (this.asset.additionalMesh.length == 0) {
            this.initialized = true;
            return;
        }

        this.mesh.add(...this.asset.additionalMesh)

    }
    private async loadFloorShadowModel(material: THREE.ShaderMaterial) {
        const ref = this;
        const object = await new Promise<Group>((res, rej) => {
            var objLoader = new OBJLoader();
            objLoader.load(ref.asset.floorShadow.modelUrl == "" ? ref.asset.floorShadow.modelUrl : "/assets/floorShadow.obj", function (object) {
                object.traverse((c: THREE.Mesh) => {
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
        var promises = [];
        var texture: THREE.Texture;
        const ref = this;
        if (typeof this.asset.floorShadow.textureUrl === 'string' || this.asset.floorShadow.textureUrl instanceof String)
            promises.push((async () => { texture = await new TextureLoader().loadAsync(ref.asset.floorShadow.textureUrl as string) })())
        else {
            texture = this.asset.floorShadow.textureUrl;
        }
        const material = new ShaderMaterial({
            depthWrite: false,
            vertexShader: shadowVert,
            fragmentShader: shadowFrag,
            uniforms: {
                textureMap: {
                    value: null
                },
                _opacity: {
                    value: 1
                }
            },
            transparent: true
        })
        var model: THREE.Group;
        promises.push((async () => { model = await ref.loadFloorShadowModel(material) })())
        await Promise.all(promises);

        model.children.forEach((c: Mesh) => {
            if (c.isMesh) {
                (c.material as ShaderMaterial).uniforms.textureMap.value = texture;
            }
        })
        return model;
        // this.scene.add(model);

    }
    private updatePhysics(deltatime: number) {
        if (!this.body) return;
        if (this.body.mass == 0) {
            this.body.position.copy(this.position as any);
        }
        else {
            this.position.copy(new Vector3(this.body.position.x, this.body.position.y, this.body.position.z));
        }
        if (this.key == "W")
            console.log({ pos: this.position.y })
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

}
