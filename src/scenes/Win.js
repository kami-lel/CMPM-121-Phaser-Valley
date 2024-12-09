// deno-lint-ignore-file
class Win extends Phaser.Scene {
    constructor() {
        super("winScene")
    }

    create(){
        const translations = getTranslations();
        let textConfig = {
            fontSize: '36px',
            color: '#ffffff',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        this.wintext = this.add.text(140, 200, translations.Congratulations, textConfig)
        this.stateText = this.add.text(120, 300, translations.WinState + ` ${days} `+translations.WinStateEnd, textConfig)
        
    }
}