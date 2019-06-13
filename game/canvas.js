const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    fps: {target: 60},
    backgroundColor: "b9eaff",
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 800 },
        enableBody: true,
  
      }
    },
    scene: [Level1, Level2]
  };
  
  const game = new Phaser.Game(config);