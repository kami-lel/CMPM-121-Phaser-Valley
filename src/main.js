// debug with extreme prejudice
"use strict";

// game config
const config = {
  parent: "phaser-game", // for info text
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Load, Play],
};

var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {} };

const game = new Phaser.Game(config);
const { height, width } = game.config;
let days = 0;
