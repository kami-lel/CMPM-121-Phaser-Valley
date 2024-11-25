class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }

  create() {
    // add new Player to scene (scene, x, y, key, frame, direction)
    this.player = new Player(this, 200, 150, "player", 0, "down");

    // setup keyboard input
    this.keys = this.input.keyboard.createCursorKeys();

    // debug key listener (assigned to D key)
    this.input.keyboard.on("keydown-D", function () {
      this.physics.world.drawDebug = this.physics.world.drawDebug
        ? false
        : true;
      this.physics.world.debugGraphic.clear();
    }, this);

    // update instruction text
    document.getElementById("info").innerHTML =
      "Arrows: move | D: debug (toggle)";
  }

  update() {
    // make sure we step (ie update) the player's state machine
    this.playerFSM.step();
  }
}
