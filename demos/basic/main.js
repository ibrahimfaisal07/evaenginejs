import { Game } from "../../engine/Engine.js";
import defaultScene from "./scenes/default.js";

let game = new Game(null, null, null, document.body);

game.scenes.push(defaultScene);

game.start();

export default game;