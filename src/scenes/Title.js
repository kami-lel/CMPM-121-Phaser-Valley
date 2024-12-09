class Title extends Phaser.Scene {
    constructor() {
      super("titleScene");
    }

    create (){
        let translations = getTranslations();
        // Title Background
        const backGround = this.add.image(400, 300, "titlePage");
        this.buttonPressed = false;

        // Title
        this.titleText = this.add.text(325, 200, translations.Title, {
            fontFamily: 'Arial', 
            fontSize: '24px', 
        });

        // Create Buttons
        this.buttonPlay = this.add.sprite(200, 510, "buttonGraphic").setScale(1.75, 1);
        this.buttonCredits = this.add.sprite(600, 510, "buttonGraphic").setScale(1.75, 1);
        this.buttonPlay.setInteractive();
        this.buttonCredits.setInteractive();

        // Button Text
        this.playText = this.add.text(180, 500, translations.Play);
        this.creditsText = this.add.text(570, 500, translations.Credit);

        // Language Change buttons
        this.englishButton = this.add.sprite(550, 30, "buttonGraphic").setScale(1.75, 1)
        .setInteractive()
        .on("pointerdown", () => {  
            switchLanguage('en')
            translations = getTranslations();
            this.playText.setText(translations.Play)
            this.creditsText.setText(translations.Credit)
            this.titleText.setText(translations.Title)
        });
        this.chineseButton = this.add.sprite(650, 30, "buttonGraphic").setScale(1.75, 1)
        .setInteractive()
        .on("pointerdown", () => {  
            switchLanguage('ch')
            translations = getTranslations();
            this.playText.setText(translations.Play)
            this.creditsText.setText(translations.Credit)
            this.titleText.setText(translations.Title)
        });
        this.arabicButton = this.add.sprite(750, 30, "buttonGraphic").setScale(1.75, 1)
        .setInteractive()
        .on("pointerdown", () => {  
            switchLanguage('ar')
            translations = getTranslations();
            this.playText.setText(translations.Play)
            this.creditsText.setText(translations.Credit)
            this.titleText.setText(translations.Title)
        });

        // Add Language Change text
        this.englishText = this.add.text(520, 20, translations.en);
        this.chineseText = this.add.text(620, 20, translations.ch);
        this.arabicText = this.add.text(720, 20, translations.ar);
    }
    update (){
        // Button Handlers
        this.buttonPlay.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.start("continueMenuScene");
        });
        this.buttonCredits.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.start("creditsScene");
        });
    }
}

class ContinueMenu extends Phaser.Scene {
    constructor() {
      super("continueMenuScene");
    }

    create(){
        const translations = getTranslations();
        this.saveText = this.add.text(360, 75, translations.LoadSave, {
            fontFamily: 'Arial', 
            fontSize: '24px', 
        });
        this.buttonPressed = false;
        this.buttonAutosave = this.add.sprite(400, 200, "buttonGraphic").setScale(2, 1);
        this.buttonSave1 = this.add.sprite(400, 275, "buttonGraphic").setScale(2, 1);
        this.buttonSave2 = this.add.sprite(400, 350, "buttonGraphic").setScale(2, 1);
        this.buttonSave3 = this.add.sprite(400, 425, "buttonGraphic").setScale(2, 1);
        this.buttonAutosave.setInteractive();
        this.buttonSave1.setInteractive();
        this.buttonSave2.setInteractive();
        this.buttonSave3.setInteractive();
        this.autosaveText = this.add.text(370, 190, translations.Autosave);
        this.save1Text = this.add.text(370, 265, translations.Save1);
        this.save2Text = this.add.text(370, 340, translations.Save2);
        this.save3Text = this.add.text(370, 415, translations.Save3);
    }

    update(){
        // Button Handlers
        this.buttonAutosave.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.start("playScene", {saveSlot: "autosave"});
        });
        this.buttonSave1.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.start("playScene", {saveSlot: "save1"});
        });
        this.buttonSave2.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.start("playScene", {saveSlot: "save2"});
        });
        this.buttonSave3.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.start("playScene", {saveSlot: "save3"});
        });
    }
}

class SaveMenu extends Phaser.Scene {
    constructor() {
      super("saveMenuScene");
    }

