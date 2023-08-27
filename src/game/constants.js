
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
    rewards: {
      gravity: 300,
      starPath: "assets/emote_star.png",
      starKey: "star",
      starSize: 16,
      starScale: 2,
      heartPath: "assets/emote_heart.png",
      heartSize: 16,
      heartScale: 2,
      heartKey: "heart"
    },
    penalties: {
      gravity: 300,
      angryPath: "assets/emote_angry.png",
      angryKey: "angry",
      angrySize: 16,
      angryScale: 2,
      sadPath: "assets/emote_sad.png",
      sadKey: "sad",
      sadSize: 16,
      sadScale: 2,
    },
    boosts: {
      gravity: 900,
      coffeePath: "assets/coffee.png",
      coffeeKey: "coffee",
      coffeeSize: 117,
      coffeeScale: 0.4,
      laptopPath: "assets/laptop.png",
      laptopKey: "laptop",
      laptopSize: 143,
      laptopScale: 0.4,
      phonePath: "assets/phone.png",
      phoneKey: "phone",
      phoneSize: 58,
      phoneScale: .75,
    },
    bugs: {
      gravity: 900,
      bug1Path: "assets/bug1.png",
      bug1Key: "bug1",
      bug1Size: 50,
      bug1Scale: 1,
      bug2Path: "assets/bug2.png",
      bug2Key: "bug2",
      bug2Size: 50,
      bug2Scale: 1,
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
    },
    reviews: {
      bad: [
        'this app made me throw my phone in the river',
        'using this app cost me my job and my family',
        'this app is the worst thing that ever happened to me',
        'my pet rock could design a better app',
        'I would give zero stars if I could',
        'I liked this app... until I used it',
        'I think this app is the reason my hair is falling out',
      ],
      okay: [
        'this app didn\'t kill me',
        'this app is the sandwich of lunches',
        'this app is better than a sharp stick in the eye',
        'it exists, I guess',
        'it\'s like toast without butter. Plain.',
        'I didn\'t uninstall...yet',
        'better than watching paint dry'
      ],
      good: [
        'I finally moved out of my parents\' basement thanks to this app',
        'thanks to this app, I don\'t dread Mondays...as much',
        'not bad, not great, kinda like my ex',
        'I\'m slightly more efficient now',
        'like a decent cup of coffee on a sleepy morning',
        'didn\'t blow my mind, but it did ruffle my hair a bit',
        'it\'s the kind of app I\'d introduce to my friends, but maybe not my family'
      ],
      great: [
        'this app is the best thing that ever happened to me',
        'this app is like a chocolate chip in a sea of raisins',
        'it\'s like finding extra fries at the bottom of the bag',
        'life before this app? Can\'t even remember',
        'I would marry this app if I could'
      ]
    }
    
  };

  export default gameConstants;
  