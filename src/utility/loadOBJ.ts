import { Group, Mesh, MeshPhongMaterial } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import customShader from "./customShader";

export default async function loadOBJ(objUrl: string, mtlUrl: string, scale: THREE.Vector3, castShadow: boolean = false) {
    const mtlLoader = new MTLLoader();
    const mtl = await mtlLoader.loadAsync(mtlUrl);
    const object = await new Promise<Group>((res, rej) => {

        var objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load(objUrl, async function (object) {
            for (let i = 0; i < object.children.length; i++) {
                const c: Mesh = object.children[i] as any;
                if (c.isMesh) {
                    c.castShadow = castShadow;
                    if (Array.isArray(c.material)) {
                        for (let i = 0; i < c.material.length; i++) {
                            c.material[i] = (await customShader((c as any).material[i].color)) as any;
                        }

                    }
                    else {
                        c.material = await customShader((c.material as MeshPhongMaterial).color)
                    }

                }
            }

            object.scale.copy(scale)
            res(object)
        });
    });
    return object;
}