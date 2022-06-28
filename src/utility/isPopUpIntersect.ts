interface IObject {
    position: THREE.Vector3,
    size: THREE.Vector3 | THREE.Vector2
}
export default function isintersect(Character: IObject, PopUpObject: IObject) {
    // if (objectA.position.x + objectA.size.x / 2 < objectB.position.x - objectB.size.x / 2) {
    //     return false;
    // }
    // check if center position characther inside PopUpObject
    if (Character.position.x + Character.size.x > PopUpObject.position.x - PopUpObject.size.x / 2 &&
        Character.position.x - Character.size.x  < PopUpObject.position.x + PopUpObject.size.x / 2 &&
        Character.position.z  > PopUpObject.position.z - PopUpObject.size.y / 2 &&
        Character.position.z  < PopUpObject.position.z + PopUpObject.size.y / 2) {
        return true;
    }

    return false;

}