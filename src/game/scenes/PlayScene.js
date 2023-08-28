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
    const rewardFallTime = timeToFall(gameState.gameArea.height, gameConstants.rewards.gravity);
    const maxPotentialDistanceToCatchReward = maxPotentialDistanceToCatch(rewardFallTime, gameConstants.player.velocity);

    // sets initial lastRewardX as the middle of the screen
    gameState.lastRewardX = gameState.gameArea.width / 2;


    // resets gameState to false to handle game restarts
    gameState.gameOver = false;
    gameState.score = 0;
    gameState.immune = false;
    gameState.canPause = true;
    gameState.moveLeft = false;
    gameState.moveRight = false;
    gameState.moveUp = false;

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

   // creates rewards group, adds generator function, and starts generator loop
   const rewards = this.physics.add.group({
    gravityY: gameConstants.rewards.gravity
  });
  
   const createReward = () => {
    const rewardMinBoundary = gameState.lastRewardX - maxPotentialDistanceToCatchReward < gameState.gameArea.leftEdge ? gameState.gameArea.leftEdge : gameState.lastRewardX - maxPotentialDistanceToCatchReward;
    const rewardMaxBoundary = gameState.lastRewardX + maxPotentialDistanceToCatchReward > gameState.gameArea.rightEdge ? gameState.gameArea.rightEdge : gameState.lastRewardX + maxPotentialDistanceToCatchReward;
    const randomXCoord = Math.random() * gameState.gameArea.width;
    const xCoord = Phaser.Math.Clamp(randomXCoord, rewardMinBoundary, rewardMaxBoundary);
    const randomRewardKey = Math.random() > 0.5 ? gameConstants.rewards.starKey : gameConstants.rewards.heartKey;
    const rewardScale = randomRewardKey === gameConstants.rewards.starKey ? gameConstants.rewards.starScale : gameConstants.rewards.heartScale;
    const reward = rewards.create(xCoord, 0, randomRewardKey).setScale(rewardScale);
    gameState.lastRewardX = reward.x;
}

   const createRewardLoop = this.time.addEvent({
    // generates a random number of MS between 1000 and 1200
    delay: Math.floor(Math.random() * (1200 - 1000 + 1)) + 1000,
    callback: createReward,
    callbackScope: this,
    loop: true,
});

// creates penalties group, adds generator function, and starts generator loop
    const penalties = this.physics.add.group({
        gravityY: gameConstants.penalties.gravity
      });
    
    const createPenalty = () => {
      // creates buffer to ensure that the penalty will drop at least 10% of the game width away from the last reward dropped
      const penaltyBuffer = gameState.gameArea.width * 0.1;

      // if last reward was dropped on the left side of the screen, the minimum boundary is the last reward x-coordinate plus the buffer
      // otherwise, the minimum boundary is the left edge of the game area
      const penaltyMinBoundary = gameState.lastRewardX < gameState.gameArea.width / 2 ? gameState.lastRewardX + penaltyBuffer : gameState.gameArea.leftEdge;

      // if last reward was dropped on the right side of the screen, the maximum boundary is the last reward x-coordinate minus the buffer
      // otherwise, the maximum boundary is the right edge of the game area
      const penaltyMaxBoundary = gameState.lastRewardX > gameState.gameArea.width / 2 ? gameState.lastRewardX - penaltyBuffer : gameState.gameArea.rightEdge;

      // creates penalty at random x-coordinate within the buffer
      const randomXCoord = Math.random() * gameState.gameArea.width;
      const xCoord = Phaser.Math.Clamp(randomXCoord, penaltyMinBoundary, penaltyMaxBoundary);

      // creates random penalty type
      const randomPenaltyKey = Math.random() > 0.5 ? gameConstants.penalties.angryKey : gameConstants.penalties.sadKey;
      const penaltyScale = randomPenaltyKey === gameConstants.penalties.angryKey ? gameConstants.penalties.angryScale : gameConstants.penalties.sadScale;
      const penalty = penalties.create(xCoord, 0, randomPenaltyKey).setScale(penaltyScale);
    }

    const createPenaltyLoop = this.time.addEvent({
      // generates a random number of MS between 1800 and 2000
      delay: Math.floor(Math.random() * (2000 - 1800 + 1)) + 1800,
      callback: createPenalty,
      callbackScope: this,
      loop: true,
    });


