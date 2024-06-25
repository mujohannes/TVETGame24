// global variables
let player
let keypress
let platforms
let moveSpeed = 100
let moving = false
// player control
let control
// items
let nuts
let fire
// camera
let camera
// score
let score = 0
let scoreText

function touchingItem(player, item) {
    // disable item and remove from scene 
    item.disableBody( true, true )
    if ( item.texture.key == 'coconut' ) {
        score += 10
    }
    else if( item.texture.key = 'fire' ) {
        score -= 10
    }
    scoreText.setText('score: ' + score)
}

function preload() {
    // load platforms
    this.load.image('earth', 'assets/platforms/Platform-1.png.png')
    this.load.image('background', 'assets/backgrounds/Background.png')
    this.load.image('earth2', 'assets/platforms/PlatformAlt.png')
    this.load.atlas("thing", "assets/player/texture.png", "assets/player/texture.json")
    //items
    this.load.image('coconut', 'assets/items/Nut.png')
    this.load.spritesheet('fire', 'assets/items/flamez.png', {frameWidth: 256, frameHeight: 256})
}

function create() {
    this.anims.create({
        key: "idle",
        frames: [
            {key: "thing", frame: "0.png" },
            {key: "thing", frame: "1.png" }
        ],
        repeat: -1,
        frameRate: 6
    })
    this.anims.create({
        key: "moving",
        frameRate: 6,
        frames: [
            {key: "thing", frame: "2.png" },
            {key: "thing", frame: "3.png" }
        ],
        repeat: -1
    })
    //---items
    this.anims.create({
        key: "burning",
        frames: this.anims.generateFrameNumbers("fire", {start: 0, end: 1} ),
        frameRate: 6,
        repeat: -1
    })
    //---backgrounds
    this.add.image(400, 300, 'background')
    this.add.image(1200, 300, 'background')
    this.add.image(2000, 300, 'background')

    //---platforms physics
    platforms = this.physics.add.staticGroup()
    //---platforms
    platforms.create(750, 180, 'earth')
    platforms.create(50, 150, 'earth2')
    platforms.create(200, 320, 'earth')
    platforms.create(750, 420, 'earth2')
    platforms.create(600, 570, 'earth')
    platforms.create(200, 570, 'earth2')
    platforms.create(1000, 570, 'earth2')
    platforms.create(1500, 570, 'earth')
    platforms.create(1900, 570, 'earth')
    platforms.create(2200, 570, 'earth')
    platforms.create(2400, 320, 'earth')
    platforms.create(1800, 320, 'earth2')

    //---player
    player = this.physics.add.sprite(400, 500, "thing")
    player.play("idle")
    player.setScale(0.15)
    player.setBounce(0.2)
    // prevent player from going off screen
    player.setCollideWorldBounds(true)
    this.physics.world.setBounds(0, 0, 2400, 600)
    this.physics.add.collider(player, platforms)

    // --------- set up camera
    camera = this.cameras.main
    camera.setBounds(0, 0, 2400, 400)
    camera.startFollow(player, true, 1, 0, 200, 120)

    control = this.input.keyboard.createCursorKeys()

    // add nuts
    nuts = this.physics.add.group({
        key: 'coconut',
        repeat: 32,
        setXY: { x: 24, y: 3, stepX: 60, stepY: 0 }
    })
    nuts.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })
    // stop nuts from falling through the platforms 
    this.physics.add.collider(nuts, platforms)

    // add fire
    fire = this.physics.add.group({
        key: 'fire',
        repeat: 16,
        setXY: { x: 15, y: 10, stepX: 120, stepY: 2 }
    })
    // make fire play its animation
    fire.children.iterate( function (child) {
        child.play('burning')
        child.setScale(0.2)
    })
    // stop fire from falling through the platform
    this.physics.add.collider( fire, platforms )

    // when player touches an item
    this.physics.add.overlap(player, nuts, touchingItem, null, this)
    this.physics.add.overlap( player, fire, touchingItem, null, this)

    // score text
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })
    scoreText.setScrollFactor(0)
    
}
function update() {
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
    // only jump if player is currently touching the "ground"
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