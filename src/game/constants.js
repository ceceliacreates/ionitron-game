
// Constants used in the game in one file for easy updating

const gameConstants = {
    startFontColor: "#000000",
    scoreFontColor: "#ffffff",
    startFontSize: "16px",
    scoreFontSize: "16px",
    gameOverFontSize: "18px",
    player: {
      gravity: 300,
      velocity: 200,
      height: 228,
      width: 232,
      path: "assets/ionitron.png",
      key: "player"
    },
    star: {
      gravity: 300,
      path: "assets/star.png",
      key: "star"
    },
    bomb: {
      gravity: 900,
      path: "assets/laserRed08.png",
      key: "bomb"
    },
    arrow: {
      size: 80,
      leftPath: "assets/leftarrow.png",
      rightPath: "assets/rightarrow.png",
      upPath: "assets/uparrow.png",
      leftKey: "leftArrow",
      rightKey: "rightArrow",
      upKey: "upArrow",
    },
    background: {
      width: 800,
      height: 1021,
      path: "assets/officebg.png",
      key: "background"
    },
    platform: {
      width: 800,
      height: 64,
      path: "assets/officeplatform.png",
      key: "platform"
    }
  };

  export default gameConstants;
  