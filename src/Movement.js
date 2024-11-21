class Movement extends Phaser.Scene {
    constructor(){
        super('movementScene')
    }

    init() {
        this.VEL = 300
    }

    preload(){
        this.load.path = './assets/'
        this.load.spritesheet('slime', 'Character/slime.png', {
            frameWidth: 16,
            frameHeight: 16
        })
    }

    create() {
        this.anims.create({
            key: 'idle',
            frameRate: 2,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('slime', {
                start: 0,
                end: 1
            })
        })
        this.player = this.physics.add.sprite(width/2, height/2).setScale(3)
        this.player.play('idle')
        this.player.body.setCollideWorldBounds(true)
        // input
        this.cursors = this.input.keyboard.createCursorKeys()
    }
    
    update() {
        // slime movement
        this.direction = new Phaser.Math.Vector2(0)
        if(this.cursors.left.isDown) {
            this.direction.x = -1
        } else if(this.cursors.right.isDown) {
            this.direction.x = 1
        }
        if(this.cursors.up.isDown) {
            this.direction.y = -1
        } else if(this.cursors.down.isDown) {
            this.direction.y = 1
        }
        this.direction.normalize()
        this.player.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y)
    }
}