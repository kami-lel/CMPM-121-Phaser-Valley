// deno-lint-ignore-file
class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    preload() {
        var url;
  
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);
    }

    init(data) {
        // load from scenario
        const gameConfig = jsyaml.load(this.cache.text.get("gameConfig"));
        this.textConfig = {
            fill: "#ffffff",
            fontSize: "32px",
            backgroundColor: "#D1C6B4",
        };

        // load External DSL for player position
        this.playerX = gameConfig.playerPosition.x
        this.playerY = gameConfig.playerPosition.y;

        this.landColor = gameConfig.landColor;

        // load External DSL for grid size
        this.gridConfig = { 
            width: gameConfig.GridConfig.Width, 
            height: gameConfig.GridConfig.Height, 
            size: gameConfig.GridConfig.Size };
        this.grid = [];

        // load External DSL for plant
        this.plant = []
        gameConfig.plant.forEach(plant => {
            this.plant.push({
                type: plant.type,
                cost: plant.cost,
                price: plant.price,
                sunNeed: plant.sunNeed, 
                waterNeed: plant.waterNeed,
                maxGrowth: plant.maxGrowth
            })
          });

        this.winCondition = gameConfig.winCondition;
        
        this.selectCell = null;

        this.saveSlot = data.saveSlot;

        this.undoStack = [];
        this.redoStack = [];
        
    }

    create() {
        this.ccc = "";

        
        // load translation 
        this.translations = getTranslations();
        this.createGrid();
        this.player = new Player(this, this.playerX, this.playerY, "player").setDepth(3);
        this.keys = this.input.keyboard.createCursorKeys();

        this.dayCountText = this.add.text(10, 5, "", { fontSize: 36 });

        this.nextDayButton = this.add.text(width / 1.3, 10, this.translations.NextDay, this.textConfig)
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

        this.undoButton = this.add.text(width * 0.03, height - 40, this.translations.Undo, this.textConfig)
        .setInteractive()
        .on("pointerdown", () => {  
            if (this.undoStack.length > 1) {
                this.redoStack.push(this.undoStack.pop());
                this.fromArrayBuffer(this.undoStack[this.undoStack.length - 1]);
            }
        });

        this.redoButton = this.add.text(width * 0.725, height - 40, this.translations.Redo, this.textConfig)
        .setInteractive()
        .on("pointerdown", () => {  
            if (this.redoStack.length > 0) {
                this.undoStack.push(this.redoStack.pop());
                this.fromArrayBuffer(this.undoStack[this.undoStack.length - 1]);
            }
        });

        this.saveButton = this.add.text(width * 0.6, 15, this.translations.Save, this.textConfig)
        .setInteractive()
        .on("pointerdown", () => {
            this.scene.bringToTop("saveMenuScene");
            this.scene.pause();
            this.scene.launch("saveMenuScene");
        });

        this.loadButton = this.add.text(width * 0.35, 15, this.translations.Load, this.textConfig)
        .setInteractive()
        .on("pointerdown", () => {
            this.scene.bringToTop("loadMenuScene");
            this.scene.pause();
            this.scene.launch("loadMenuScene");
        });

        // show the win conditions
        this.add.text(width * 0.2, height - 40, this.translations.Goal + `${this.winCondition}`, { fontSize: 36 });
        
        this.playerMoney = this.add.text(width / 1.45, 50, this.translations.Money +`${money}`, { fontSize: 24 });
        this.displayPosition = this.add.text(width / 1.45, 80, "", { fontSize: 24 });
        this.cellInfo = this.add.text(width / 1.45, 130, "", { fontSize: 24 });
        
        // sow plant board
        for (let x = 1; x < this.plant.length; x++){
            this.add.text(width / 1.45, 180 + (x-1) * 100, this.translations.Sow + this.translations.plant[x - 1] + ` $${this.plant[x].cost}`, {
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

        this.add.text(width / 1.35, 480, this.translations.Reap, {
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

        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 400,
                y: 300,
                radius: 100,
                base: this.add.circle(0, 0, 100, 0x888888).setAlpha(0.5),
                thumb: this.add.circle(0, 0, 50, 0xcccccc).setAlpha(0.5),
                // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                // forceMin: 16,
                // enable: true
            })
            .on('update', this.dumpJoyStickState, this);

        this.text = this.add.text(0, 0);
        this.dumpJoyStickState();
    }
    
    
    update() {
        this.player.updatePlayer();
        this.updatePlayerState(); 
        this.updateCellInfo();
        this.updateMoneyText(money);
        if (money >= this.winCondition){
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
        if (plantCell && plantCell.growthLevel >= this.plant[plantCell.plantType].maxGrowth){
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

    setBorderVisble(){
        if (this.selectCell){
            this.selectCell.border.setVisible(false);
        }
        if (this.selectCell && this.checkIsNear(this.selectCell, this.foundCell(this.player.positionX, this.player.positionY))){
            this.selectCell.border.setVisible(true)
        }else{
            this.selectCell = null;
        }
    }

    checkCanGrow(cell){
        if (!cell.hasPlant || cell.growthLevel >= 2){
            return false
        }
        const plantIndex = this.plant.findIndex((plant) => plant.type === this.plant[cell.plantType].type);
        if (cell.sun >= this.plant[plantIndex].sunNeed && cell.water >= this.plant[plantIndex].waterNeed){
            return true
        }
        return false
    }

    plantGrow(){
        this.grid.forEach((cell) => {
            if (this.checkCanGrow(cell)){
                const plantIndex = this.plant.findIndex((plant) => plant.type === this.plant[cell.plantType].type);
                cell.growthLevel++
                cell.water -= this.plant[plantIndex].waterNeed;
                cell.plantSprite.setFrame(cell.growthLevel)
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
            console.log("This cell already has a plant")
        }
    }

    updateDayCountText(days) {
        this.dayCountText.setText(this.translations.Day +`: ${days}`);
      }

    updateMoneyText(money) {
        this.playerMoney.setText(this.translations.Money + `${money}`);
    }

    updatePlayerState(){
        if (this.selectCell){
            this.displayPosition.setText(this.translations.SelectPosition + `: \n (${this.selectCell.row}, ${this.selectCell.col})`);
        }else{
            this.displayPosition.setText(this.translations.SelectPosition + `: \n (${this.player.positionX}, ${this.player.positionY})`);
        }
    }

    updateCellInfo(){
        if (this.selectCell){
            this.cellInfo.setText(this.translations.SunLevel + `: ${this.selectCell.sun}\n` + this.translations.WaterLevel +`: ${this.selectCell.water}`);
        }else{
            const playerCell = this.foundCell(this.player.positionX, this.player.positionY);
            this.cellInfo.setText(this.translations.SunLevel + `: ${playerCell.sun}\n` + this.translations.WaterLevel +`: ${playerCell.water}`);
        }
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
                if (this.checkIsNear(this.selectCell, this.foundCell(this.player.positionX, this.player.positionY))){
                    this.selectCell.border.setVisible(true)
                }else{
                    this.selectCell = null;
                }   
            });
          }
        }
    }

    // Check if two cell is near by
   checkIsNear(cellA, CellB){
    if (cellA.row === CellB.row && cellA.col === CellB.col){
        return true;
    }else{
        const differenceX = CellB.row - cellA.row;
        const differenceY = CellB.col - cellA.col;
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
        return window.btoa(binaryString);
    }

    base64ToArrayBuffer(base64) {
        let binaryString = window.atob(base64);
        let len = binaryString.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
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
          base64 += this.arrayBufferToBase64(buffer) + "@";
        }
        return base64;
    }

    base64ToStack(base64) {
        let stack = [];
        let bufferStrings = base64.split("@");
        for (const bufferString of bufferStrings) {
          if (bufferString) {
            stack.push(this.base64ToArrayBuffer(bufferString));
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
        const savedState = this.undoStack[this.undoStack.length - 1];
        this.fromArrayBuffer(savedState);
    }

    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        var s = 'Key down: ';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                s += name;
            }
        }

        s += `
Force: ${Math.floor(this.joyStick.force * 100) / 100}
Angle: ${Math.floor(this.joyStick.angle * 100) / 100}
`;

        s += '\nTimestamp:\n';
        for (var name in cursorKeys) {
            var key = cursorKeys[name];
            s += `${name}: duration=${key.duration / 1000}\n`;
        }
        // TODO this.text.setText(s);
    }
}