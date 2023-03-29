const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576;

const backgroundImage = new Image()
backgroundImage.src = './img/cat-island.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'
const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'
const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'
const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const collisionsMap = []
// Reference 40 tiles by Tiled about map size
for (let i = 0; i < collisions.length; i += 40) {
    collisionsMap.push(collisions.slice(i, 40 + i))
}

const offset = {
    x: -645,
    y: -540
}

const player = new Sprite({
    position: {
        // the image will be loading by time. Thus, give a width and height directly instead of this.image.width and this.image.height
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage,
    }
})

const background = new Sprite({
    image: backgroundImage,
    position: {
        x: offset.x,
        y: offset.y
    },
})

const foreground = new Sprite({
    image: foregroundImage,
    position: {
        x: offset.x,
        y: offset.y
    }
})

const boundaries = []
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1131) {
            boundaries.push(new Boundary({ position: {
                // reference static width and static height from Boundary
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
            }}))
        }
    })
})

const keys = {
    down: {
        pressed: false
    },
    up: {
        pressed: false
    },
    left: {
        pressed: false
    },
    right: {
        pressed: false
    }
}

// const testBoundary = new Boundary({
//     position: {
//         x: 320,
//         y: 320
//     }
// })

// Add objects image here, make sure the objects won't be moved
const moveables = [background, ...boundaries, foreground]

function retangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x 
        && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.position.y + rectangle1.height >= rectangle2.position.y 
        && rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function animate() {
    window.requestAnimationFrame(animate);
    // Drawing sequence
    // 1st drawing
    background.draw();
    // 2nd drawing
    boundaries.forEach( boundary => {
        boundary.draw()
    })
    // testBoundary.draw()
    // 3rd drawing
    player.draw()
    // 4th drawing
    foreground.draw()
    
    // Player image moved to Sprite draw()
    // c.drawImage(
    //     playerImage,
    //     // start x and y positions
    //     0,
    //     0,
    //     // crop width and height
    //     playerImage.width / 4,
    //     playerImage.height,
    //     // actual position with width and height
    //     canvas.width / 2 - (playerImage.width / 4) / 2, 
    //     canvas.height / 2 - (playerImage.height / 4) / 2, 
    //     playerImage.width / 4,
    //     playerImage.height,
    // )

    let moving = true
    player.moving = false
    if (keys.up.pressed && lastKey === 'w' || keys.up.pressed && lastKey === 'ArrowUp') {
        player.moving = true
        player.image = player.sprites.up
        // collision detection
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if ( 
                retangularCollision({  
                    rectangle1: player, 
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                }) 
            ) {
                player.moving = false
                moving = false
                break
            }
        }

        if (moving) {
            moveables.forEach( (moveable) => {
                moveable.position.y += 3
            })
        }
       
        // background.position.y += 3
    }
    else if (keys.left.pressed && lastKey === 'a' || keys.left.pressed && lastKey === 'ArrowLeft') {
        player.moving = true
        player.image = player.sprites.left
        // collision detection
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if ( 
                retangularCollision({  
                    rectangle1: player, 
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                }) 
            ) {
                player.moving = false
                moving = false
                break
            }
        }

        if (moving) {
            moveables.forEach( (moveable) => {
                moveable.position.x += 3
            })
        }
        
        // background.position.x += 3
    }
    else if (keys.down.pressed && lastKey === 's' || keys.down.pressed && lastKey === 'ArrowDown') {
        player.moving = true
        player.image = player.sprites.down
        // collision detection
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if ( 
                retangularCollision({  
                    rectangle1: player, 
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                }) 
            ) {
                player.moving = false
                moving = false
                break
            }
        }

        if (moving) {
            moveables.forEach( (moveable) => {
                moveable.position.y -= 3
            })
        }
        // background.position.y -= 3
    }
    
    else if (keys.right.pressed && lastKey === 'd' || keys.right.pressed && lastKey === 'ArrowRight') {
        player.moving = true
        player.image = player.sprites.right
        // collision detection
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if ( 
                retangularCollision({  
                    rectangle1: player, 
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                }) 
            ) {
                player.moving = false
                moving = false
                break
            }
        }

        if (moving) {
            moveables.forEach( (moveable) => {
                moveable.position.x -= 3
            })
        }
        // background.position.x -= 3
    }
}

animate()

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w': case 'ArrowUp':
            keys.up.pressed = true
            lastKey = e.key
            break
        case 's': case 'ArrowDown':
            keys.down.pressed = true
            lastKey = e.key
            break
        case 'a': case 'ArrowLeft':
            keys.left.pressed = true
            lastKey = e.key
            break
        case 'd': case 'ArrowRight':
            keys.right.pressed = true
            lastKey = e.key
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'w': case 'ArrowUp':
        keys.up.pressed = false
        break
    case 's': case 'ArrowDown':
        keys.down.pressed = false
        break
    case 'a': case 'ArrowLeft':
        keys.left.pressed = false
        break
    case 'd': case 'ArrowRight':
        keys.right.pressed = false
        break
    }
})