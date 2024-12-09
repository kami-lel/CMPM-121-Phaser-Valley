// deno-lint-ignore-file
// debug with extreme prejudice
"use strict";


// game config
const config = {
  parent: "phaser-game", // for info text
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  backgroundColor: '#7ac769',
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Load, Title, ContinueMenu, LoadMenu, SaveMenu, Credits, Play, Win],
  scale: {
    mode: Phaser.Scale.FIT
  }
};

var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {} };

const game = new Phaser.Game(config);
const { height, width } = game.config;
let days = 0;
let money = 10;