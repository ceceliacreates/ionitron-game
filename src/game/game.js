import { Game, AUTO, Scale} from "phaser";
import { PlayScene } from './scenes/PlayScene.js';
import { StartScene } from './scenes/StartScene.js';
import { PauseScene } from './scenes/PauseScene.js';

export function launch() {
    return new Game({
      type: AUTO,
      scale: {
        mode: Scale.RESIZE,
        width: window.innerWidth,
        autoCenter: Scale.CENTER_BOTH,
        height: window.innerHeight,
      },
      parent: "game",
      backgroundColor: "#201726",
      physics: {
        default: "arcade",
        arcade: {
          // debug: true
        },
      },
      scene: [StartScene, PlayScene, PauseScene],
    });
  }