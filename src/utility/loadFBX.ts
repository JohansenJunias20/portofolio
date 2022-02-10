import { Mesh } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import customShader from "./customShader";

export default async function loadFBX(url: string, scale: THREE.Vector3, castShadow: boolean = false, recieveShadow: boolean = false) {
    const fbx = await new Promise<THREE.Object3D>((res, rej) => {
        const loader = new FBXLoader();
        loader.load(url, (f) => {
            for (let i = 0; i < f.children.length; i++) {
                const c: Mesh = f.children[i] as any;
                if (c.isMesh) {
                    c.castShadow = castShadow;
                    const oldMat: any = c.material;
                    if (Array.isArray(oldMat)) {
                        for (let i = 0; i < oldMat.length; i++) {
                            var element: any = oldMat[i];
                            element = customShader(element.color);
                        }
                    }
                    else
                        c.material = customShader(oldMat.color);
                    if (recieveShadow != undefined)
                        c.receiveShadow = recieveShadow;
                }
            }

            f.scale.x = scale.x;
            f.scale.y = scale.y;
            f.scale.z = scale.z;
            res(f);
        })
    })
    return fbx;
}