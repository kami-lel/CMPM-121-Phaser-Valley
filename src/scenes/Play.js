class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    init() {
        // color for the cell 
        this.landColor = 0x926829;
        this.gridConfig = { width: 5, height: 5, size: 100 };
        this.grid = []; // Store grid cells
        this.plant = [
            {
                type: "mushroom",
                cost: 1,         // cost to plant it
                price: 10       // Selling price
            },
            {
                type: "grass",
                cost: 3,
                price: 25       // Selling price
            },
            {
                type: "pumpkin",
                cost: 5,
                price: 50       // Selling price
            }
        ]
    }

    create() {
        // create 2d grid
        this.createGrid();
        // create player
        this.player = new Player(this, 0, 0, "player").setDepth(3);
        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        
        this.dayCountText = this.add.text(10, 5, "", { fontSize: 36 });
        this.nextDayButton = this.add.text(width / 1.3, 10, "Next Day", {
            fill: "#ffffff",
            fontSize: "32px",
            backgroundColor: "#D1C6B4",
        })
        .setInteractive()   // cell function when click
        .on("pointerdown", () => {  
            this.updateDayCountText(++days),    // change Day value
            this.updateResoure(),               // undate cell resoure
            this.plantGrow()                    // grow plant
        });

        // show the win conditions
        this.add.text(width * 0.2, height - 40, "Goal: Earn $100", { fontSize: 36 });
        
        // display player money
        this.playerMoney = this.add.text(width / 1.45, 50, `Money: $${money}`, { fontSize: 24 });
        // displaye player position
        this.displayPosition = this.add.text(width / 1.45, 80, "", { fontSize: 24 });
        // display cell info
        this.cellInfo = this.add.text(width / 1.45, 130, "", { fontSize: 24 });

        // sow plant board
        for (let x = 0; x < this.plant.length; x++){
            this.add.text(width / 1.45, 180 + x * 100, `sow ${this.plant[x].type} $${this.plant[x].cost}`, {
                fill: "#ffffff",
                fontSize: "24px",
                backgroundColor: "#D1C6B4",
            })
            .setInteractive()   // cell function when click
            .on("pointerdown", () => {  
                this.sowplant(x); 
            });
            this.add.sprite(width / 1.35, 240 + x * 100, this.plant[x].type).setScale(1.3).setFrame(2)
        }

        // Initial Setup
        this.updateResoure();
        this.updatePlayerState();
        this.updateCellInfo()
        this.updateDayCountText(days);
      }
    
    
    update() {
        // handle player movement
        this.player.updatePlayer();
        this.updatePlayerState();
        this.updateCellInfo();
        this.updateMoneyText(money);
    }

    plantGrow(){
        this.grid.forEach((cell) => {
            if (cell.hasPlant && cell.growthLevel <= 1){
                if (cell.sun >= 1 && cell.water >= 2){
                    cell.growthLevel++
                    cell.water -= 2;
                    cell.plantSprite.setFrame(cell.growthLevel)
                }
            }
        });
    }

    sowplant(plantindex){
        const playerCell = this.getPlayerCell();
        if (playerCell && !playerCell.hasPlant && money >= this.plant[plantindex].cost){
            money -= this.plant[plantindex].cost
            playerCell.hasPlant = true;
            playerCell.growthLevel = 0;
            playerCell.plantTpye = plantindex
            playerCell.plantSprite = this.add.sprite(
                playerCell.rect.x,
                playerCell.rect.y,
                this.plant[plantindex].type
            ).setScale(2)
        }else if (playerCell.hasPlant){
            console.log("This cell already have a plant")
        }
    }

    // updated day counter
    updateDayCountText(days) {
        this.dayCountText.setText(`Day: ${days}`);
      }

    // updated money
    updateMoneyText(money) {
        this.playerMoney.setText(`Money: $${money}`);
    }

    // updated player location
    updatePlayerState(){
        this.displayPosition.setText(`Player Position: \n (${this.player.positionX}, ${this.player.positionY})`);
    }

    // updated cell info (sun & water level)
    updateCellInfo(){
        const playerCell = this.getPlayerCell();
        this.cellInfo.setText(`SunLevel: ${playerCell.sun}\nWaterLevel: ${playerCell.water}`);
    }

    createGrid() {
        for (let row = 0; row < this.gridConfig.height; row ++) {
          for (let col = 0; col < this.gridConfig.width; col ++) {
            const cellX = row * this.gridConfig.size + this.gridConfig.size;
            const cellY = col * this.gridConfig.size + this.gridConfig.size;
            const cell = this.add.rectangle(
                cellX, 
                cellY, 
                this.gridConfig.size, 
                this.gridConfig.size, 
                this.landColor
                )
                .setStrokeStyle(3, 0xffffff);
            
            this.grid.push({ 
                row, 
                col, 
                rect: cell, 
                sun: 0, 
                water: 0, 
                hasPlant: false, 
                plantTpye: null, 
                growthLevel: 0,
                plantSprite: null
            });
          }
        }
    }

    // updated sun and water levels every days
    updateResoure(){
        this.grid.forEach((cell) => {
            cell.sun = Phaser.Math.Between(0, 5); 
            cell.water += Phaser.Math.Between(0, 3);
            // set the limit of maximum amount of water 
            if (cell.water >= 10){ 
                cell.water = 10;
            }
        });
    }

    // Find the cell the player is currently located
    getPlayerCell() {
        return this.grid.find(
          (cell) => cell.row === this.player.positionX && cell.col === this.player.positionY
        );
      }
}
  