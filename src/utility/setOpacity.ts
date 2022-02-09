import { ShaderMaterial } from "three";

export default

    function setOpacity(mesh: THREE.Mesh | THREE.Group, uuidScene: string, opacity: number) {
    if (mesh.uuid == uuidScene) {
        return;
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