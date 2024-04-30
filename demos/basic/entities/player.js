import { Entity, Vector2 } from "../../../engine/Engine.js";
import { Collider, PhysicsBody } from "../../../engine/lib/physics.js";
import { CreateSpriteData, GMath, Vector2Dir } from '../../../engine/lib/utils.js'
import game from "../main.js";
import floor from "./floor.js";

let player = new Entity(100, 100, 50, 50);

player.visual.type = 'sprite';

player.collider = new Collider(player);
player.physics = new PhysicsBody(player, [floor]);

player.start = async () => {
    player.visual.spriteData = await CreateSpriteData(`${location.origin}/demos/basic/imgs/basketball.png`);
}

player.update = () => {
    if (game.RequestKey(' ', true)) {
        
            player.physics.addForce(GMath.VFactor(Vector2Dir.up, 5));
            player.physics.addForce(GMath.VFactor(Vector2Dir.right, 8));

        //}
    }

    player.physics.step();
}


export default player;