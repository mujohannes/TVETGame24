// global variables
let player
let keypress
let platforms
let moveSpeed = 1
let moving = false

function preload() {
    // load an image
    // this.load.image("character", "idle8.png")
    // this.load.image("saucer", "flying.png")
    // load platforms
    this.load.image('earth', 'Platform-1.png.png')
    this.load.image('background', 'Background.png')
    this.load.spritesheet("thing", "Spritesheet.png", {
        frameWidth: 256, frameHeight: 256
    })
}
function create() {
    this.anims.create({
        key: "idle",
        frameRate: 6,
        frames: this.anims.generateFrameNumbers("thing", { start: 0, end: 1} ),
        repeat: -1
    })
    this.anims.create({
        key: "moving",
        frameRate: 6,
        frames: this.anims.generateFrameNumbers("thing", { start: 2, end: 3} ),
        repeat: -1
    })
    this.add.image(400,300,'background')

    platforms = this.physics.add.staticGroup()
    platforms.create( 650, 200, 'earth')
    platforms.create( 50, 200, 'earth')
    platforms.create( 200, 400, 'earth')
    platforms.create( 800, 420, 'earth')
    platforms.create( 600, 570, 'earth')
    platforms.create( 200, 570, 'earth')
    player = this.physics.add.sprite(400,300, "thing")
    player.play("idle")
    player.setScale(0.3)
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)
    // player.body.setGravity(300)
    this.physics.add.collider( player, platforms )
    // add image to the game
    // this.add.image( 400, 300, "character").setScale(0.15)
    // this.add.image( 200, 300, "saucer")
    // listener for keypress
    this.input.keyboard.on("keydown", (event) => keypress = event.key)
    this.input.keyboard.on("keyup", (event) => keypress = "none" )
}
function update() {
    if( keypress == "ArrowLeft"){
        player.x = player.x - moveSpeed
        if( moving == false ) {
            moving = true
            player.play("moving")
        }
        player.flipX = true
    }
    else if( keypress == "ArrowRight") {
        player.x = player.x + moveSpeed
        if( moving == false ) {
            moving = true
            player.play("moving")
        }
        player.flipX = false
    }
    else if( keypress == "ArrowUp") {
        player.y = player.y - 10
        player.play("idle")
    }
    else if( keypress == "ArrowDown") {
        player.y = player.y + moveSpeed
        player.play("idle")
    }
    else if( keypress == "none") {
        moving = false
        player.play("idle")
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