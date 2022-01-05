export default function isintersect(bodyA: CANNON.Body, bodyB: CANNON.Body, world: CANNON.World) {
    for (var i = 0; i < world.contacts.length; i++) {
        var c = world.contacts[i];
        if ((c.bi === bodyA && c.bj === bodyB) || (c.bi === bodyB && c.bj === bodyA)) {
            return true;
        }
    }
    return false;
}