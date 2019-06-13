class Level1 extends Level {
  constructor() {
    super('Level1');
    this.heights = [4, null, 5, null, 5, 4, null, 4, 4];
    this.weather = 'mountains';
  }
  preload() {
    this.load.image('platform', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/platform_1.png');
    this.load.image('snowflake', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/snowflake.png');
    this.load.spritesheet('snowglow', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/snowglow-big.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('mona', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/mona.png', { frameWidth: 72, frameHeight: 90 });
    this.load.image('bg1', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/mountain.png');
    this.load.image('bg2', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/trees-long.png');
    this.load.image('bg3', 'file:///Users/trinealnaes/IxD/Mirror/Semester%204/Tema%2016/phaser-game/game/assets/ground-stones.png');
  }
  create() {
    gameState.active = true;
    gameState.bgColor = this.add.rectangle(0, 0, config.width, config.height, 0x00ffbb).setOrigin(0, 0);
    this.createParallaxBackgrounds();
    gameState.player = this.physics.add.sprite(125, 110, 'mona').setScale(.65);
    gameState.platforms = this.physics.add.staticGroup();
    this.createAnimations();
    this.createSnow();
    this.levelSetup();
    this.cameras.main.setBounds(0, 0, gameState.bg3.width, gameState.bg3.height);
    this.physics.world.setBounds(0, 0, gameState.width, gameState.bg3.height + gameState.player.height);
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
      gameState.platforms.create((220 * xIndex), yIndex * 70, 'platform').setOrigin(0, 0.5).refreshBody();
    } /* xIndex - bredden på spillet så platformene fordeles utover jevnt */
  } /* yIndex - hvor i høyden platformene skal plasseres */
  createSnow() {
    gameState.particles = this.add.particles('snowflake');
    gameState.emitter = gameState.particles.createEmitter({
      x: { min: 0, max: config.width * 2 },
      y: -5,
      lifespan: 2000,
      speedX: { min: -5, max: -200 },
      speedY: { min: 200, max: 300 },
      scale: { start: 0.4, end: 0 },
      quantity: 8,
      blendMode: 'ADD'
    });
    gameState.emitter.setScrollFactor(0);
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
      key: 'snowglow',
      frames: this.anims.generateFrameNumbers('snowglow'),
      frameRate: 6,
      repeat: -1
    });
  }
  createParallaxBackgrounds() {
    gameState.bg1 = this.add.image(0, -30, 'bg1');
    gameState.bg2 = this.add.image(0, 0, 'bg2');
    gameState.bg3 = this.add.image(0, 0, 'bg3');
    gameState.bg1.setOrigin(0, 0);
    gameState.bg2.setOrigin(0, 0);
    gameState.bg3.setOrigin(0, 0);
    const game_width = parseFloat(gameState.bg3.getBounds().width);
    gameState.width = game_width;
    const window_width = config.width;
    const bg1_width = gameState.bg1.getBounds().width;
    const bg2_width = gameState.bg2.getBounds().width;
    const bg3_width = gameState.bg3.getBounds().width;
    gameState.bgColor.setScrollFactor(0);
    gameState.bg1.setScrollFactor((bg1_width - window_width) / (game_width - window_width));
    gameState.bg2.setScrollFactor((bg2_width - window_width) / (game_width - window_width));
  }
  levelSetup() {
    for (const [xIndex, yIndex] of this.heights.entries()) {
      this.createPlatform(xIndex, yIndex);
    }
    // Create the snowglow at the end of the level
    gameState.goal = this.physics.add.sprite(gameState.width - 60, 120, 'snowglow');
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
      gameState.goal.anims.play('snowglow', true);
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
      if (gameState.player.y > gameState.bg3.height) {
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
      'mountains': {
        'color': 0xffffff,
        'snow': 1,
        'wind': 30,
        'bgColor': 0xabd3d3,
      }
    };
    let { color, bgColor, snow, wind } = weathers[weather];
    gameState.bg1.setTint(color);
    gameState.bg2.setTint(color);
    gameState.bg3.setTint(color);
    gameState.bgColor.fillColor = bgColor;
    gameState.emitter.setQuantity(snow);
    gameState.emitter.setSpeedX(-wind);
    gameState.player.setTint(color);
    for (let platform of gameState.platforms.getChildren()) {
      platform.setTint(color);
    }
    return;
  }
}
