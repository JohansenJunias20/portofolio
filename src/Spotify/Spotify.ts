import MeshOnlyObject3d from "../MeshOnlyObject";
import * as THREE from "three"
import generateTexture from "../utility/generateTexture";
import { ShaderMaterial } from "three";
import vertexShader from "../../public/assets/shaders/floorMesh.vert";
import fragShader from "../../public/assets/shaders/floorMesh.frag";
import customShader from "../utility/customShader";
export interface ISpotify {
    image_url: string;
    song: {
        name: string;
        artist: string;
        length: number;
    },
    is_playing: boolean,
    currentDuration: number;
    url: string;
}
export default class Spotify extends MeshOnlyObject3d {
    currentSpotify: ISpotify;
    // mesh: THREE.Mesh;
    changeTexture: boolean = false;
    constructor(scene: THREE.Scene, position: THREE.Vector3) {
        super(scene, position);
        const ref = this;
        window.addEventListener("spotify", (e: any) => {
            var data = (e.detail as ISpotify);
            this.currentSpotify = data;
            this.changeTexture = true;
        })
    };
    public async loadAsset() {
        // var desc_text_texture = await new THREE.TextureLoader().loadAsync(this.pathTexture)
        var loader = new THREE.TextureLoader();
        var material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: fragShader,
            uniforms: {
                mapTexture: {
                    value: null,
                }
            },
        });
        var geometry = new THREE.PlaneGeometry();
        this.mesh = new THREE.Mesh(geometry, material);
    }
    public update() {
        if (this.changeTexture) {
            this.changeTexture = false;
            generateTexture({
                layers: [
                    { type: "image", image: this.currentSpotify.image_url, position: { x: 5, y: 5 } }, //cover image
                    { type: "text", text: this.currentSpotify.song.name, position: { x: 50, y: 5 } }, //cover image
                    { type: "text", text: this.currentSpotify.song.artist, position: { x: 50, y: 35 } }, //cover image
                    // { type: "image", image: this.currentSpotify.image_url, position: { x: 5, y: 5 } }, //cover image
                ], width: 300, height: 150
            }).then((result) => {
                ((this.mesh as Mesh).material as ShaderMaterial).uniforms.textureMap.value = result;
                ((this.mesh as Mesh).material as ShaderMaterial).needsUpdate = true;

            });
        }
    }
}