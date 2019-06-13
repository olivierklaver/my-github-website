class Level extends Phaser.Scene {
    constructor(key) {
      super({key});
      this.levelKey = key
      this.nextLevel = {
        'Level1': 'Level2'
      }
    }
  }

// // Extended levels for further development
//   class Level3 extends Level { // Sette opp nytt class element med alt innhold som i main Level
//     constructor() {
//       super('Level3')
//       this.heights = [4, null, 3, 6, null, 6, null, 5, 4];
//       this.weather = 'twilight';
//     }
//   }

//   class Level4 extends Level {
//     constructor() {
//       super('Level4')
//       this.heights = [6, null, 6, 4, 6, 4, 5, null, 4];
//       this.weather = 'ocean';
//     }
//   }

//   class Level5 extends Level {
//     constructor() {
//       super('Level5')
//       this.heights = [5, 4, null, 6, null, 5, null, 5, 5];
//       this.weather = 'morning';
//     }
//   }

  const gameState = {
    speed: 240,
    ups: 380,
  };
