import * as CANNON from 'cannon'
export default function createBody(mesh: THREE.Mesh) {
    const vertices = mesh.geometry.attributes.position.array;
    const indices = Object.keys(vertices).map(Number);
    return new CANNON.Trimesh(vertices as number[], indices);
}