class Title extends Phaser.Scene {
    constructor() {
      super("titleScene");
    }

    create (){
        // Title Background
        const backGround = this.add.image(400, 300, "titlePage");

        // Title
        this.titleText = this.add.text(325, 200, "Phaser Valley", {
            fontFamily: 'Arial', 
            fontSize: '24px', 
        });

        // Create Buttons
        this.buttonPlay = this.add.sprite(200, 510, "buttonGraphic").setScale(1.75, 1);
        this.buttonCredits = this.add.sprite(600, 510, "buttonGraphic").setScale(1.75, 1);
        this.buttonPlay.setInteractive();
        this.buttonCredits.setInteractive();

        // Button Text
        this.playText = this.add.text(180, 500, "Play");
        this.creditsText = this.add.text(570, 500, "Credits");
    }
    update (){
        // Button Handlers
        this.buttonPlay.on('pointerdown', () => {
            this.scene.start("saveMenuScene");
        });
        this.buttonCredits.on('pointerdown', () => {
            this.scene.start("creditsScene");
        });
    }
}

class SaveMenu extends Phaser.Scene {
    constructor() {
      super("saveMenuScene");
    }

    create(){
        this.saveText = this.add.text(360, 75, "Saves", {
            fontFamily: 'Arial', 
            fontSize: '24px', 
        });

        this.buttonAutosave = this.add.sprite(400, 200, "buttonGraphic").setScale(2, 1);
        this.buttonSave1 = this.add.sprite(400, 275, "buttonGraphic").setScale(2, 1);
        this.buttonSave2 = this.add.sprite(400, 350, "buttonGraphic").setScale(2, 1);
        this.buttonSave3 = this.add.sprite(400, 425, "buttonGraphic").setScale(2, 1);
        this.buttonAutosave.setInteractive();
        this.buttonSave1.setInteractive();
        this.buttonSave2.setInteractive();
        this.buttonSave3.setInteractive();
        this.autosaveText = this.add.text(370, 190, "Autosave");
        this.save1Text = this.add.text(370, 265, "Save 1");
        this.save2Text = this.add.text(370, 340, "Save 2");
        this.save3Text = this.add.text(370, 415, "Save 3");
    }

    update(){
        // Button Handlers
        this.buttonAutosave.on('pointerdown', () => {
            this.scene.start("playScene", {saveSlot: "autosave"});
        });
        this.buttonSave1.on('pointerdown', () => {
            this.scene.start("playScene", {saveSlot: "save1"});
        });
        this.buttonSave2.on('pointerdown', () => {
            this.scene.start("playScene", {saveSlot: "save2"});
        });
        this.buttonSave3.on('pointerdown', () => {
            this.scene.start("playScene", {saveSlot: "save3"});
        });
    }
}

class Credits extends Phaser.Scene {
    constructor() {
      super("creditsScene");
    }

    init() {
        this.config = {
            fontFamily: 'Arial',
            align: 'center',
        }
    }

    create () {
        this.creditsTitle = this.add.text(360, 100, "Credits", {
            fontFamily: 'Arial', 
            fontSize: '24px', 
            align: 'center',
        });
        // Credits Text
        this.programCredits = this.add.text(50, 200, "Core Programming by Haorong Rong", this.config);
        this.saveCredits = this.add.text(50, 250, "Save System by Ian Wallace", this.config);
        this.titleCredits = this.add.text(50, 300, "Title graphic made with assets from Kenney Assets", this.config);
        this.terrainCredits = this.add.text(50, 350, "Terrain and Character sprites from Mystic Woods pack by Game Endeavor:\n https://game-endeavor.itch.io/mystic-woods", this.config);
        this.plantCredits = this.add.text(50, 400, "Plant Sprites from Tiny Swords pack by Pixel Frog:\n https://pixelfrog-assets.itch.io/tiny-swords", this.config);
        this.iconCredits = this.add.text(50, 450, "Save and Load icons by Iconoir Team under MIT License", this.config);

        this.buttonReturn = this.add.sprite(380, 560, "buttonGraphic").setScale(1.75, 1);
        this.buttonReturn.setInteractive();

        this.returnText = this.add.text(355, 550, "Return", this.config);
    }
    update (){
        this.buttonReturn.on('pointerdown', () => {
            this.scene.start("titleScene");
        });
    }

}