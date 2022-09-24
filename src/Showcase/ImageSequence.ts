import * as THREE from "three";
import { Raycaster, ShaderMaterial, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import MeshOnlyObject3d from "../MeshOnlyObject";
import vertexShader from "../../public/assets/shaders/image.vert";
import fragShader from "../../public/assets/shaders/image.frag";
import Modal from "../Modal";
import gsap, { Linear } from "gsap"

export default class ImageSequence {
    material: THREE.ShaderMaterial;
    position: THREE.Vector3;
    scene: THREE.Scene;
    modal: Modal;
    private isAnimating: boolean;
    constructor(scene: THREE.Scene, position: THREE.Vector3, camera: THREE.PerspectiveCamera) {
        // super(scene, position);
        this.isAnimating = false
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

        const canvas = document.querySelector("#bg");
        const raycast = new Raycaster();
        const mouse = new THREE.Vector2();
        const ref = this;
        this.refCamera = camera;
        canvas.addEventListener('click', (e: PointerEvent) => {
            if (!this.initialized) return;
            if (!this.mesh) return;
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
            raycast.setFromCamera(mouse, camera);
            const intersects = raycast.intersectObjects(scene.children);
            for (let i = 0; i < intersects.length; i++) {
                const intersect = intersects[i];
                if (intersect.object.uuid == this.mesh.uuid) {
                    if (this.isAnimating) return;
                    // document.onblur(e);
                    var audio: HTMLAudioElement = document.querySelector("#sound");
                    // console.log("audio play")
                    audio.volume = 0;
                    this.isAnimating = true;
                    //disable all input keyboard
                    (window as any).disableInput = true;
                    const modal = new Modal(
                        `<button id="closeModal" style="cursor:pointer;position:fixed;top:0;right:0;z-index:3;margin:2rem;padding:5px;font-weight:bold;font-size:3rem; background-color:rgb(245,206,66)">CLOSE</button><iframe style="width:100%;height:100%" src="https://www.youtube.com/embed/pjDYyyMh4rM?start=3997&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
                        "full");
                    const ref = this;
                    this.camera = {
                        originalPos: camera.position.clone(),
                        originalRotation: camera.rotation.clone()
                    }
                    setTimeout(() => {
                    }, 1000);
                    this.modal = modal;
                    //gsap moving camera to look towards screen LCD
                    gsap.to(camera.position, {
                        ...this.position.clone().add(new Vector3(15, 0, 0)),
                        duration: 2,
                        onComplete: () => {
                            modal.open();
                            var button: HTMLButtonElement = document.querySelector("#closeModal");
                            button.onclick = (e) => {
                                ref.closeVideo();
                            }
                        }
                    });

                    gsap.to(camera.rotation, {
                        x: degToRad(0),
                        z: degToRad(0),
                        y: degToRad(90),
                        // y: degToRad(0),
                        duration: 2,
                        onComplete: () => {
                        }
                    });
                    //onSuccess -> open Modal full screen without transition
                    //modal show the youtube
                    //gsap opacity 1 to 0 image



                }
            }
        }, false) // false to make it assignable another event from other class
    }
    images: THREE.Texture[];
    private refCamera;
    private camera: {
        originalPos: Vector3,
        originalRotation: THREE.Euler
    }
    private closeVideo() {
        const ref = this;
        this.modal.Content = "";
        var audio: HTMLAudioElement = document.querySelector("#sound");
        // console.log("audio play")
        audio.volume = 0.2;
        this.modal.close();
        gsap.to(this.refCamera.position, {
            ...this.camera.originalPos,
            duration: 2
        });
        var { x, y, z } = this.camera.originalRotation;
        gsap.to(this.refCamera.rotation, {
            x,
            z,
            y,
            // y: degToRad(0),
            duration: 2,
            onComplete: () => {
                ref.isAnimating = false;
                (window as any).disableInput = false;
            }
        });
    }
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
        this.mesh.name = "imagesequence";
        (this.mesh as any).isBlooming = true;
        (this.mesh as any).selectiveOutline = true;
        // (this.mesh as any).url = "https://google.com";
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