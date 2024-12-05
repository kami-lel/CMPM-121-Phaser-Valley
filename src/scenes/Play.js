class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    init(data) {
        this.landColor = 0x926829;
        this.gridConfig = { width: 5, height: 5, size: 100 };
        this.grid = [];
        this.plant = [
            {
                type: "none",   
                cost: 0,
                price: 0 ,
            },
            {
                type: "mushroom",
                cost: 1,
                price: 10,
            },
            {
                type: "grass",
                cost: 3,
                price: 25,
            },
            {
                type: "pumpkin",
                cost: 5,
                price: 50,
            }
        ]
        this.selectCell = null;

        this.saveSlot = data.saveSlot;

        this.undoStack = [];
        this.redoStack = [];
    }

    create() {
        this.createGrid();
        this.player = new Player(this, 0, 0, "player").setDepth(3);
        this.keys = this.input.keyboard.createCursorKeys()
        
        this.dayCountText = this.add.text(10, 5, "", { fontSize: 36 });

        this.nextDayButton = this.add.text(width / 1.3, 10, "Next Day", {
            fill: "#ffffff",
            fontSize: "32px",
            backgroundColor: "#D1C6B4",
        })
        .setInteractive()
        .on("pointerdown", () => {  
            this.updateDayCountText(++days),
            this.updateResources(),
            this.plantGrow()
            const nextDayBuffer = this.toArrayBuffer();
            this.undoStack.push(nextDayBuffer);
            this.redoStack = [];
            this.saveToLocalStorage("autosave");
        });

        this.undoButton = this.add.text(width * 0.075, height - 40, "Undo", {
            fill: "#ffffff",
            fontSize: "32px",
            backgroundColor: "#D1C6B4",
        })
        .setInteractive()
        .on("pointerdown", () => {  
            if (this.undoStack.length > 1) {
                this.redoStack.push(this.undoStack.pop());
                this.fromArrayBuffer(this.undoStack[this.undoStack.length - 1]);
            }
        });

        this.redoButton = this.add.text(width * 0.625, height - 40, "Redo", {
            fill: "#ffffff",
            fontSize: "32px",
            backgroundColor: "#D1C6B4",
        })
        .setInteractive()
        .on("pointerdown", () => {  
            if (this.redoStack.length > 0) {
                this.undoStack.push(this.redoStack.pop());
                this.fromArrayBuffer(this.undoStack[this.undoStack.length - 1]);
            }
        });

        this.saveButton = this.add.text(width * 0.6, 20, "Save", {
            fill: "#ffffff",
            fontSize: "32px",
            backgroundColor: "#D1C6B4",
        })
        .setInteractive()
        .on("pointerdown", () => {
            this.scene.bringToTop("saveMenuScene");
            this.scene.pause();
            this.scene.launch("saveMenuScene");
        });

        this.loadButton = this.add.text(width * 0.45, 20, "Load", {
            fill: "#ffffff",
            fontSize: "32px",
            backgroundColor: "#D1C6B4",
        })
        .setInteractive()
        .on("pointerdown", () => {
            this.scene.bringToTop("loadMenuScene");
            this.scene.pause();
            this.scene.launch("loadMenuScene");
        });

        // show the win conditions
        this.add.text(width * 0.2, height - 40, "Goal: Earn $100", { fontSize: 36 });
        
        this.playerMoney = this.add.text(width / 1.45, 50, `Money: $${money}`, { fontSize: 24 });
        this.displayPosition = this.add.text(width / 1.45, 80, "", { fontSize: 24 });
        this.cellInfo = this.add.text(width / 1.45, 130, "", { fontSize: 24 });

        // sow plant board
        for (let x = 1; x < this.plant.length; x++){
            this.add.text(width / 1.45, 180 + (x-1) * 100, `sow ${this.plant[x].type} $${this.plant[x].cost}`, {
                fill: "#ffffff",
                fontSize: "24px",
                backgroundColor: "#D1C6B4",
            })
            .setInteractive()
            .on("pointerdown", () => {  
                this.sowPlant(x); 
            });
            this.add.sprite(width / 1.35, 240 + (x-1) * 100, this.plant[x].type).setScale(1.3).setFrame(2)
        }

        this.add.text(width / 1.35, 530, "Reap", {
            fill: "#ffffff",
            fontSize: "48px",
            backgroundColor: "#D1C6B4",
        })
        .setInteractive()
        .on("pointerdown", () => {  
            this.reapPlant(); 
        });

        this.readFromLocalStorage(this.saveSlot);

        this.updateResources();
        this.updatePlayerState();
        this.updateCellInfo()
        this.updateDayCountText(days);

        const firstBuffer = this.toArrayBuffer();
        this.undoStack.push(firstBuffer);

        this.saveToLocalStorage("autosave");
    }
    
    
    update() {
        this.player.updatePlayer();
        this.updatePlayerState(); // maybe move this to payer prefab
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
            money += this.plant[plantCell.plantType].price;
            plantCell.hasPlant = false; 
            plantCell.plantType = 0; 
            plantCell.growthLevel = 0;
            plantCell.plantSprite.destroy();
            plantCell.plantSprite = null;

            const reapBuffer = this.toArrayBuffer();
            this.undoStack.push(reapBuffer);
            this.redoStack = [];
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

    sowPlant(plantIndex){
        let playerCell 
        if (this.selectCell){
            playerCell = this.selectCell
        }else{
            playerCell = this.foundCell(this.player.positionX, this.player.positionY);
        }
        if (playerCell && !playerCell.hasPlant && money >= this.plant[plantIndex].cost){
            money -= this.plant[plantIndex].cost
            playerCell.hasPlant = true;
            playerCell.growthLevel = 0;
            playerCell.plantType = plantIndex
            playerCell.plantSprite = this.add.sprite(
                playerCell.rect.x,
                playerCell.rect.y,
                this.plant[plantIndex].type
            ).setScale(2)
            const sowBuffer = this.toArrayBuffer();
            this.undoStack.push(sowBuffer);
            this.redoStack = [];
        }else if (playerCell.hasPlant){
            console.log("This cell already have a plant")
        }
    }

    updateDayCountText(days) {
        this.dayCountText.setText(`Day: ${days}`);
      }

    updateMoneyText(money) {
        this.playerMoney.setText(`Money: $${money}`);
    }

    updatePlayerState(){
        if (this.selectCell){
            this.displayPosition.setText(`Select Position: \n (${this.selectCell.row}, ${this.selectCell.col})`);
        }else{
            this.displayPosition.setText(`Select Position: \n (${this.player.positionX}, ${this.player.positionY})`);
        }
    }

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
            
            this.grid.push({ // make good type defs for this, maybe nest things
                row, 
                col, 
                rect: cell,
                border: border, 
                sun: 0, 
                water: 0, 
                hasPlant: false, 
                plantType: 0, 
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

    // move to player prefab
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

    updateResources(){
        this.grid.forEach((cell) => {
            cell.sun = Phaser.Math.Between(0, 5); 
            cell.water += Phaser.Math.Between(0, 3);
            if (cell.water >= 10){ 
                cell.water = 10;
            }
        });
    }

    foundCell(row, col) {
        return this.grid.find(
          (cell) => cell.row === row && cell.col === col
        );
    }

    // move to game manager
    // Saving And Loading Functions
    arrayBufferToBase64(buffer) {
        let binaryString = "";
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binaryString += String.fromCharCode(bytes[i]);
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

    toArrayBuffer() {
        const buffer = new ArrayBuffer(58);
        const view = new DataView(buffer);
        view.setInt16(0, this.player.positionX, true);
        view.setInt16(2, this.player.positionY, true);
        view.setInt16(4, money, true);
        view.setInt16(6, days, true);
        for (let i = 0; i < this.grid.length; i++) {
            const cell = this.grid[i];
            const cellValue = cell.water * 1000 + cell.sun * 100 + cell.plantType * 10 + cell.growthLevel;
            view.setInt16(8 + i * 2, cellValue, true);
        }
        return buffer;
    }

    fromArrayBuffer(buffer) {
        const view = new DataView(buffer);
        const row = view.getInt16(0, true);
        const col = view.getInt16(2, true);
        this.player.updatePosition(row, col);
        money = view.getInt16(4, true);
        days = view.getInt16(6, true);
        for (let i = 0; i < this.grid.length; i++) {
            const cellValue = view.getInt16(8 + i * 2, true);
            const cell = this.grid[i];
            cell.water = Math.floor(cellValue / 1000);
            cell.sun = Math.floor(cellValue % 1000 / 100);
            cell.plantType = Math.floor(cellValue % 100 / 10);
            if (cell.hasPlant && cell.plantType === 0) {
                cell.hasPlant = false;
                cell.plantSprite.destroy();
                cell.plantSprite = null;
            }
            if (cell.plantType !== 0) {
                if (!cell.hasPlant) {
                    cell.hasPlant = true;
                    cell.plantSprite = this.add.sprite(
                        cell.rect.x,
                        cell.rect.y,
                        this.plant[cell.plantType].type
                    ).setScale(2);
                }
            }
            cell.growthLevel = Math.floor(cellValue % 10);
            if (cell.hasPlant) {
                cell.plantSprite.setFrame(cell.growthLevel);
            }
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
        if (!save) {
            return;
        }
        const [undoString, redoString] = save.split("|");
        this.undoStack = this.base64ToStack(undoString);
        this.redoStack = this.base64ToStack(redoString);
    }
}
