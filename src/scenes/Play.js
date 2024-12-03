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
        this.selectCell = null; // player select cell

        this.undoStack = [];
        this.redoStack = [];
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
            this.updateResources(),               // undate cell resoure
            this.plantGrow()                    // grow plant
            // Make an ArrayBuffer snapshot of the game state and push it onto the Undo stack
            // Save autosave to local storage
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
                this.sowPlant(x); 
            });
            this.add.sprite(width / 1.35, 240 + x * 100, this.plant[x].type).setScale(1.3).setFrame(2)
        }

        this.add.text(width / 1.35, 530, "Reap", {
            fill: "#ffffff",
            fontSize: "48px",
            backgroundColor: "#D1C6B4",
        })
        .setInteractive()   // cell function when click
        .on("pointerdown", () => {  
            this.reapPlant(); 
        });

        // Initial Setup
        this.updateResources();
        this.updatePlayerState();
        this.updateCellInfo()
        this.updateDayCountText(days);
        // Make an ArrayBuffer snapshot of the game state and push it onto the Undo stack
        // Make autosave and save it to local storage
      }
    
    
    update() {
        // handle player movement
        this.player.updatePlayer();
        this.updatePlayerState();
        this.updateCellInfo();
        this.updateMoneyText(money);
        if (money >= 100){
            this.scene.start("winScene");
        }
    }

    reapPlant(){
        let plantCell;
        if (this.selectCell){
            plantCell = this.selectCell
        }else{
            plantCell = this.foundCell(this.player.positionX, this.player.positionY);
        }
        if (plantCell && plantCell.growthLevel >= 2){
            money += this.plant[plantCell.plantTpye].price;
            plantCell.hasPlant = false; 
            plantCell.plantTpye = null; 
            plantCell.growthLevel = 0;
            plantCell.plantSprite.destroy();
            plantCell.plantSprite = null;
            // Make an ArrayBuffer snapshot of the game state and push it onto the Undo stack
        }

    }

    // if player away from select cell, make select cell null
    setBorderVisble(){
        if (this.selectCell){
            this.selectCell.border.setVisible(false);
        }
        if (this.selectCell && this.checkIsNearPlayer(this.selectCell, this.foundCell(this.player.positionX, this.player.positionY))){
            this.selectCell.border.setVisible(true)
        }else{
            this.selectCell = null;
        }
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

    sowPlant(plantindex){
        let playerCell 
        if (this.selectCell){
            playerCell = this.selectCell
        }else{
            playerCell = this.foundCell(this.player.positionX, this.player.positionY);
        }
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
            // Make an ArrayBuffer snapshot of the game state and push it onto the Undo stack
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
        if (this.selectCell){
            this.displayPosition.setText(`Select Position: \n (${this.selectCell.row}, ${this.selectCell.col})`);
        }else{
            this.displayPosition.setText(`Select Position: \n (${this.player.positionX}, ${this.player.positionY})`);
        }
    }

    // updated cell info (sun & water level)
    updateCellInfo(){
        const playerCell = this.foundCell(this.player.positionX, this.player.positionY);
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
            const border = this.add.rectangle(
                cellX, 
                cellY, 
                this.gridConfig.size, 
                this.gridConfig.size, 
                )
            .setStrokeStyle(3, 0x000000).setVisible(false).setDepth(3);
            
            this.grid.push({ 
                row, 
                col, 
                rect: cell,
                border: border, 
                sun: 0, 
                water: 0, 
                hasPlant: false, 
                plantTpye: null, 
                growthLevel: 0,
                plantSprite: null
            });
            cell.setInteractive().on("pointerdown", () => {
                if (this.selectCell){
                    this.selectCell.border.setVisible(false);
                }
                this.selectCell = this.foundCell(row, col);
                if (this.checkIsNearPlayer(this.selectCell, this.foundCell(this.player.positionX, this.player.positionY))){
                    this.selectCell.border.setVisible(true)
                }else{
                    this.selectCell = null;
                }   
            });
          }
        }
    }

    //return ture if cell is near player
    checkIsNearPlayer(playerCell, selectCell){
        if (playerCell.row === selectCell.row && playerCell.col === selectCell.col){
            return true;
        }else{
            const differenceX = selectCell.row -playerCell.row;
            const differenceY = selectCell.col -playerCell.col;
            if (differenceX <= 1 && differenceX >= -1){
                if (differenceY <= 1 && differenceY >= -1){
                    return true
                } 
            }
            return false;
        }
    }

    // updated sun and water levels every days
    updateResources(){
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
    foundCell(row, col) {
        return this.grid.find(
          (cell) => cell.row === row && cell.col === col
        );
    }

    // Saving And Loading

    arrayBufferToBase64(buffer) {
        let binary = "";
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    base64ToArrayBuffer(base64) {
        let binary_string = window.atob(base64);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // An ArrayBuffer is organized as follows:
    // 0: "Player Position"
    // 1-2: "Money"
    // 3-4: "Days"
    // 5-54: "Grid cells, each cell is 2 bytes"

    // Grid Cell Structure:
    // Grid cells are read as 16-bit integers
    // The thousands and ten-thousands digits are the water level
    // The hundreds digit is the sun level
    // The tens digit is the plant type
    // The ones digit is the plant growth level

    // A save file is comprised of two stacks of ArrayBuffers - Undo and Redo
    // Each ArrayBuffer is a snapshot of the game state - the one on top of Undo is the current state
    // The save file is a base64 string of the two stacks, separated by a delimiter

    // The game has four save files, using the keys autosave, save1, save2, and save3
    // The game will autosave every time the player clicks the Next Day button

    // A new ArrayBuffer is generated every time the player sows a plant, reaps a plant, or presses the Next Day button
    // The new ArrayBuffer is pushed onto the Undo stack

    toArrayBuffer() {
        const buffer = new ArrayBuffer(55);
        const view = new DataView(buffer);
        view.setInt16(0, this.player.positionX, true);
        view.setInt16(2, this.player.positionY, true);
        view.setInt16(4, money, true);
        view.setInt16(6, days, true);
        for (let i = 0; i < this.grid.length; i++) {
          const cell = this.grid[i];
          const cellValue = cell.water * 1000 + cell.sun * 100 + cell.plantTpye * 10 + cell.growthLevel;
          view.setInt16(8 + i * 2, cellValue, true);
        }
        return buffer;
    }

    fromArrayBuffer(buffer) {
        const view = new DataView(buffer);
        this.player.positionX = view.getInt16(0, true);
        this.player.positionY = view.getInt16(2, true);
        money = view.getInt16(4, true);
        days = view.getInt16(6, true);
        for (let i = 0; i < this.grid.length; i++) {
          const cellValue = view.getInt16(8 + i * 2, true);
          const cell = this.grid[i];
          cell.water = Math.floor(cellValue / 1000);
          cell.sun = Math.floor(cellValue % 1000 / 100);
          cell.plantTpye = Math.floor(cellValue % 100 / 10);
          cell.growthLevel = Math.floor(cellValue % 10);
        }
    }

    stackToBase64(stack) {
        let base64 = "";
        for (const buffer of stack) {
          base64 += this.arrayBufferToBase64(buffer);
        }
        return base64;
    }

    base64ToStack(base64) {
        let stack = [];
        let buffer = new ArrayBuffer(0);
        let index = 0;
        for (let i = 0; i < base64.length; i++) {
          buffer[index] = base64[i];
          index++;
          if (index === buffer.byteLength) {
            stack.push(buffer);
            buffer = new ArrayBuffer(0);
            index = 0;
          }
        }
        return stack;
    }

    saveToLocalStorage(key) {
        const undoString = this.stackToBase64(this.undoStack);
        const redoString = this.stackToBase64(this.redoStack);
        const save = undoString + "|" + redoString;
        localStorage.setItem(key, save);
    }

    readFromLocalStorage(key) {
        const save = localStorage.getItem(key);
        const [undoString, redoString] = save.split("|");
        this.undoStack = this.base64ToStack(undoString);
        this.redoStack = this.base64ToStack(redoString);
    }
}
  