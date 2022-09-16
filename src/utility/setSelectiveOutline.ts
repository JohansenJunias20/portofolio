import { ShaderMaterial } from "three";

export default

    function setSelectiveOutline(mesh: THREE.Mesh | THREE.Group, uuidScene: string) {
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
    (mesh as any).selectiveOutline = true;
   
    mesh.children.forEach(child => {
        setSelectiveOutline(child as THREE.Mesh | THREE.Group, uuidScene)
    })
}