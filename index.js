const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
const backgroundImage = new Image()
backgroundImage.src = './img/cat-island.png'
const catDwnImage = new Image()
catDwnImage.src = './img/catDwn.png'
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

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 40) {
    battleZonesMap.push(battleZonesData.slice(i, 40 + i))
}

const offset = {
    x: -420,
    y: -400
}

// need to recalculate scenes size, cat is too small to see
// const cat = new Sprite({
//     position: {
//         x: canvas.width / 2 - 192 / 4 / 2,
//         y: canvas.height / 2 - 192 / 4 / 2
//     },
//     image: catImage,
//     frames: {
//         max: 4
//     }
// })

// const player = new Sprite({
//     position: {
//         // the image will be loading by time. Thus, give a width and height directly instead of this.image.width and this.image.height
//         x: canvas.width / 2 - 192 / 4 / 2,
//         y: canvas.height / 2 - 48 / 2
//     },
//     image: playerDownImage,
//     frames: {
//         max: 4
//     },
//     sprites: {
//         up: playerUpImage,
//         left: playerLeftImage,
//         right: playerRightImage,
//         down: playerDownImage,
//     }
// })

const player = new Sprite({
    position: {
        // the image will be loading by time. Thus, give a width and height directly instead of this.image.width and this.image.height
        x: canvas.width / 2 - 192 / 4 / 2 ,
        y: canvas.height / 2 - 48 / 2 
    },
    image: catDwnImage,
    frames: {
        max: 4,
        hold: 10
    },
    type: 'player'
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
            boundaries.push(new Boundary({ 
                position: {
                    // reference static width and static height from Boundary
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
        }
    })
})

const battleZones = []
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1131) {
            battleZones.push(new Boundary({ 
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
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
const moveables = [background, ...boundaries, foreground, ...battleZones]

function retangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x 
        && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.position.y + rectangle1.height >= rectangle2.position.y 
        && rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

const battle = {
    initiated: false,
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    // Drawing sequence
    // 1st drawing
    background.draw()
    // 2nd drawing
    boundaries.forEach( boundary => boundary.draw())
    // 3rd drwaing
    battleZones.forEach( boundary => boundary.draw())
    // testBoundary.draw()
    // 4th drawing
    player.draw()
    // 5th drawing
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
    player.animate = false
    
    // when battle is active then stopped moving
    if (battle.initiated) return

    if (keys.up.pressed || keys.down.pressed || keys.left.pressed || keys.right.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            // calculate the battle area to active
            const overlappingArea =  
            (Math.min(
                player.position.x + player.width, 
                battleZone.position.x + battleZone.width
            ) - 
            Math.max( player.position.x, battleZone.position.x)) *
            (Math.min(
                player.position.y + player.height, 
                battleZone.position.y + battleZone.height
            ) - 
            Math.max(player.position.y, battleZone.position.y))
                                     
            if ( 
                retangularCollision({  
                    rectangle1: player, 
                    rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2
                // make battle is not active so frequently
                && Math.random() < 0.01
            ) {
                // deactivate current animation loop
                // we need to cancel the animation with current animation id
                window.cancelAnimationFrame(animationId)
                battle.initiated = true
                console.log("active battle")
                // display overlaping animation when active battle
                gsap.to('#overlaping', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    druation: 0.3,
                    onComplete() {
                        gsap.to('#overlaping', {
                            opacity: 1,
                            duration: 0.3,
                            onComplete() {
                                // activate a enw animation loop
                                animateBattle()
                                gsap.to('#overlaping', {
                                    opacity: 0,
                                    duration: 0.3,
                                })
                            }
                        })
                    }
                })
                break
            }
        }

    }

    if (keys.up.pressed && lastKey === 'w' || keys.up.pressed && lastKey === 'ArrowUp') {
        player.animate = true
        // player.image = player.sprites.up
        // collision detection
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
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
                player.animate = false
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
        player.animate = true
        // player.image = player.sprites.left
        // collision detection
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
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
                player.animate = false
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
        player.animate = true
        // player.image = player.sprites.down
        // collision detection
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
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
                player.animate = false
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
        player.animate = true
        // player.image = player.sprites.right
        // collision detection
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
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
                player.animate = false
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



// battle assets
const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage,
})

const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'
const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 20
    },
    animate: true,
    isEnemy: true,
})

const embyImage = new Image()
embyImage.src = './img/embySprite.png'
const emby = new Sprite({
    position: {
        x: 300,
        y: 325
    },
    image: embyImage,
    frames: {
        max: 4,
        hold: 10
    },
    animate: true,
    
})

const renderedSprites = [draggle, emby]

function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    // console.log('animating battle')
    battleBackground.draw()
    // draggle.draw()
    // emby.draw()

    renderedSprites.forEach( sprite => {
        sprite.draw()
    })
}

// animate()
animateBattle()

const buttons = document.querySelectorAll('button')
buttons.forEach( butotn => {
    butotn.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.textContent] 
        emby.attack({
            attack: selectedAttack,
            recipient: draggle, 
            renderedSprites
        })
    })
})


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