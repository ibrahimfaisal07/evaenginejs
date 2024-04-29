import { CreateSpriteData, Entity, Vector2 } from "../../../engine/Engine.js";
import game from "../main.js";
import defaultScene from "../scenes/default.js";

let player = new Entity(100, 100, 50, 50);

player.visual.type = 'sprite';

player.start = async () => {
    player.visual.spriteData = await CreateSpriteData(`${location.origin}/demos/basic/imgs/basketball.png`);
}

player.update = () => {
    
    defaultScene.camera.transform.position = 
        new Vector2(
            0, 0
        );

    console.log(defaultScene.camera.transform.position)
}


export default player;