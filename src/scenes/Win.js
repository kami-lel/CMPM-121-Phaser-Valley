// deno-lint-ignore-file
class Win extends Phaser.Scene {
    constructor() {
        super("winScene")
    }


    create(){
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
        this.text = this.add.text(140, 200, 'Congratulations,  \nyou achieved the goal', textConfig)
        this.stateText = this.add.text(120, 300, `You reach the goal in ${days} days`, textConfig)
    }
}