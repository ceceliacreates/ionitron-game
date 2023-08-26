import { Scene } from "phaser";
import gameConstants from '../constants.js';
import { gameState } from "../state.js";

export class StartScene extends Scene {
    constructor(){
      super({ key: 'StartScene'})
    }

    preload() {
        this.load.image(gameConstants.background.key, gameConstants.background.path);
        this.load.image(gameConstants.star.key, gameConstants.star.path);
        this.load.image(gameConstants.bomb.key, gameConstants.bomb.path);
        this.load.spritesheet(gameConstants.player.key, gameConstants.player.path, {
          frameWidth: gameConstants.player.width,
          frameHeight: gameConstants.player.height,
        });
      }
  
    create() {
    // sets gameState values based on screen width and height
    gameState.screen.width = this.scale.width;
    gameState.screen.height = this.scale.height;
    gameState.scaleValues.background = gameState.screen.height > gameState.screen.width ? gameState.screen.height / gameConstants.background.height : gameState.screen.width / gameConstants.background.width;
    
    // adds background
    this.add.image(0, gameState.screen.height, gameConstants.background.key).setOrigin(0, 1).setScale(gameState.scaleValues.background);  
    
    // adds start text
    const startText = this.add.text(gameState.screen.width / 2, gameState.screen.height / 4, 'Tap to Start', { fontSize: '22px', fill: gameConstants.startFontColor }).setOrigin(0.5, 0.5);

    // adds pulsing animation to start text
   this.tweens.add({
    targets: startText,
    scaleX: 1.5, // Scale it to 150% of its original size
    scaleY: 1.5,
    duration: 1000, // Duration of one pulse
    ease: 'Sine.easeInOut', // Smooth easing
    yoyo: true, // Reverse the tween on completion, creating the "pulse" effect
    repeat: -1 // Repeat forever
  });

    // adds instructions text and images
    this.add.image(gameState.screen.width / 2, gameState.screen.height / 3, gameConstants.player.key).setScale(gameState.scaleValues.player)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 3 + 50, 'Use arrow keys to move & jump', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
    
    this.add.image(gameState.screen.width / 2, gameState.screen.height / 2, gameConstants.star.key)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 2 + 50, 'Catch stars to gain points', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5);

    this.add.image(gameState.screen.width / 2, gameState.screen.height / 1.5, gameConstants.bomb.key)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 1.5 + 50, 'Avoid lasers or it\'s game over! ', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5);

    this.add.text(gameState.screen.width / 2, gameState.screen.height / 1.2, 'Tap in the game area', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 1.2 + 15, 'to pause and resume', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5)


    // starts game on click/tap
    this.input.on('pointerup', () => {
        this.scene.stop('StartScene')
        this.scene.start('PlayScene')
      });
    }
  }