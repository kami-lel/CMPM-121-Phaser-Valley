// player prefab
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, direction) {
    super(scene, x, y, texture, frame); // call Sprite parent class
    scene.add.existing(this); // add player to existing scene
    scene.physics.add.existing(this); // add physics body to scene

    this.body.setSize(this.width / 2, this.height / 2);
    this.body.setCollideWorldBounds(true);

    // set custom player properties
    this.direction = direction;
    this.playerVelocity = 100; // in pixels

    // initialize state machine managing player (initial state, possible states, state args[])
    scene.playerFSM = new StateMachine("idle", {
      idle: new IdleState(),
      move: new MoveState(),
    }, [scene, this]); // pass these as arguments to maintain scene/object context in the FSM
  }
}

// player-specific state classes
class IdleState extends State {
  enter(scene, player) {
    player.setVelocity(0);
    player.anims.play(`walk-${player.direction}`);
    player.anims.stop();
  }

  execute(scene, player) {
    // use destructuring to make a local copy of the keyboard object
    const { left, right, up, down } = scene.keys;

    // transition to move if pressing a movement key
    if (left.isDown || right.isDown || up.isDown || down.isDown) {
      this.stateMachine.transition("move");
      return;
    }
  }
}

class MoveState extends State {
  execute(scene, player) {
    // use destructuring to make a local copy of the keyboard object
    const { left, right, up, down } = scene.keys;

    // transition to idle if not pressing movement keys
    if (!(left.isDown || right.isDown || up.isDown || down.isDown)) {
      this.stateMachine.transition("idle");
      return;
    }

    // handle movement
    let moveDirection = new Phaser.Math.Vector2(0, 0);
    if (up.isDown) {
      moveDirection.y = -1;
      player.direction = "up";
    } else if (down.isDown) {
      moveDirection.y = 1;
      player.direction = "down";
    }
    if (left.isDown) {
      moveDirection.x = -1;
      player.direction = "left";
    } else if (right.isDown) {
      moveDirection.x = 1;
      player.direction = "right";
    }
    // normalize movement vector, update player position, and play proper animation
    moveDirection.normalize();
    player.setVelocity(
      player.playerVelocity * moveDirection.x,
      player.playerVelocity * moveDirection.y,
    );
    player.anims.play(`walk-${player.direction}`, true);
  }
}
