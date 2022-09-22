import { Vector3 } from "three";
import PhysicsObject3d from "../PhysicsObject";
import * as THREE from "three"
import * as CANNON from 'cannon';

export default class DJMixer extends PhysicsObject3d {
    constructor(world: CANNON.World, scene: THREE.Scene, position: THREE.Vector3) {
        super(world, scene, position.clone().setY(7), 0, "BOX", 0);
        this.asset = {
            url: "/assets/environment/Spotify/dj_mixer.glb",
            // mtl: "/assets/environment/Spotify/dj_mixer.mtl",
            castShadow: true,
            recieveShadow: false,
            scale: new Vector3(2, 2, 2),
            floorShadow: {
                // textureUrl: "/assets/environment/Spotify/floorShadow.png",
                textureUrl: "/assets/environment/projector/floorShadow.png",
                modelUrl: "/assets/floorShadow.obj",
                scale: new Vector3(8.3, 0, 8.3),
                offset: new Vector3(),
                // preload: true,
                // Mesh: new THREE.Group()
            }
        }
    }

}