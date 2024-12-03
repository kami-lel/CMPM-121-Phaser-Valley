class Title extends Phaser.Scene {
    constructor() {
      super("titleScene");
    }

    create (){
        // Title Background
        const backGround = this.add.image(600, 400, "titlePage");

        // Title
        this.titleText = this.add.text(500, 200, "Phaser Valley", {
            fontFamily: 'Arial', 
            fontSize: '24px', 
        });

        // Create Buttons
        this.buttonPlay = this.add.sprite(370, 510, "buttonGraphic").setScale(1.75, 1);
        this.buttonCredits = this.add.sprite(780, 510, "buttonGraphic").setScale(1.75, 1);
        this.buttonPlay.setInteractive();
        this.buttonCredits.setInteractive();

        // Button Text
        this.playText = this.add.text(350, 500, "Play");
        this.creditsText = this.add.text(750, 500, "Credits");
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

    init(){
        //
    }

    create(){
        //
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
        this.creditsTitle = this.add.text(400, 150, "Credits", {
            fontFamily: 'Arial', 
            fontSize: '24px', 
            align: 'center',
        });
        // Text alignment only applies to MULTI-LINE text; revise so all are one object
        this.programCredits = this.add.text(100, 200, "Core Programming by Haorong Rong", this.config);
        this.assistCredits = this.add.text(100, 250, "Save System by Ian Wallace", this.config);
        this.acidAssist = this.add.text(100, 300, "Title graphic made with assets from Kenney Assets", this.config);
        this.animationCredits = this.add.text(100, 350, "Terrain and Character sprites from Mystic Woods pack by Game Endeavor: https://game-endeavor.itch.io/mystic-woods", this.config);
        this.artCredits = this.add.text(100, 400, "Plant Sprites from Tiny Swords pack by Pixel Frog: https://pixelfrog-assets.itch.io/tiny-swords", this.config);
        
        this.buttonReturn = this.add.sprite(400, 560, "buttonGraphic").setScale(1.75, 1);
        this.buttonReturn.setInteractive();

        this.returnText = this.add.text(370, 550, "Return", this.config);
    }
    update (){
        this.buttonReturn.on('pointerdown', () => {
            this.scene.start("titleScene");
        });
    }

}