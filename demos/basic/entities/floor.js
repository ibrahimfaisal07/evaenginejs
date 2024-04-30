import { Entity } from "../../../engine/Engine.js";
import { Collider, PhysicsBody } from "../../../engine/lib/physics.js";
import game from "../main.js";

let floor = new Entity(0, 0, 0, 0)

floor.visual.color = '#e8b16d'

floor.collider = new Collider(floor);
floor.collider.bounce = 0.5


floor.update = () => {
    floor.transform.setTransform(
        0,
        game.viewport.height - 50,
        game.viewport.width,
        50
    )
}

export default floor