import { Scene, Game, AUTO, Scale} from "phaser";

const gameState = {
	score: 0,
  gameOver: false,
  moveLeft: false,
  moveRight: false,
  moveUp: false,
  canPause: true,
};

const playerGravity = 300;
const starGravity = 300;
const bombGravity = 900;
const playerVelocity = 200;
const arrowSize = 80;
const playerHeight = 228;
const playerWidth = 232;
const spaceWidth = 800;
const spaceHeight = 1021;
const platformWidth = 800;
const platformHeight = 64;

function timeToFall(height, gravity) {
    var time = Math.sqrt((2 * height) / gravity);
    return time;
}

function maxPotentialDistanceToCatch(time, velocity) {
    var distance = velocity * time;
    return distance * 0.6;
}

class StartScene extends Scene {
    constructor(){
      super({ key: 'StartScene'})
    }

    preload() {
        this.load.image("space", "/assets/space1.png");
        this.load.image("ground", "/assets/spaceplatform.png");
        this.load.image("star", "/assets/star.png");
        this.load.image("bomb", "/assets/laserRed08.png");
        this.load.spritesheet("ionitron", "/assets/ionitronsprite.png", {
          frameWidth: playerWidth,
          frameHeight: playerHeight,
        });
      }
  
    create() {
    // sets game values based on screen width and height
    const screenHeight = this.scale.height;
    const screenWidth = this.scale.width;
    const scale = screenHeight > screenWidth ? screenHeight / spaceHeight : screenWidth / spaceWidth;

this.add.image(0, screenHeight, "space").setOrigin(0, 1).setScale(scale);


    
   const startText = this.add.text(screenWidth / 2, screenHeight / 4, 'Tap to Start', { fontSize: '22px', fill: 'white' }).setOrigin(0.5, 0.5);

   this.tweens.add({
    targets: startText,
    scaleX: 1.5, // Scale it to 150% of its original size
    scaleY: 1.5,
    duration: 1000, // Duration of one pulse
    ease: 'Sine.easeInOut', // Smooth easing
    yoyo: true, // Reverse the tween on completion, creating the "pulse" effect
    repeat: -1 // Repeat forever
  });

    this.add.image(screenWidth / 2, screenHeight / 3, "ionitron").setScale(0.25)
    this.add.text(screenWidth / 2, screenHeight / 3 + 50, 'Use arrow keys to move & jump', { fontSize: '16px', fill: 'white' }).setOrigin(0.5, 0.5);
    
    this.add.image(screenWidth / 2, screenHeight / 2, "star")
    this.add.text(screenWidth / 2, screenHeight / 2 + 50, 'Catch stars to gain points', { fontSize: '16px', fill: 'white' }).setOrigin(0.5, 0.5);

    this.add.image(screenWidth / 2, screenHeight / 1.5, "bomb")
    this.add.text(screenWidth / 2, screenHeight / 1.5 + 50, 'Avoid lasers or it\'s game over! ', { fontSize: '16px', fill: 'white' }).setOrigin(0.5, 0.5);

    this.add.text(screenWidth / 2, screenHeight / 1.2, 'Tap in the game area', { fontSize: '16px', fill: 'white' }).setOrigin(0.5, 0.5)
    this.add.text(screenWidth / 2, screenHeight / 1.2 + 15, 'to pause and resume', { fontSize: '16px', fill: 'white' }).setOrigin(0.5, 0.5)


    // starts game on click
    this.input.on('pointerup', () => {
        this.scene.stop('StartScene')
        this.scene.start('PlayScene')
      });
    }
  }

class PauseScene extends Scene {
    constructor(){
      super({ key: 'PauseScene'})
    }

    init(data) {
      this.pauseArea = data.pauseArea;
  }

  
    create() {
    // sets game values based on screen width and height
    const screenHeight = this.scale.height;
    const screenWidth = this.scale.width;
    
    this.add.text(screenWidth / 2, screenHeight / 2, 'Resume', { fontSize: '15px', fill: '#ffffff' }).setOrigin(0.5, 0.5);

    // resumes game on click within game area

    this.input.on('pointerdown', function (pointer)
    {
      if (pointer.x >= this.pauseArea.x && pointer.x <= this.pauseArea.x + this.pauseArea.width &&
        pointer.y >= this.pauseArea.y && pointer.y <= this.pauseArea.y + this.pauseArea.height) {
        this.scene.stop('PauseScene');
        this.scene.resume('PlayScene');
        }
    }, this);
    }
  }

class PlayScene extends Scene {
    constructor () {
      super({ key: 'PlayScene' })
    }

