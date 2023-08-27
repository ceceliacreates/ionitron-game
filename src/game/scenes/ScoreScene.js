import { Scene } from "phaser";
import gameConstants from '../constants.js';
import { gameState } from "../state.js";
import { wrapText } from "../utils.js";

export class ScoreScene extends Scene {
    constructor(){
      super({ key: 'ScoreScene'})
    }

    init(data) {
        this.appStoreRating = data.appStoreRating;
    }

    create() {
    // adds background
    this.add.image(0, gameState.screen.height, gameConstants.background.key).setOrigin(0, 1).setScale(gameState.scaleValues.background);

    // adds white rectangle to show text on
    const textbox = this.add.graphics();

    // Set the fill color to white
    textbox.fillStyle(0xFFFFFF, 1);

    // Draw a rectangle
    // Parameters: x, y, width, height
    textbox.fillRect(gameState.screen.width * 0.10, gameState.screen.height * 0.25, gameState.screen.width * 0.8, gameState.screen.height * 0.5);

    
    // shows final score

    gameState.finalScoreText = this.add.text(gameState.screen.width / 2, gameState.screen.height / 3, `Final Score: ${gameState.score}`, { fontSize: '22px', fill: '#000000' }).setOrigin(0.5, 0);

    // displays app store rating with animation

    const appStoreRatingText = `App Store Rating: ${this.appStoreRating}`;
    const displayText = this.add.text(gameState.screen.width / 2, gameState.screen.height / 3 + 50, '', { fontSize: gameConstants.startFontSize, fill: '#000000', fontStyle: 'bold'}).setOrigin(0.5, 0.5);

    // selects random review based on score

    const reviewCategory = gameState.score >= 500 ? 'great' : gameState.score >= 400 ? 'good' : gameState.score >= 300 ? 'okay' : 'bad';

    const reviewText = gameConstants.reviews[reviewCategory][Math.floor(Math.random() * gameConstants.reviews[reviewCategory].length)];

    // wraps review text to fit in textbox

    const wrappedReviewText = wrapText(this, reviewText, gameState.screen.width * 0.5, gameConstants.startFontSize);

    // displays app store rating with typewriter animation

    let index = 0;
    const updateText = () => {
        displayText.text += appStoreRatingText[index];
        index++;
        if (index >= appStoreRatingText.length) {
        this.time.removeEvent(textEvent);

        // Once animation is complete, display review text with fade-in animation

        const displayedReviewText = this.add.text(gameState.screen.width / 2, gameState.screen.height / 3 + 125, `"${wrappedReviewText}" \n \n --Anonymous`, { fontSize: gameConstants.startFontSize, fill: '#000000'}).setOrigin(0.5, 0.5).setAlpha(0);

        this.tweens.add({
            targets: displayedReviewText,
            alpha: 1,  // Target alpha value (fully visible)
            duration: 1000,  // Duration in milliseconds (e.g., 1 second)
            ease: 'Linear'  // The easing function
        });
        

        // Once the animation is complete, display the "Tap to restart" text
        const restartText = this.add.text(gameState.screen.width / 2, gameState.screen.height / 3 + 200, 'Tap to restart', { fontSize: '15px', fill: '#000000' }).setOrigin(0.5, 0.5);

        // adds pulsing animation to start text
        this.tweens.add({
         targets: restartText,
         scaleX: 1.5, // Scale it to 150% of its original size
         scaleY: 1.5,
         duration: 1000, // Duration of one pulse
         ease: 'Sine.easeInOut', // Smooth easing
         yoyo: true, // Reverse the tween on completion, creating the "pulse" effect
         repeat: -1 // Repeat forever
  });

        // Add pointerdown handler to restart game
        this.input.once('pointerdown', () => {
            gameState.score = 0;
            this.scene.stop('ScoreScene')
            this.scene.start('PlayScene')
        });
        }
};

    const textEvent = this.time.addEvent({
    delay: 150,
    callback: updateText,
    loop: true
    });
    }
  }