// creates bugs group, adds generator function, and starts generator loop
   const bugs = this.physics.add.group({
      gravityY: gameConstants.bugs.gravity
    });

  const createBug = () => {
    // creates buffer to ensure that the bug will drop within 10% of the game width away from the player to make it challenging
    const bugBuffer = gameState.gameArea.width * 0.1;
    const bugMinBoundary = gameState.player.x - bugBuffer < gameState.gameArea.leftEdge ? gameState.gameArea.leftEdge : gameState.player.x - bugBuffer;
    const bugMaxBoundary = gameState.player.x + bugBuffer > gameState.gameArea.rightEdge ? gameState.gameArea.rightEdge : gameState.player.x + bugBuffer;

    // creates bug at random x-coordinate within the buffer
    const randomXCoord = Math.random() * gameState.gameArea.width;
    const xCoord = Phaser.Math.Clamp(randomXCoord, bugMinBoundary, bugMaxBoundary);

    // creates random bug type
    const randomBugKey = Math.random() > 0.5 ? gameConstants.bugs.bug1Key : gameConstants.bugs.bug2Key;
    const bugScale = randomBugKey === gameConstants.bugs.bug1Key ? gameConstants.bugs.bug1Scale : gameConstants.bugs.bug2Scale;
    const bug = bugs.create(xCoord, 0, randomBugKey).setScale(bugScale);

    // sets hit area for bug to be smaller than actual bug
    const hitRadius = bug.width * 0.6 / 2; 
    bug.setCircle(hitRadius, bug.width * 0.2, bug.height * 0.2); // the offset values should be half of the difference between the hit area and the actual bug

    gameState.lastBugX = bug.x;
  }

  const createBugLoop = this.time.addEvent({
    delay: 5000,
    callback: createBug,
    callbackScope: this,
    loop: true,
  });

  // creates boosts group, adds generator function, and starts generator loop
  const boosts = this.physics.add.group({
    gravityY: gameConstants.boosts.gravity
  });

  const createBoost = () => {
    // creates buffer to ensure that the boost will drop at least 10% of the game width away from the last bug dropped
    const boostBuffer = gameState.gameArea.width * 0.1;

    // if last bug was dropped on the left side of the screen, the minimum boundary is the last bug x-coordinate plus the buffer
    // otherwise, the minimum boundary is the left edge of the game area
    const boostMinBoundary = gameState.lastBugX < gameState.gameArea.width / 2 ? gameState.lastBugX + boostBuffer : gameState.gameArea.leftEdge;

    // if last bug was dropped on the right side of the screen, the maximum boundary is the last bug x-coordinate minus the buffer
    // otherwise, the maximum boundary is the right edge of the game area
    const boostMaxBoundary = gameState.lastBugX > gameState.gameArea.width / 2 ? gameState.lastBugX - boostBuffer : gameState.gameArea.rightEdge;

    // creates boost at random x-coordinate within the buffer
    const randomXCoord = Math.random() * gameState.gameArea.width;
    const xCoord = Phaser.Math.Clamp(randomXCoord, boostMinBoundary, boostMaxBoundary);

    // creates random boost type
    const randomBoostNumber = Math.random();
    const randomBoostKey = randomBoostNumber > 0.5 ? gameConstants.boosts.coffeeKey : randomBoostNumber > 0.33 ? gameConstants.boosts.laptopKey : gameConstants.boosts.phoneKey;
    const boostScale = randomBoostKey === gameConstants.boosts.coffeeKey ? gameConstants.boosts.coffeeScale : randomBoostKey === gameConstants.boosts.laptopKey ? gameConstants.boosts.laptopScale : gameConstants.boosts.phoneScale;
    const boost = boosts.create(xCoord, 0, randomBoostKey).setScale(boostScale);
  }

  const createBoostLoop = this.time.addEvent({
    // generates a random number of MS between 5000 and 10000
    delay: Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000,
    callback: createBoost,
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

  // adds colliders for rewards

    this.physics.add.collider(rewards, platforms, function(reward) {
        reward.destroy();
      });

    this.physics.add.overlap(gameState.player, rewards, function(player, reward) {
        reward.destroy();
        gameState.score += 10;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
        });

  // adds colliders for penalties

      this.physics.add.collider(penalties, platforms, function(penalty) {
        penalty.destroy();
      });

    this.physics.add.overlap(gameState.player, penalties, function(player, penalty) {
        penalty.destroy();
        // checks for immunity before updating score
        if (!gameState.immune) {
        gameState.score = gameState.score > 10 ? gameState.score - 10 : 0;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
        };
        });
  
  // adds colliders for boosts

    this.physics.add.collider(boosts, platforms, function(boost) {
        boost.destroy();
      });

    this.physics.add.overlap(gameState.player, boosts, function(player, boost) {
        boost.destroy();
        gameState.immune = true;
        gameState.player.setTint(0x00ff00);

        gameState.immunityTimer = this.time.addEvent({
          delay: 5000,
          callback: () => {
            gameState.immune = false;
            gameState.player.clearTint();
          },
          callbackScope: this,
          loop: false,
        });
        }, null, this);


  // adds colliders for bugs with platform
    this.physics.add.collider(bugs, platforms, function(bug) {
        bug.destroy();
      }
    );

  // adds collider for bugs with player
    this.physics.add.overlap(gameState.player, bugs, function(player, bug) {

    // checks for immunity before ending game

    if (!gameState.immune) {
    
    // calculates app store rating based on score

    const appStoreRating = gameState.score >= 500 ? '⭐️⭐️⭐️⭐️⭐️' : gameState.score >= 400 ? '⭐️⭐️⭐️⭐️' : gameState.score >= 300 ? '⭐️⭐️⭐️' : gameState.score >= 200 ? '⭐️⭐️' : gameState.score >= 100 ? '⭐️' : 'Rejected 😭';

    // When the game ends, dispatch the event with the score and rating
      const gameEndEvent = new CustomEvent("gameEnded", {
        detail: { score: gameState.score, rating: appStoreRating }
      });
    
      window.dispatchEvent(gameEndEvent);

    // stops game generators and physics
      gameState.gameOver = true;
      createBugLoop.destroy();
      createRewardLoop.destroy();
      this.physics.pause();

      // stops Play Scene and starts Score Scene

      this.scene.stop('PlayScene')
      this.scene.start('ScoreScene', { appStoreRating: appStoreRating });
    }
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