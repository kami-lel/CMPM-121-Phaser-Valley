class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    // Scale the player
    this.setScale(3);
    // Add the player to the scene
    scene.add.existing(this);
    // play idle
    this.anims.play("idle");
    this.positionX = x;
    this.positionY = y;
    this.updatePosition(0, 0);
  }

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
    if(Phaser.Input.Keyboard.JustDown(left) && this.positionX != 0) {
      this.updatePosition(this.positionX - 1, this.positionY)
    }
    else if (Phaser.Input.Keyboard.JustDown(right) && this.positionX != this.scene.gridConfig.width - 1){
      this.updatePosition(this.positionX + 1, this.positionY)
    }
    else if (Phaser.Input.Keyboard.JustDown(up) && this.positionY != 0){
      this.updatePosition(this.positionX, this.positionY - 1)
    }
    else if (Phaser.Input.Keyboard.JustDown(down) && this.positionY != this.scene.gridConfig.height - 1){
      this.updatePosition(this.positionX, this.positionY + 1)
    }
  }
}

