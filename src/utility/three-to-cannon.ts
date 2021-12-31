// import { Box, Quaternion as CQuaternion, ConvexPolyhedron, Cylinder, Shape, Sphere, Trimesh, Vec3 } from 'cannon';
// import { Box3, BufferGeometry, CylinderGeometry, MathUtils, Mesh, Object3D, SphereGeometry, Vector3 } from 'three';
// import { getComponent, getGeometry, getVertices } from './CannonUtils';

// const PI_2 = Math.PI / 2;

// export enum ShapeType {
// 	BOX = 'Box',
// 	CYLINDER = 'Cylinder',
// 	SPHERE = 'Sphere',
// 	HULL = 'ConvexPolyhedron',
// 	MESH = 'Trimesh',
// }

// export interface ShapeOptions {
// 	type?: ShapeType,
// 	cylinderAxis?: 'x' | 'y' | 'z',
// 	sphereRadius?: number,
// }

// export interface ShapeResult<T extends Shape = Shape> {
// 	shape: T,
// 	offset?: Vec3,
// 	orientation?: CQuaternion
// }

// /**
//  * Given a THREE.Object3D instance, creates a corresponding CANNON shape.
//  */
// export const threeToCannon = function (object: Object3D, options: ShapeOptions = {}): ShapeResult | null {
// 	let geometry: BufferGeometry | null;


//     geometry = getGeometry(object);
//     return geometry ? createTrimeshShape(geometry) : null;

	
// };

// /******************************************************************************
//  * Shape construction
//  */


// function createTrimeshShape (geometry: BufferGeometry): ShapeResult | null {
// 	const vertices = getVertices(geometry);

// 	if (!vertices.length) return null;

// 	const indices = Object.keys(vertices).map(Number);
// 	return {shape: new Trimesh(vertices as unknown as number[], indices)};
// }