    preload() {
      this.load.image("space", "/assets/space1.png");
        this.load.image("ground", "/game/assets/spaceplatform.png");
        this.load.image("star", "/game/assets/star.png");
        this.load.image("bomb", "/game/assets/laserRed08.png");
        this.load.spritesheet("ionitron", "/assets/ionitronsprite.png", {
          frameWidth: playerWidth,
          frameHeight: playerHeight,
        });
        this.load.image("leftArrow", "/assets/leftarrow.png");
        this.load.image("rightArrow", "/assets/rightarrow.png");
        this.load.image("upArrow", "/assets/uparrow.png");
      }
  
    create () {

    // sets game values based on screen width and height
    const screenHeight = this.scale.height;
    const gameWidth = this.scale.width;
    const platformScale = gameWidth / platformWidth;
    const adjustedPlatformHeight = platformHeight * platformScale;
    const controlsHeight = screenHeight * 0.08 > adjustedPlatformHeight + arrowSize + 20 ? screenHeight * 0.08 : adjustedPlatformHeight + arrowSize + 20;
    const gameHeight = screenHeight - controlsHeight;
    const backgroundScale = gameHeight > gameWidth ? gameHeight / spaceHeight : gameWidth / spaceWidth;
    const leftEdge = gameWidth * 0.1;
    const rightEdge = gameWidth * 0.9;
    const starFallTime = timeToFall(gameHeight, starGravity);
    const maxPotentialDistanceToCatchStar = maxPotentialDistanceToCatch(starFallTime, playerVelocity);
    gameState.lastStarX = gameWidth / 2;
    gameState.gameOver = false;

    // defines pause area
    const pauseArea = {
      x: 0,                     // Starting x-coordinate of the rectangle
      y: 0,                     // Starting y-coordinate of the rectangle
      width: gameWidth,         // Width of the rectangle
      height: gameHeight        // Height of the rectangle
  };

    // pauses game on click

    this.input.on('pointerdown', function (pointer)
{
    if (gameState.gameOver) {
        return;
    }
    if (!gameState.canPause) {
        return;
    }
    
    // Check if the pointer is within the defined rectangular area
    if (pointer.x >= pauseArea.x && pointer.x <= pauseArea.x + pauseArea.width &&
        pointer.y >= pauseArea.y && pointer.y <= pauseArea.y + pauseArea.height) {
        this.scene.pause();
        this.scene.launch('PauseScene', { pauseArea: pauseArea });

    }

}, this);


    // sets background and static ground platform

this.add.image(0, gameHeight, "space").setOrigin(0, 1).setScale(backgroundScale);

    const platforms = this.physics.add.staticGroup();
    platforms.create(0, gameHeight, "ground").setOrigin(0, 0).setScale(platformScale).refreshBody();

    // sets player and player movement animation
    const scaledPlayerHeight = playerHeight * 0.25;
    const halfScaledPlayerHeight = scaledPlayerHeight / 2;
    gameState.player = this.physics.add.sprite(
      gameWidth / 2,
      gameHeight - halfScaledPlayerHeight,
      "ionitron",
    ).setScale(0.25);
    
    gameState.player.body.setGravityY(playerGravity);
    gameState.player.setBounce(0.2);
    gameState.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("ionitron", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "ionitron", frame: 4 }],
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("ionitron", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // adds collider between player and platforms
    this.physics.add.collider(gameState.player, platforms);

    // creates cursor keys
    gameState.cursors = this.input.keyboard.createCursorKeys();

    // adds score text
    const scoreTextFontSize = 15;
    const halfScoreTextFontSize = scoreTextFontSize / 2;
    gameState.scoreText = this.add.text(gameWidth / 2, gameHeight + halfScoreTextFontSize, 'Score: 0', { fontSize: '15px', fill: '#ffffff' }).setOrigin(0.5, 0);

    // defines value for arrow images
    const halfArrowSize = arrowSize / 2;
    const arrowOffset = gameWidth * 0.10;
    const hitAreaOffset = arrowOffset / 3;
    const arrowHeight = gameHeight + adjustedPlatformHeight + halfArrowSize + 10;

    // defines hit area for left and right arrows
    const hitArea = new Phaser.Geom.Circle(halfArrowSize, halfArrowSize, halfArrowSize + hitAreaOffset); // last value is radius

    // adds arrow images and hit areas
gameState.leftArrow = this.add.image(arrowOffset + halfArrowSize, arrowHeight, 'leftArrow').setInteractive(hitArea, Phaser.Geom.Circle.Contains);
gameState.rightArrow = this.add.image(gameWidth - halfArrowSize - arrowOffset, arrowHeight, 'rightArrow').setInteractive(hitArea, Phaser.Geom.Circle.Contains);
gameState.upArrow = this.add.image(gameWidth / 2, arrowHeight, 'upArrow').setInteractive().setOrigin(0.5, 0.5);

    // adds touch controls
    gameState.leftArrow.on('pointerdown', () => {
      gameState.canPause = false;
      gameState.moveLeft = true;
    });
    gameState.leftArrow.on('pointerup', () => {
      gameState.canPause = true;
      gameState.moveLeft = false;
    });

    gameState.rightArrow.on('pointerdown', () => { 
      gameState.canPause = false;
      gameState.moveRight = true;
    });
    gameState.rightArrow.on('pointerup', () => {
      gameState.canPause = true;
      gameState.moveRight = false;
    });

    gameState.upArrow.on('pointerdown', () => {
      gameState.canPause = false;
      gameState.moveUp = true
    });
    gameState.upArrow.on('pointerup', () => {
      gameState.canPause = true;
      gameState.moveUp = false;
    });

    // adds stars
    const stars = this.physics.add.group({
        gravityY: starGravity
      });

    const createStar = () => {
        const playerMinBoundary = gameState.lastStarX - maxPotentialDistanceToCatchStar < leftEdge ? leftEdge : gameState.lastStarX - maxPotentialDistanceToCatchStar;
        const playerMaxBoundary = gameState.lastStarX + maxPotentialDistanceToCatchStar > rightEdge ? rightEdge : gameState.lastStarX + maxPotentialDistanceToCatchStar;
        const randomXCoord = Math.random() * gameWidth;
        const xCoord = Phaser.Math.Clamp(randomXCoord, playerMinBoundary, playerMaxBoundary);
        const star = stars.create(xCoord, 0, 'star')
        gameState.lastStarX = star.x;
    }
    
    const createStarLoop = this.time.addEvent({
        delay: 1000,
        callback: createStar,
        callbackScope: this,
        loop: true,
    });

    // adds colliders for stars

    this.physics.add.collider(stars, platforms, function(star) {
        star.destroy();
      });

    this.physics.add.overlap(gameState.player, stars, function(player, star) {
        star.destroy();
        gameState.score += 10;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
        });

    // adds bombs
    const bombs = this.physics.add.group({
        gravityY: bombGravity
      });
    
    const createBomb = () => {
        const bombBuffer = gameWidth * 0.1;
        const bombMinBoundary = gameState.player.x - bombBuffer < leftEdge ? leftEdge : gameState.player.x - bombBuffer;
        const bombMaxBoundary = gameState.player.x + bombBuffer > rightEdge ? rightEdge : gameState.player.x + bombBuffer;
        const randomXCoord = Math.random() * gameWidth;
        const xCoord = Phaser.Math.Clamp(randomXCoord, bombMinBoundary, bombMaxBoundary);
        const bomb = bombs.create(xCoord, 0, 'bomb')
    
    }

    const createBombLoop = this.time.addEvent({
        delay: 5000,
        callback: createBomb,
        callbackScope: this,
        loop: true,
    });

    // adds colliders for bombs with platform
    this.physics.add.collider(bombs, platforms, function(bomb) {
        bomb.destroy();
      }
    );

    // adds collider for bombs with player
    this.physics.add.overlap(gameState.player, bombs, function(player, bomb) {

      // stops game and displays game over text
        gameState.gameOver = true;
        createBombLoop.destroy();
        createStarLoop.destroy();
        this.physics.pause();


		this.add.text(gameWidth / 2, gameHeight / 2, 'Game Over', { fontSize: '18px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.add.text(gameWidth / 2, gameHeight / 2 + 25, 'Click to Restart', { fontSize: '18px', fill: '#ffffff' }).setOrigin(0.5, 0.5);

        // restarts game on click
			this.input.on('pointerup', () => {
				gameState.score = 0;
				this.scene.restart();
			});

    }, null, this);
}
  
    update () {

      // keyboard controls

        if (gameState.cursors.left.isDown && !gameState.cursors.right.isDown)
        {
            gameState.player.setVelocityX(0 - playerVelocity);
        
            gameState.player.anims.play('left', true);
        }
        else if (gameState.cursors.right.isDown && !gameState.cursors.left.isDown)
        {
            gameState.player.setVelocityX(playerVelocity);
        
            gameState.player.anims.play('right', true);
        }

        // touch controls

        else if (gameState.moveLeft && !gameState.moveRight) {
          gameState.player.setVelocityX(0 - playerVelocity);
      
          gameState.player.anims.play('left', true);
        }
        else if (gameState.moveRight && !gameState.moveLeft) {
          gameState.player.setVelocityX(playerVelocity);
      
          gameState.player.anims.play('right', true);
        }

        else
        {
            gameState.player.setVelocityX(0);
        
            gameState.player.anims.play('turn');
        }
        
        if (gameState.cursors.up.isDown && gameState.player.body.touching.down)
        {
            gameState.player.setVelocityY(0 - playerVelocity);
        }

        if (gameState.moveUp && gameState.player.body.touching.down) {
          gameState.player.setVelocityY(0 - playerVelocity);
        }
    }
  }

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
      backgroundColor: "#06163c",
      physics: {
        default: "arcade",
        arcade: {
          // debug: true
        },
      },
      scene: [StartScene, PlayScene, PauseScene],
    });
  }