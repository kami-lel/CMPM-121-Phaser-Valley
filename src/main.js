// debug with extreme prejudice
"use strict";

// game config
const config = {
  parent: "phaser-game", // for info text
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  zoom: 2,
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
