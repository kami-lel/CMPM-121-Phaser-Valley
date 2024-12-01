
class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    init() {
        this.landColor = 0x1be032;
        this.gridConfig = { width: 5, height: 5, size: 100 };
        this.grid = []; // Store grid cells
    }

    create() {
        // create 2d grid
        this.createGrid();
        // create player
        this.player = new Player(this, 0, 0, "player");
        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
      }
    
    
    update() {
        // Player movement
        this.player.updatePlayer();
    }

    createGrid() {
        for (let row = 0; row < this.gridConfig.height; row ++) {
          for (let col = 0; col < this.gridConfig.width; col ++) {
            const cellX = row * this.gridConfig.size + this.gridConfig.size;
            const cellY = col * this.gridConfig.size + this.gridConfig.size;
            const cell = this.add.rectangle(cellX, cellY, this.gridConfig.size, this.gridConfig.size, this.landColor).setStrokeStyle(3, 0xffffff);
          this.grid.push({ row, col, rect: cell });
          }
        }
    }
}
  