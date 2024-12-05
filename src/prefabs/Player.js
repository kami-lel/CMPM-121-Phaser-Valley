// deno-lint-ignore-file
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    // Scale the player
    this.setScale(3);

    // Add the player to the scene
    scene.add.existing(this);

    // play idle
    this.anims.play("idle");

    // position of the player on grid
    this.positionX = x;
    this.positionY = y;

    // set player position
    this.updatePosition(0, 0);
  }

  // function that change player position
  updatePosition(row, col) {
    this.x = this.scene.gridConfig.size + this.scene.gridConfig.size * row;
    this.y = this.scene.gridConfig.size + this.scene.gridConfig.size * col - 10;
    this.positionX = row;
    this.positionY = col
  }

  updatePlayer(){
    // make a local copy of the keyboard object
    const { left, right, up, down} = this.scene.keys
    if (!this.active)
	  {
		  return
	  }
    // move left
    if(Phaser.Input.Keyboard.JustDown(left) && this.positionX != 0) {
      this.updatePosition(this.positionX - 1, this.positionY)
      this.scene.setBorderVisble();
    }
    // move right
    else if (Phaser.Input.Keyboard.JustDown(right) && this.positionX != this.scene.gridConfig.width - 1){
      this.updatePosition(this.positionX + 1, this.positionY)
      this.scene.setBorderVisble();
    }
    // move up
    else if (Phaser.Input.Keyboard.JustDown(up) && this.positionY != 0){
      this.updatePosition(this.positionX, this.positionY - 1)
      this.scene.setBorderVisble();
    }
    // move down
    else if (Phaser.Input.Keyboard.JustDown(down) && this.positionY != this.scene.gridConfig.height - 1){
      this.updatePosition(this.positionX, this.positionY + 1)
      this.scene.setBorderVisble();
    }
  }
}

