import { Game, AUTO, Scale} from "phaser";
import { PlayScene } from './scenes/PlayScene.js';
import { StartScene } from './scenes/StartScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { ScoreScene } from './scenes/ScoreScene.js';

export function launch(includedScenes = []) {

  const availableScenes = {
    'StartScene': StartScene,
    'PlayScene': PlayScene,
    'PauseScene': PauseScene,
    'ScoreScene': ScoreScene
};

  // default to all scenes if none are specified
  
  const scenes = !includedScenes ? [StartScene, PlayScene, PauseScene, ScoreScene] : includedScenes.map(sceneName => availableScenes[sceneName]);

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
      scene: scenes,
    });
  }