import { Scene } from "phaser";
import { gameState } from "../state.js";

export class PauseScene extends Scene {
    constructor(){
      super({ key: 'PauseScene'})
    }

    init(data) {
      gameState.pauseArea = data.pauseArea;
  }

  
    create() {
    // sets game values based on screen width and height
    const screenHeight = this.scale.height;
    const screenWidth = this.scale.width;
    
    this.add.text(screenWidth / 2, screenHeight / 2, 'Resume', { fontSize: '15px', fill: '#ffffff' }).setOrigin(0.5, 0.5);

    // resumes game on click/tap within game area

    this.input.on('pointerdown', function (pointer)
    {
      if (pointer.x >= gameState.pauseArea.x && pointer.x <= gameState.pauseArea.x + gameState.pauseArea.width &&
        pointer.y >= gameState.pauseArea.y && pointer.y <= gameState.pauseArea.y + gameState.pauseArea.height) {
        this.scene.stop('PauseScene');
        this.scene.resume('PlayScene');
        }
    }, this);
    }
  }