// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics:{
        default: 'arcade',
        arcade:{
            debug: true
        }
    },
    width: 1440,
    height: 750,
    scene: [ Movement ]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}};

const game = new Phaser.Game(config);
let { height, width } = game.config;