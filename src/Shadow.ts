//shadow for moveable object

import * as THREE from "three";
import { ShaderMaterial, Vector3 } from "three";

import vertShader from "../public/assets/shaders/shadow.vert";
import fragShader from "../public/assets/shaders/shadow.frag";
import { degToRad, radToDeg } from "three/src/math/MathUtils";
export default class Shadow {
    asset: {
        vert: string;
        frag: string;
    }
    material: THREE.ShaderMaterial;
    geometry: THREE.PlaneGeometry;
    mesh: THREE.Mesh;
    offset: Vector3;
    constructor(scene: THREE.Scene, mesh: THREE.Mesh) {
        this.asset = {
            vert: vertShader,
            frag: fragShader
        }
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uAlpha: {
                    value: 0.2
                }
            },
            vertexShader: this.asset.vert,
            fragmentShader: this.asset.frag,
            // transparent: true,
            depthTest: true,
            depthWrite: false,
        });
        //get size of mesh
        var size = new THREE.Vector3();
        new THREE.Box3().setFromObject(mesh).getSize(size);
        this.geometry = new THREE.PlaneGeometry(size.x * 1.5, Math.max(size.y, size.z) * 1.5);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = degToRad(-90);
        this.mesh.position.y = 0.3;
        this.offset = new Vector3(0, 0, -0.5);
        // this.mesh.scale = new Vector3(2, 2, 2);

        scene.add(this.mesh);
    }
    update(yDegree: number, positionReference: Vector3) {
        this.mesh.position.copy(positionReference);
        this.mesh.position.add(this.offset);
        this.mesh.position.y = 0.3;
        this.mesh.rotation.z = yDegree; // karena diawal sudah dirotasi X sehingga y jadi z
        //calculate distance positionrefence to its floor
        let distance = positionReference.distanceTo(new Vector3(positionReference.x, 0, positionReference.z));
        // distance++;
        var maxDistance = 10;
        //rescale distance to 0-1
        var scale = distance / maxDistance;

        // this.mesh.scale.set(1/distance, this.mesh.scale.y, 1/distance);
        // console.log({distance})
        // this.mesh.scale.setZ();
        (this.mesh.material as ShaderMaterial).uniforms.uAlpha.value = 0.4 - scale;
        (this.mesh.material as ShaderMaterial).needsUpdate = true;
    }

}