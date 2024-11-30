class Load extends Phaser.Scene {
  constructor() {
    super("loadScene");
  }

  preload() {
    // load the visual goodz
    this.load.path = "./assets/";
    this.load.spritesheet("player", "mystic_woods_free/sprites/characters/player.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.image("land", "land.png");
  }

  create() {
    this.anims.create({
      key: "idle",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("player", { start: 6, end: 11 }),
    });

    // proceed once loading completes
    this.scene.start("playScene");
  }
}
