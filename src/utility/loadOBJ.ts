import * as THREE from "three";
import { Group, Mesh, MeshPhongMaterial, ShaderMaterial, TetrahedronGeometry } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import customShader from "./customShader";

export default async function loadOBJ(objUrl: string, _mtl: string | THREE.ShaderMaterial, scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1), castShadow: boolean = false) {
    // to do: load dulu semua dengan promise.all baru init
    if (typeof _mtl === 'string') {
        var mtl: MTLLoader.MaterialCreator;
        const mtlLoader = new MTLLoader();
        var objLoader = new OBJLoader();
        mtl = await mtlLoader.loadAsync(_mtl);
        objLoader.setMaterials(mtl);
        var object: THREE.Group;
        await new Promise<void>((res, rej) => {
            objLoader.load(objUrl, function (_object) {
                _object.traverse((c: THREE.Mesh) => {
                    if (c.isMesh) {
                        c.castShadow = castShadow;
                        c.material = customShader((c.material as MeshPhongMaterial).color);
                    }
                    // return c;
                })
                object = _object;
                res()
            })
        });
        object.scale.set(scale.x, scale.y, scale.z)
        return object;
    }
    else {
        const object = await new Promise<Group>(async (res, rej) => {
            var objLoader = new OBJLoader();

            objLoader.load(objUrl, function (object) {
                for (let i = 0; i < object.children.length; i++) {
                    const c: Mesh = object.children[i] as any;
                    if (c.isMesh) {
                        c.castShadow = castShadow;
                        if (Array.isArray(c.material)) {
                            for (let i = 0; i < c.material.length; i++) {
                                c.material[i] = _mtl;
                            }

                        }
                        else {
                            c.material = _mtl;
                        }

                    }

                }

                object.scale.copy(scale)
                res(object)
            });
        });
        return object;
    }
}