// deno-lint-ignore-file
class Load extends Phaser.Scene {
  constructor() {
    super("loadScene");
  }

  preload() {
    // Load external DSL
    this.load.text("gameConfig", "./config/scenario.yaml")
    // load the visual goodz
    this.load.path = "./assets/";
    this.load.image("titlePage", "Title.png");
    this.load.image("buttonGraphic", "red.png");
    this.load.spritesheet("player", "mystic_woods_free/sprites/characters/player.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("mushroom", "tiny_swords/spritesheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("stone",  "tiny_swords/spritesheet1.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("grass", "tiny_swords/spritesheet2.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("pumpkin",   "tiny_swords/spritesheet3.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.anims.create({
      key: "idle",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("player", { start: 6, end: 11 }),
    });

    // proceed once loading completes
    this.scene.start("titleScene");
  }
}
