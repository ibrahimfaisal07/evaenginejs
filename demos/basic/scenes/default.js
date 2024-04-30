import { Camera, Scene } from "../../../engine/Engine.js";
import floor from "../entities/floor.js";
import player from "../entities/player.js";

let defaultScene = new Scene("default", [player, floor]);

defaultScene.camera = new Camera(0, 0, 1);

export default defaultScene;