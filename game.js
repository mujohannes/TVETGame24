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
        score -= 20
    }
    scoreText.setText('score: ' + score)
}

function randomNumber( limit ) {
    return Math.floor( Math.random() * limit )
}

function preload() {
    // load platforms
    this.load.image('block', 'assets/platforms/PlatformBlock-1.png')
    this.load.image('earth', 'assets/platforms/Platform-1.png.png')
    this.load.image('background', 'assets/backgrounds/Background.png')
    this.load.image('earth2', 'assets/platforms/PlatformAlt.png')
    this.load.atlas("thing", "assets/player/texture.png", "assets/player/texture.json")
    //items
    this.load.image('coconut', 'assets/items/Nut.png')
    this.load.spritesheet('fire', 'assets/items/Flamez.png', {frameWidth: 256, frameHeight: 256})
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
    //---platforms coordinates
    const platformsLocations = [
        {x: 750, y: 180, kind: 'earth'},
        {x: 50, y: 150, kind: 'earth2'},
        {x: 200, y: 320, kind: 'earth'},
        {x: 750, y: 420, kind: 'earth2'},
        {x: 2400, y: 320, kind: 'earth'},
        {x: 1800, y: 320, kind: 'earth2'},
        {x: 200, y: 570, kind: 'earth2'},
        {x: 695, y: 568, kind: 'earth'},
        {x: 1190, y: 570, kind: 'earth2'},
        {x: 1680, y: 568, kind: 'earth'},
        {x: 1900, y: 568, kind: 'earth'},
        {x: 200, y: 570, kind: 'block'},
    ]
    //---platforms
    
    // floor
    platformsLocations.forEach( (item) => {
        platforms.create(item.x, item.y, item.kind)
    })
    
   
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
    let nutsPositions = [
        {x:100, y: 10},
        {x:250, y: 10},
        {x:50, y: 200},
        {x:100, y: 500},
        {x:200, y: 500},
        {x:500, y: 500},
    ]
    nuts = this.physics.add.group()
    
    nutsPositions.forEach( (item) => {
        nuts.create( item.x, item.y, 'coconut')
    })
    nuts.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })
    // stop nuts from falling through the platforms 
    this.physics.add.collider(nuts, platforms)

    fire = this.physics.add.group()
    let firesPositions = [
        {x:180, y: 10},
        {x:600, y: 10},
        {x:250, y: 200},
        {x:100, y: 500},
        {x:200, y: 500},
        {x:500, y: 500},
    ]
    firesPositions.forEach( (item) => {
        fire.create( item.x, item.y, 'fire')
    })


    // make fire play its animation
    fire.children.iterate( function (child) {
        child.play('burning')
        child.setScale(0.2)
    })
    // stop fire from falling through the platform
    this.physics.add.collider( fire, platforms )

    this.physics.add.collider( fire, nuts )

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
    if ( (control.up.isDown || control.space.isDown) && player.body.touching.down) {
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