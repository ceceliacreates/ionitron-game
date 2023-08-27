import { Scene } from "phaser";
import gameConstants from '../constants.js';
import { timeToFall, maxPotentialDistanceToCatch } from '../utils.js';
import { gameState } from "../state.js";

export class PlayScene extends Scene {
    constructor () {
      super({ key: 'PlayScene' })
    }

    preload() {
        this.load.image(gameConstants.background.key, gameConstants.background.path);
        this.load.image(gameConstants.star.key, gameConstants.star.path);
        this.load.image(gameConstants.bomb.key1, gameConstants.bomb.path1);
        this.load.image(gameConstants.bomb.key2, gameConstants.bomb.path2);
        this.load.spritesheet(gameConstants.player.key, gameConstants.player.path, {
          frameWidth: gameConstants.player.width,
          frameHeight: gameConstants.player.height,
        });
        this.load.image(gameConstants.platform.key, gameConstants.platform.path);
        this.load.image(gameConstants.arrow.leftKey, gameConstants.arrow.leftPath);
        this.load.image(gameConstants.arrow.rightKey, gameConstants.arrow.rightPath);
        this.load.image(gameConstants.arrow.upKey, gameConstants.arrow.upPath);
      }
  
    create () {

    // GAME STATE SETUP

    // sets game values based on screen size
    gameState.screen.width = this.scale.width;
    gameState.screen.height = this.scale.height;
    gameState.scaleValues.platform = gameState.screen.width / gameConstants.platform.width;
    gameState.scaledPlatformHeight = gameConstants.platform.height * gameState.scaleValues.platform;
    gameState.gameArea.width = gameState.screen.width;
    gameState.controlsArea.width = gameState.screen.width;
    gameState.controlsArea.height = gameState.screen.height * 0.08 > gameState.scaledPlatformHeight + gameConstants.arrow.size + 20 ? gameState.screen.height * 0.08 : gameState.scaledPlatformHeight + gameConstants.arrow.size + 20;
    gameState.gameArea.height = gameState.screen.height - gameState.controlsArea.height;
    gameState.scaleValues.background = gameState.gameArea.height > gameState.gameArea.width ? gameState.gameArea.height / gameConstants.background.height : gameState.gameArea.width / gameConstants.background.width;
    gameState.gameArea.leftEdge = gameState.gameArea.width * 0.1;
    gameState.gameArea.rightEdge = gameState.gameArea.width * 0.9;
    gameState.scaledPlayerHeight = gameConstants.player.height * gameState.scaleValues.player;
    gameState.halfScaledPlayerHeight = gameState.scaledPlayerHeight / 2;

    // defines pause area based on screen size
    gameState.pauseArea = {
      x: 0,                                // Starting x-coordinate of the rectangle
      y: 0,                                // Starting y-coordinate of the rectangle
      width: gameState.gameArea.width,     // Width of the rectangle
      height: gameState.gameArea.height    // Height of the rectangle
    };

    // calculates physics values based on screen size
    const starFallTime = timeToFall(gameState.gameArea.height, gameConstants.star.gravity);
    const maxPotentialDistanceToCatchStar = maxPotentialDistanceToCatch(starFallTime, gameConstants.player.velocity);

    // sets initial lastStarX value of the middle of the screen
    gameState.lastStarX = gameState.gameArea.width / 2;

    // resets gameOver to false to handle game restarts
    gameState.gameOver = false;

    // creates cursor keys
    gameState.cursors = this.input.keyboard.createCursorKeys();

    // ADDS INITIAL GAME ELEMENTS

    // adds background and static ground platform
    this.add.image(0, gameState.gameArea.height, gameConstants.background.key).setOrigin(0, 1).setScale(gameState.scaleValues.background);

    const platforms = this.physics.add.staticGroup();
    platforms.create(0, gameState.gameArea.height, gameConstants.platform.key).setOrigin(0, 0).setScale(gameState.scaleValues.platform).refreshBody();

    // adds score text
     const scoreFontSizeNumber = gameConstants.scoreFontSize.substring(0, 2);
     const halfScoreFontSizeNumber = scoreFontSizeNumber / 2;
     gameState.scoreText = this.add.text(gameState.gameArea.width / 2, gameState.gameArea.height + halfScoreFontSizeNumber, 'Score: 0', { fontSize: gameConstants.scoreFontSize, fill: '#ffffff' }).setOrigin(0.5, 0);

    // adds player
    gameState.player = this.physics.add.sprite(
      gameState.gameArea.width / 2,
      gameState.gameArea.height - gameState.halfScaledPlayerHeight,
      gameConstants.player.key,
    ).setScale(gameState.scaleValues.player);

    // sets physics values for player
    gameState.player.body.setGravityY(gameConstants.player.gravity);
    gameState.player.setBounce(0.2);
    gameState.player.setCollideWorldBounds(true);

    // adds animations for player
    if (!this.anims.exists('left')) {
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers(gameConstants.player.key, { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists('turn')) {
      this.anims.create({
        key: "turn",
        frames: [{ key: gameConstants.player.key, frame: 4 }],
      });
    }

    if (!this.anims.exists('right')) {
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers(gameConstants.player.key, { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    
    // adds controls area

    // defines value for arrow images
    const halfArrowSize = gameConstants.arrow.size / 2;
    const arrowOffset = gameState.gameArea.width * 0.10;
    const hitAreaOffset = arrowOffset / 3;
    const arrowY = gameState.gameArea.height + gameState.scaledPlatformHeight + halfArrowSize + 10;
  
    // defines hit area for left and right arrows
    const hitArea = new Phaser.Geom.Circle(halfArrowSize, halfArrowSize, halfArrowSize + hitAreaOffset); // last value is radius
  
    // adds arrow images and hit areas
    gameState.leftArrow = this.add.image(arrowOffset + halfArrowSize, arrowY, gameConstants.arrow.leftKey).setInteractive(hitArea, Phaser.Geom.Circle.Contains);
    gameState.rightArrow = this.add.image(gameState.gameArea.width - halfArrowSize - arrowOffset, arrowY, gameConstants.arrow.rightKey).setInteractive(hitArea, Phaser.Geom.Circle.Contains);
    gameState.upArrow = this.add.image(gameState.gameArea.width / 2, arrowY, gameConstants.arrow.upKey).setInteractive().setOrigin(0.5, 0.5);

   // ADDS GENERATED GAME ELEMENTS

   // creates stars group, adds generator function, and starts generator loop
   const stars = this.physics.add.group({
    gravityY: gameConstants.star.gravity
  });
  
   const createStar = () => {
    const playerMinBoundary = gameState.lastStarX - maxPotentialDistanceToCatchStar < gameState.gameArea.leftEdge ? gameState.gameArea.leftEdge : gameState.lastStarX - maxPotentialDistanceToCatchStar;
    const playerMaxBoundary = gameState.lastStarX + maxPotentialDistanceToCatchStar > gameState.gameArea.rightEdge ? gameState.gameArea.rightEdge : gameState.lastStarX + maxPotentialDistanceToCatchStar;
    const randomXCoord = Math.random() * gameState.gameArea.width;
    const xCoord = Phaser.Math.Clamp(randomXCoord, playerMinBoundary, playerMaxBoundary);
    const star = stars.create(xCoord, 0, gameConstants.star.key)
    gameState.lastStarX = star.x;
}

   const createStarLoop = this.time.addEvent({
    delay: 1000,
    callback: createStar,
    callbackScope: this,
    loop: true,
});

// creates bombs group, adds generator function, and starts generator loop
   const bombs = this.physics.add.group({
      gravityY: gameConstants.bomb.gravity
    });

  const createBomb = () => {
    const bombBuffer = gameState.gameArea.width * 0.1;
    const bombMinBoundary = gameState.player.x - bombBuffer < gameState.gameArea.leftEdge ? gameState.gameArea.leftEdge : gameState.player.x - bombBuffer;
    const bombMaxBoundary = gameState.player.x + bombBuffer > gameState.gameArea.rightEdge ? gameState.gameArea.rightEdge : gameState.player.x + bombBuffer;
    const randomXCoord = Math.random() * gameState.gameArea.width;
    const xCoord = Phaser.Math.Clamp(randomXCoord, bombMinBoundary, bombMaxBoundary);
    const bomb = bombs.create(xCoord, 0, gameConstants.bomb.key)

    // sets hit area for bomb to be smaller than actual bomb
    const hitRadius = bomb.width * 0.6 / 2; 
    bomb.setCircle(hitRadius, bomb.width * 0.2, bomb.height * 0.2); // the offset values should be half of the difference between the hit area and the actual bomb
  }

  const createBombLoop = this.time.addEvent({
    delay: 5000,
    callback: createBomb,
    callbackScope: this,
    loop: true,
  });


// ADDS PAUSE FUNCTIONALITY

// pauses game on click/tap

  this.input.on('pointerdown', function (pointer)
{
    // Does nothing if the game is already over

    if (gameState.gameOver) {
        return;
    }

    // Does nothing if the player is actively using the controls
    if (!gameState.canPause) {
        return;
    }
    
    // Check if the pointer is within the defined rectangular area
    if (pointer.x >= gameState.pauseArea.x && pointer.x <= gameState.pauseArea.x + gameState.pauseArea.width &&
        pointer.y >= gameState.pauseArea.y && pointer.y <= gameState.pauseArea.y + gameState.pauseArea.height) {
        this.scene.pause();
        this.scene.launch('PauseScene');

    }
}, this);

  // ADDS TOUCH CONTROLS

  // left arrow
  gameState.leftArrow.on('pointerdown', () => {
    gameState.canPause = false;
    gameState.moveLeft = true;
  });
  gameState.leftArrow.on('pointerup', () => {
    gameState.canPause = true;
    gameState.moveLeft = false;
  });

  // right arrow
  gameState.rightArrow.on('pointerdown', () => { 
    gameState.canPause = false;
    gameState.moveRight = true;
  });
  gameState.rightArrow.on('pointerup', () => {
    gameState.canPause = true;
    gameState.moveRight = false;
  });

  // up arrow
  gameState.upArrow.on('pointerdown', () => {
    gameState.canPause = false;
    gameState.moveUp = true
  });
  gameState.upArrow.on('pointerup', () => {
    gameState.canPause = true;
    gameState.moveUp = false;
  });

  // ADDS COLLIDERS FOR ELEMENTS

  // adds collider between player and platforms
    this.physics.add.collider(gameState.player, platforms);

  // adds colliders for stars

    this.physics.add.collider(stars, platforms, function(star) {
        star.destroy();
      });

    this.physics.add.overlap(gameState.player, stars, function(player, star) {
        star.destroy();
        gameState.score += 10;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
        });

  // adds colliders for bombs with platform
    this.physics.add.collider(bombs, platforms, function(bomb) {
        bomb.destroy();
      }
    );

  // adds collider for bombs with player
    this.physics.add.overlap(gameState.player, bombs, function(player, bomb) {
    
    // calculates app store rating based on score

    const appStoreRating = gameState.score >= 500 ? '⭐️⭐️⭐️⭐️⭐️' : gameState.score >= 400 ? '⭐️⭐️⭐️⭐️' : gameState.score >= 300 ? '⭐️⭐️⭐️' : gameState.score >= 200 ? '⭐️⭐️' : gameState.score >= 100 ? '⭐️' : 'Rejected 😭';

    // When the game ends, dispatch the event with the score and rating
      const gameEndEvent = new CustomEvent("gameEnded", {
        detail: { score: gameState.score, rating: appStoreRating }
      });
    
      window.dispatchEvent(gameEndEvent);

    // stops game generators and physics
      gameState.gameOver = true;
      createBombLoop.destroy();
      createStarLoop.destroy();
      this.physics.pause();

      // stops Play Scene and starts Score Scene

      this.scene.stop('PlayScene')
      this.scene.start('ScoreScene', { appStoreRating: appStoreRating });
    }, null, this);
}
  
    update () {

      // keyboard controls

        if (gameState.cursors.left.isDown && !gameState.cursors.right.isDown)
        {
            gameState.player.setVelocityX(0 - gameConstants.player.velocity);
        
            gameState.player.anims.play('left', true);
        }
        else if (gameState.cursors.right.isDown && !gameState.cursors.left.isDown)
        {
            gameState.player.setVelocityX(gameConstants.player.velocity);
        
            gameState.player.anims.play('right', true);
        }

        // touch controls

        else if (gameState.moveLeft && !gameState.moveRight) {
          gameState.player.setVelocityX(0 - gameConstants.player.velocity);
      
          gameState.player.anims.play('left', true);
        }
        else if (gameState.moveRight && !gameState.moveLeft) {
          gameState.player.setVelocityX(gameConstants.player.velocity);
      
          gameState.player.anims.play('right', true);
        }

        else
        {
            gameState.player.setVelocityX(0);
        
            gameState.player.anims.play('turn');
        }
        
        if (gameState.cursors.up.isDown && gameState.player.body.touching.down)
        {
            gameState.player.setVelocityY(0 - gameConstants.player.velocity);
        }

        if (gameState.moveUp && gameState.player.body.touching.down) {
          gameState.player.setVelocityY(0 - gameConstants.player.velocity);
        }
    }
  }