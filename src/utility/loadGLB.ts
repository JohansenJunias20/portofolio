import { Mesh, MeshStandardMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import customShader from './customShader';

export default async function loadGLB(url: string) {
    const loader = new GLTFLoader();
    return new Promise<THREE.Group>((res, rej) => {
        loader.load(
            url,
            function (gltf) {
                // console.log({ gltf: gltf.scene })
                gltf.scene.scale.x = 2;
                gltf.scene.scale.y = 2;
                gltf.scene.scale.z = 2;
                gltf.scene.traverse((m: Mesh) => {
                    if (m.isMesh) {
                        (m as Mesh).material = customShader((m.material as MeshStandardMaterial).color);
                    }
                })
                res(gltf.scene)
            }
        )
    })
}