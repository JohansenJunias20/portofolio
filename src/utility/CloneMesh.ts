import { Mesh, ShaderMaterial } from "three";


export default function CloneMesh(mesh: Mesh) {
    const newClone = mesh.clone();
    // newClone.material = (mesh.material as ShaderMaterial).clone();
    // newClone.geometry = mesh.geometry.clone();
    return newClone;
}