    create(){
        const translations = getTranslations();
        this.saveText = this.add.text(360, 75, translations.SaveGame, {
            fontFamily: 'Arial', 
            fontSize: '24px', 
        });
        this.buttonPressed = false;
        this.buttonSave1 = this.add.sprite(400, 200, "buttonGraphic").setScale(2, 1);
        this.buttonSave2 = this.add.sprite(400, 275, "buttonGraphic").setScale(2, 1);
        this.buttonSave3 = this.add.sprite(400, 350, "buttonGraphic").setScale(2, 1);
        this.buttonBack = this.add.sprite(400, 425, "buttonGraphic").setScale(2, 1);
        this.buttonSave1.setInteractive();
        this.buttonSave2.setInteractive();
        this.buttonSave3.setInteractive();
        this.buttonBack.setInteractive();
        this.save1Text = this.add.text(370, 190, translations.Save1);
        this.save2Text = this.add.text(370, 265, translations.Save2);
        this.save3Text = this.add.text(370, 340, translations.Save3);
        this.backText = this.add.text(370, 415, translations.GoBack);
    }

    update(){
        // Button Handlers
        this.buttonSave1.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.get("playScene").saveToLocalStorage("save1");
            this.scene.resume("playScene");
            this.scene.stop();
        });
        this.buttonSave2.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.get("playScene").saveToLocalStorage("save2");
            this.scene.resume("playScene");
            this.scene.stop();
        });
        this.buttonSave3.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.get("playScene").saveToLocalStorage("save3");
            this.scene.resume("playScene");
            this.scene.stop();
        });
        this.buttonBack.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.resume("playScene");
            this.scene.stop();
        });
    }
}

class LoadMenu extends Phaser.Scene {
    constructor() {
      super("loadMenuScene");
    }

    create(){
        const translations = getTranslations();
        this.saveText = this.add.text(360, 75, translations.LoadSave, {
            fontFamily: 'Arial', 
            fontSize: '24px', 
        });
        this.buttonPressed = false;
        this.buttonAutosave = this.add.sprite(400, 200, "buttonGraphic").setScale(2, 1);
        this.buttonSave1 = this.add.sprite(400, 275, "buttonGraphic").setScale(2, 1);
        this.buttonSave2 = this.add.sprite(400, 350, "buttonGraphic").setScale(2, 1);
        this.buttonSave3 = this.add.sprite(400, 425, "buttonGraphic").setScale(2, 1);
        this.buttonBack = this.add.sprite(400, 500, "buttonGraphic").setScale(2, 1);
        this.buttonAutosave.setInteractive();
        this.buttonSave1.setInteractive();
        this.buttonSave2.setInteractive();
        this.buttonSave3.setInteractive();
        this.buttonBack.setInteractive();
        this.autosaveText = this.add.text(370, 190, translations.Autosave);
        this.save1Text = this.add.text(370, 265, translations.Save1);
        this.save2Text = this.add.text(370, 340, translations.Save2);
        this.save3Text = this.add.text(370, 415, translations.Save3);
        this.backText = this.add.text(370, 490, translations.GoBack);
    }

    update(){
        // Button Handlers
        this.buttonAutosave.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.get("playScene").readFromLocalStorage("autosave");
            this.scene.resume("playScene");
            this.scene.stop();
        });
        this.buttonSave1.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.get("playScene").readFromLocalStorage("save1");
            this.scene.resume("playScene");
            this.scene.stop();
        });
        this.buttonSave2.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.get("playScene").readFromLocalStorage("save2");
            this.scene.resume("playScene");
            this.scene.stop();
        });
        this.buttonSave3.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.get("playScene").readFromLocalStorage("save3");
            this.scene.resume("playScene");
            this.scene.stop();
        });
        this.buttonBack.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true
            this.scene.resume("playScene");
            this.scene.stop();
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
        this.buttonPressed = false;
    }

    create () {
        const translations = getTranslations();
        this.creditsTitle = this.add.text(360, 100, translations.Credit, {
            fontFamily: 'Arial', 
            fontSize: '24px', 
            align: 'center',
        });
        // Credits Text
        this.programCredits = this.add.text(50, 200, translations.programCredits, this.config);
        this.saveCredits = this.add.text(50, 250, translations.saveCredits, this.config);
        this.titleCredits = this.add.text(50, 300, translations.titleCredits, this.config);
        this.terrainCredits = this.add.text(50, 350, translations.terrainCredits, this.config);
        this.plantCredits = this.add.text(50, 400, translations.plantCredits, this.config);

        this.buttonReturn = this.add.sprite(380, 560, "buttonGraphic").setScale(1.75, 1);
        this.buttonReturn.setInteractive();

        this.returnText = this.add.text(355, 550, translations.Return, this.config);
    }
    update (){
        this.buttonReturn.on('pointerdown', () => {
            if (this.buttonPressed) return;
            this.buttonPressed = true;
            this.scene.start("titleScene");
        });
    }

}