import * as THREE from "three";
import { Group, Mesh, MeshPhongMaterial, ShaderMaterial, TetrahedronGeometry } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import customShader from "./customShader";

export default async function loadOBJ(objUrl: string, _mtl: string | THREE.ShaderMaterial, scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1), castShadow: boolean = false) {

    const object = await new Promise<Group>(async (res, rej) => {
        var objLoader = new OBJLoader();
        if (typeof _mtl === 'string') { //if _mtl is shadermaterial, material's objloader no need to be set.
            const mtlLoader = new MTLLoader();
            const mtl = await mtlLoader.loadAsync(_mtl);
            objLoader.setMaterials(mtl);
        }
        objLoader.load(objUrl, async function (object) {
            for (let i = 0; i < object.children.length; i++) {
                const c: Mesh = object.children[i] as any;
                if (c.isMesh) {
                    c.castShadow = castShadow;
                    if (Array.isArray(c.material)) {
                        for (let i = 0; i < c.material.length; i++) {
                            c.material[i] = typeof _mtl === 'string' ? (await customShader((c as any).material[i].color)) as any : _mtl;
                        }

                    }
                    else {
                        c.material = typeof _mtl === 'string' ? await customShader((c.material as MeshPhongMaterial).color) : _mtl;
                    }

                }
            }

            object.scale.copy(scale)
            res(object)
        });
    });
    return object;
}