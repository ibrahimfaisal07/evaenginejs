import { Camera, Scene } from "../../../engine/Engine.js";
import player from "../entities/player.js";

let defaultScene = new Scene("default", [player]);

defaultScene.camera = new Camera(0, 0, 2);

export default defaultScene;