// global variables
let player
let keypress
let platforms
let moveSpeed = 100
let moving = false
// player control
let control
// prevent double jumping
let jumping = false
// items
let nuts


function preload() {
    // load platforms
    this.load.image('earth', 'Platform-1.png.png')
    this.load.image('background', 'Background.png')
    this.load.image('earth2', 'PlatformAlt.png')
    // player
    this.load.spritesheet("thing", "PlayerCharacter.png", {
        frameWidth: 256, frameHeight: 512
    })
    //items
    this.load.image('coconut','Nut.png')
}
function create() {
    this.anims.create({
        key: "idle",
        frameRate: 6,
        frames: this.anims.generateFrameNumbers("thing", { start: 0, end: 1 }),
        repeat: -1
    })
    this.anims.create({
        key: "moving",
        frameRate: 6,
        frames: this.anims.generateFrameNumbers("thing", { start: 2, end: 3 }),
        repeat: -1
    })
    this.add.image(400, 300, 'background')

    platforms = this.physics.add.staticGroup()
    platforms.create(750, 180, 'earth')
    platforms.create(50, 150, 'earth2')
    platforms.create(200, 320, 'earth')
    platforms.create(750, 420, 'earth2')
    platforms.create(600, 570, 'earth')
    platforms.create(200, 570, 'earth2')
    player = this.physics.add.sprite(200, 400, "thing")
    player.play("idle")
    player.setScale(0.15)
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)
    // player.body.setGravity(300)
    this.physics.add.collider(player, platforms)
    // add image to the game
    // this.add.image( 400, 300, "character").setScale(0.15)
    // this.add.image( 200, 300, "saucer")
    // listener for keypress
    //this.input.keyboard.on("keydown", (event) => keypress = event.key)
    //this.input.keyboard.on("keyup", (event) => keypress = "none" )
    control = this.input.keyboard.createCursorKeys()
    nuts = this.physics.add.group({
        key: 'coconut',
        repeat: 16,
        setXY: { x: 12, y: 3, stepX: 40, stepY: 30 }
    })
    nuts.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    
    });
    this.physics.add.collider(nuts, platforms)

    this.physics.add.overlap(player, stars, collectStar, null, this)
}
function update() {
    // if( keypress == "ArrowLeft"){
    //     player.x = player.x - moveSpeed
    //     if( moving == false ) {
    //         moving = true
    //         player.play("moving")
    //     }
    //     player.flipX = true
    // }
    // else if( keypress == "ArrowRight") {
    //     player.x = player.x + moveSpeed
    //     if( moving == false ) {
    //         moving = true
    //         player.play("moving")
    //     }
    //     player.flipX = false
    // }
    // else if( keypress == "ArrowUp") {
    //     if( jumping == false ) {
    //         jumping = true
    //         player.y = player.y - 100
    //         player.play("idle")
    //     }
    // }
    // else if( keypress == "ArrowDown") {
    //     player.y = player.y + moveSpeed
    //     player.play("idle")
    // }
    // else if( keypress == "none") {
    //     jumping = false
    //     moving = false
    // }
    if (control.left.isDown) {
        player.flipX = true
        player.setVelocityX(moveSpeed * -1)
        player.anims.play('moving', true)
    }
    else if (control.right.isDown) {
        player.flipX = false
        player.setVelocityX(moveSpeed)
        player.anims.play('moving', true)
    }
    else {
        player.setVelocityX(0)
        player.anims.play('idle', true)
    }
    if (control.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game",
    backgroundColor: "#333333",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

const game = new Phaser.Game(gameConfig)