import * as THREE from "three";
import * as CANNON from 'cannon'
class CannonUtils {
    static CreateTrimesh(geometry: any) {
        const vertices = geometry.attributes.position.array;
        const indices = Object.keys(vertices).map(Number);
        return new CANNON.Trimesh(vertices, indices);
    }
    static offsetCenterOfMass(body: any, centreOfMass: any) {
        body.shapeOffsets.forEach(function (offset: any) {
            centreOfMass.vadd(offset, centreOfMass);
        });
        centreOfMass.scale(1 / body.shapes.length, centreOfMass);
        body.shapeOffsets.forEach(function (offset) {
            offset.vsub(centreOfMass, offset);
        });
        const worldCenterOfMass = new CANNON.Vec3();
        body.vectorToWorldFrame(centreOfMass, worldCenterOfMass);
        body.position.vadd(worldCenterOfMass, body.position);
    }
}
export default CannonUtils;