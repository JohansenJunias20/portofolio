import * as THREE from "three";
import { ShaderMaterial, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import MeshOnlyObject3d from "../MeshOnlyObject";
import vertexShader from "../../public/assets/shaders/image.vert";
import fragShader from "../../public/assets/shaders/image.frag";

export default class ImageSequence {
    material: THREE.ShaderMaterial;
    position: THREE.Vector3;
    scene: THREE.Scene;
    constructor(scene: THREE.Scene, position: THREE.Vector3) {
        // super(scene, position);
        var loader = new THREE.TextureLoader();
        var material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: fragShader,
            uniforms: {
                textureMap: {
                    value: loader.load('/assets/environment/projector/thumbnail.jpg'),
                }
            },

        });
        this.scene = scene;
        this.position = position;
        this.material = material;
        this.currentImage = 0;
    }
    images: THREE.Texture[];
    public async init() {
        var loader = new THREE.TextureLoader();
        var scale = 1.4;
        var imageCount = 102;
        var promises: Promise<THREE.Texture>[] = []
        for (let i = 0; i < imageCount; i++) {
            var promise = loader.loadAsync(`/assets/environment/projector/Reaksi portofolio dari WPU${i.toString().padStart(4, "0")}.jpg`);
            promises.push(promise);
        }
        this.images = await Promise.all(promises);
        var planeGeom = new THREE.PlaneGeometry(10 * scale, 10 * .56 * scale);
        var plane = new THREE.Mesh(planeGeom, this.material);
        plane.position.copy(this.position);
        plane.rotateY(degToRad(90));
        this.mesh = plane;
        (this.mesh as any).isBlooming = true;
        this.scene.add(plane);
        this.initialized = true;
    }
    mesh: THREE.Mesh;
    initialized: boolean = false;
    currentImage: number;
    public intervalUpdate = 1 / 15;
    private elapsedTime = 0;
    public update(deltatime: number) {
        this.elapsedTime += deltatime;
        if (this.elapsedTime <= this.intervalUpdate) return;
        if (!this.initialized) return;
        var index = this.currentImage % this.images.length;
        var image = this.images[index];
        (this.mesh.material as ShaderMaterial).uniforms.textureMap.value = image;
        (this.mesh.material as ShaderMaterial).needsUpdate = true;

        this.currentImage++;
        if (this.currentImage % this.images.length == 0 && this.currentImage != 0) {
            this.currentImage = 0;
        }
        this.elapsedTime = 0;
    }
}