class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    init() {
        // color for the cell 
        this.landColor = 0x926829;
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
        
        this.dayCountText = this.add.text(10, 5, "", { fontSize: 36 });
        this.nextDayButton = this.add.text(width / 1.2, 10, "Next Day", {
            fill: "#ffffff",
            fontSize: "25px",
            backgroundColor: "#D1C6B4",
        })
        .setInteractive()
        .on("pointerdown", () => this.updateDayCountText(++days));

        // udated day counter
        this.updateDayCountText(days);
      }
    
    
    update() {
        // handle player movement
        this.player.updatePlayer();
    }

    // udated day counter
    updateDayCountText(days) {
        this.dayCountText.setText(`Day: ${days}`);
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
  