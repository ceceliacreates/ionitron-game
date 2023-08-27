import { Scene } from "phaser";
import gameConstants from '../constants.js';
import { gameState } from "../state.js";

export class StartScene extends Scene {
    constructor(){
      super({ key: 'StartScene'})
    }

    preload() {
        this.load.image(gameConstants.background.key, gameConstants.background.path);
        this.load.image(gameConstants.rewards.starKey, gameConstants.rewards.starPath);
        this.load.image(gameConstants.rewards.heartKey, gameConstants.rewards.heartPath);
        this.load.image(gameConstants.penalties.angryKey, gameConstants.penalties.angryPath);
        this.load.image(gameConstants.penalties.sadKey, gameConstants.penalties.sadPath);
        this.load.image(gameConstants.boosts.coffeeKey, gameConstants.boosts.coffeePath);
        this.load.image(gameConstants.boosts.laptopKey, gameConstants.boosts.laptopPath);
        this.load.image(gameConstants.boosts.phoneKey, gameConstants.boosts.phonePath);
        this.load.image(gameConstants.bugs.bug1Key, gameConstants.bugs.bug1Path);
        this.load.image(gameConstants.bugs.bug2Key, gameConstants.bugs.bug2Path);
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
    const startText = this.add.text(gameState.screen.width / 2, gameState.screen.height / 5.5, 'Tap to Start', { fontSize: '22px', fill: gameConstants.startFontColor }).setOrigin(0.5, 0.5);

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
    this.add.image(gameState.screen.width / 2, gameState.screen.height / 4, gameConstants.player.key).setScale(gameState.scaleValues.player)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 4 + gameConstants.player.height * gameState.scaleValues.player, 'Use arrows to move & jump', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
    
    this.add.image(gameState.screen.width / 2 - gameConstants.rewards.heartSize * gameConstants.rewards.heartScale, gameState.screen.height / 2.6, gameConstants.rewards.heartKey).setScale(gameConstants.rewards.heartScale)
    this.add.image(gameState.screen.width / 2 + gameConstants.rewards.starSize * gameConstants.rewards.starScale, gameState.screen.height / 2.6, gameConstants.rewards.starKey).setScale(gameConstants.rewards.starScale)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 2.6 + 50, 'Catch hearts & stars to gain points', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5);

    this.add.image(gameState.screen.width / 2 - gameConstants.penalties.angrySize * gameConstants.penalties.angryScale, gameState.screen.height / 2, gameConstants.penalties.angryKey).setScale(gameConstants.penalties.angryScale)
    this.add.image(gameState.screen.width / 2 + gameConstants.penalties.sadSize * gameConstants.penalties.sadScale, gameState.screen.height / 2, gameConstants.penalties.sadKey).setScale(gameConstants.penalties.sadScale)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 2 + 50, 'Avoid angry & sad users or lose points', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5);

    this.add.image(gameState.screen.width / 2 - gameConstants.boosts.laptopSize * gameConstants.boosts.laptopScale, gameState.screen.height / 1.55, gameConstants.boosts.coffeeKey).setScale(gameConstants.boosts.coffeeScale)
    this.add.image(gameState.screen.width / 2, gameState.screen.height / 1.55, gameConstants.boosts.laptopKey).setScale(gameConstants.boosts.laptopScale)
    this.add.image(gameState.screen.width / 2 + gameConstants.boosts.laptopSize * gameConstants.boosts.laptopScale, gameState.screen.height / 1.55, gameConstants.boosts.phoneKey).setScale(gameConstants.boosts.phoneScale)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 1.55 + 50, 'Catch boosts for temporary immunity', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5);

    this.add.image(gameState.screen.width / 2 - gameConstants.bugs.bug1Size * gameConstants.bugs.bug1Scale / 2, gameState.screen.height / 1.3, gameConstants.bugs.bug1Key).setScale(gameConstants.bugs.bug1Scale)
    this.add.image(gameState.screen.width / 2 + gameConstants.bugs.bug2Size * gameConstants.bugs.bug2Scale / 2, gameState.screen.height / 1.3, gameConstants.bugs.bug2Key).setScale(gameConstants.bugs.bug2Scale)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 1.3 + 50, 'Avoid bugs or it\'s game over! ', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5);

    this.add.text(gameState.screen.width / 2, gameState.screen.height / 1.1, 'Tap in the game area', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5)
    this.add.text(gameState.screen.width / 2, gameState.screen.height / 1.1 + 15, 'to pause and resume', { fontSize: gameConstants.startFontSize, fill: gameConstants.startFontColor, backgroundColor: 'white', fontStyle: 'bold' }).setOrigin(0.5, 0.5)


    // starts game on click/tap
    this.input.on('pointerup', () => {
        this.scene.stop('StartScene')
        this.scene.start('PlayScene')
      });
    }
  }