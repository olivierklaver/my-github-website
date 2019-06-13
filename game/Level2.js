class Level2 extends Level {
  constructor() {
    super('Level2');
    this.heights = [4, null, 3, 6, null, 6, null, 5, 4];
    this.weather = 'ocean';
  }
  preload() {
    this.load.image('bubble-platform', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/bubbleplatform.png');
    this.load.spritesheet('corals', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/corals-orange.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('mona', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/mona.png', { frameWidth: 72, frameHeight: 90 });
    this.load.image('bg4', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/ocean_bg4.png');
    this.load.image('bg5', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/ocean_bg5.png');
    this.load.image('bg6', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/ocean_bg6.png');
  }
  create() {
    gameState.active = true;
    gameState.bgColor = this.add.rectangle(0, 0, config.width, config.height, 0x00ffbb).setOrigin(0, 0);
    this.createParallaxBackgrounds();
    gameState.player = this.physics.add.sprite(125, 110, 'mona').setScale(.65);
    gameState.platforms = this.physics.add.staticGroup();
    this.createAnimations();
    this.createBubbles();
    this.levelSetup();
    this.cameras.main.setBounds(0, 0, gameState.bg6.width, gameState.bg6.height);
    this.physics.world.setBounds(0, 0, gameState.width, gameState.bg6.height + gameState.player.height);
    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);
    gameState.player.setCollideWorldBounds(true);
    this.physics.add.collider(gameState.player, gameState.platforms);
    this.physics.add.collider(gameState.goal, gameState.platforms);
    gameState.cursors = this.input.keyboard.createCursorKeys();
  }
  createPlatform(xIndex, yIndex) {
    // Creates a platform evenly spaced along the two indices.
    // If either is not a number it won't make a platform
    if (typeof yIndex === 'number' && typeof xIndex === 'number') {
      gameState.platforms.create((220 * xIndex), yIndex * 70, 'bubble-platform').setOrigin(0, 0.5).refreshBody();
    } /* xIndex - bredden på spillet så platformene fordeles utover jevnt */
  } /* yIndex - hvor i høyden platformene skal plasseres */

  createBubbles() {
    gameState.bubbles = [];
    function getBubblePoints() {
      const color = 0x7eb6c9;
      return {
        x: Math.floor(Math.random() * 1000), // Makes bubbles random spread on the width of the canvas
        y: Math.floor(Math.random() * config.height * .7), // Same as ^, but the height, multiply with .7 to not cover the sand
        radius: Math.floor(Math.random() * 5), // Make the bubbles in different sizes
        color, // call the color from the const above
      };
    }
    for (let i = 0; i < 200; i++) {
      const { x, y, radius, color } = getBubblePoints();
      const bubble = this.add.circle(x, y, radius, color);
      bubble.setScrollFactor(Math.random() * .1);
      gameState.bubbles.push(bubble);
    }
  }
  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('mona', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('mona', { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('mona', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'corals',
      frames: this.anims.generateFrameNumbers('corals'),
      frameRate: 6,
      repeat: -1
    });
  }
  createParallaxBackgrounds() {
    gameState.bg4 = this.add.image(0, -30, 'bg4');
    gameState.bg5 = this.add.image(0, 0, 'bg5');
    gameState.bg6 = this.add.image(0, 0, 'bg6');
    gameState.bg4.setOrigin(0, 0);
    gameState.bg5.setOrigin(0, 0);
    gameState.bg6.setOrigin(0, 0);
    const game_width = parseFloat(gameState.bg6.getBounds().width);
    gameState.width = game_width;
    const window_width = config.width;
    const bg4_width = gameState.bg4.getBounds().width;
    const bg5_width = gameState.bg5.getBounds().width;
    const bg6_width = gameState.bg6.getBounds().width;
    gameState.bgColor.setScrollFactor(0);
    gameState.bg4.setScrollFactor((bg4_width - window_width) / (game_width - window_width));
    gameState.bg5.setScrollFactor((bg5_width - window_width) / (game_width - window_width));
  }
  levelSetup() {
    for (const [xIndex, yIndex] of this.heights.entries()) {
      this.createPlatform(xIndex, yIndex);
    }
    // Create the corals at the end of the level
    gameState.goal = this.physics.add.sprite(gameState.width - 60, 120, 'corals');
    this.physics.add.overlap(gameState.player, gameState.goal, function () {
      this.cameras.main.fade(800, 0, 0, 0, false, function (camera, progress) {
        if (progress > .9) {
          this.scene.stop(this.levelKey);
          this.scene.start(this.nextLevel[this.levelKey]);
        }
      });
    }, null, this);
    this.setWeather(this.weather);
  }
  update() {
    if (gameState.active) {
      gameState.goal.anims.play('corals', true);
      if (gameState.cursors.right.isDown) {
        gameState.player.flipX = false;
        gameState.player.setVelocityX(gameState.speed);
        gameState.player.anims.play('run', true);
      }
      else if (gameState.cursors.left.isDown) {
        gameState.player.flipX = true;
        gameState.player.setVelocityX(-gameState.speed);
        gameState.player.anims.play('run', true);
      }
      else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('idle', true);
      }
      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.touching.down) {
        gameState.player.anims.play('jump', true);
        gameState.player.setVelocityY(-500);
      }
      if (!gameState.player.body.touching.down) {
        gameState.player.anims.play('jump', true);
      }
      if (gameState.player.y > gameState.bg6.height) {
        this.cameras.main.shake(240, .01, false, function (camera, progress) {
          if (progress > .9) {
            this.scene.restart(this.levelKey);
          }
        });
      }
    }
  }
  setWeather(weather) {
    const weathers = {
      'ocean': {
        'bgColor': 0x0f2e4a,
      }
    };
    let { color, bgColor } = weathers[weather];
    gameState.bgColor.fillColor = bgColor;
    if (weather === 'ocean') {
      gameState.bubbles.forEach(bubble => bubble.setVisible(true));
    }
    else {
      gameState.bubbles.forEach(bubble => bubble.setVisible(false));
    }
    return;
  }
}
