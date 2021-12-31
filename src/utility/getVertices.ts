import { BufferGeometry, Object3D, Vector3 } from "three";

export default function getVertices(geometry: BufferGeometry, mesh: THREE.Object3D): Float32Array {
    const position = geometry.attributes.position;
    const vertices = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i += 3) {
        var element = new Vector3(position.getX(i), position.getY(i), position.getZ(i))
        element = mesh.localToWorld(element)
        vertices[i] = element.x;
        vertices[i + 1] = element.y;
        vertices[i + 2] = element.z;
    }
    return vertices;
}