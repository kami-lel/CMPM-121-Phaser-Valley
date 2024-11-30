class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    // Scale the player
    this.setScale(3);
    // Add the player to the scene
    scene.add.existing(this);

    // play idle
    this.anims.play("idle");
  }
}