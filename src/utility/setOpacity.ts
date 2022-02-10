import { ShaderMaterial } from "three";

export default

    function setOpacity(mesh: THREE.Mesh | THREE.Group, uuidScene: string, opacity: number) {
    try {
        // if (!mesh) return;
        if (mesh.uuid == uuidScene) {
            return;
        }
    }
    catch (ex) {
        console.log({ ex });
        return;
    }

    if (mesh.name == "" && mesh.type == "Group" && mesh.children.length == 3 && mesh.children[2].name == "Circle_Circle.001") {
        // console.log(opacity)
        // throw "err"
    }
    if (mesh.hasOwnProperty('material')) //bila punya material
        if (Array.isArray((mesh as THREE.Mesh).material))
            ((mesh as THREE.Mesh).material as ShaderMaterial[]).forEach((mat: ShaderMaterial) => {
                if (mat.uniforms?._opacity) {
                    mat.uniforms._opacity.value = opacity;
                    mat.needsUpdate = true;
                }
            })
        else {
            try {
                ((mesh as THREE.Mesh).material as ShaderMaterial).uniforms._opacity.value = opacity;
                ((mesh as THREE.Mesh).material as ShaderMaterial).needsUpdate = true;
            }
            catch (ex) {

            }
        }

    mesh.children.forEach(child => {
        setOpacity(child as THREE.Mesh | THREE.Group, uuidScene, opacity)
    })
}