class Sprite {
    constructor({ 
        position, 
        velocity, 
        image, 
        frames = { max: 1, hold: 10 }, 
        sprites, 
        animate = false, 
        type,
        isEnemy = false,
        rotation  = 0
    }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elasped: 0}

        this.image.onload = () => {

            if (type === 'player') {
                this.width = this.image.width / this.frames.max
                this.height = this.image.height 
                return
            }

            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            // console.log(this.width)
            // console.log(this.height)
        }
        this.animate = animate
        this.sprites = sprites
        this.frameHold = frames.hold
        this.opacity = 1
        this.health = 100
        this.isEnemy = isEnemy
        this.rotation = rotation
    }

    draw() {
        // c.drawImage(this.image, this.position.x, this.position.y)
        // replace all playerImage to use this.image
        // use canvas to repeat draw every images (backgroundImage and playerImage)
        c.save()
        
        // have the issue for fireball with c.translate and c.rotate
        // c.translate(
        //     this.position.x , 
        //     this.position.y + this.height / 2
        // )
        // c.rotate(this.rotation)
        // c.translate(
        //     this.position.x - this.width / 2, 
        //     this.position.y - this.height / 2
        // )

        // globalAlpha would be set to 1
        c.globalAlpha = this.opacity
        c.drawImage(
            this.image,
            // start x position everytime
            this.frames.val * this.width,
            0,
            // crop width and height
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            // actual position with width and height
            // canvas.width / 2 - (this.image.width / 4) / 2, 
            // canvas.height / 2 - (this.image.height / 4) / 2, 
            this.image.width / this.frames.max,
            this.image.height,
        )
        c.restore()

        if (!this.animate) return

        if (this.frames.max > 1) this.frames.elasped++ 

        // make chracter move normally
        if (this.frames.elasped % this.frameHold === 0) {
            if (this.frames.val < this.frames.max -1) this.frames.val++
            else this.frames.val = 0
        }
        
    }

    attack({ attack, recipient, renderedSprites }) {
        let healthBar = '#enemyHealthBar'
        if (this.isEnemy) healthBar = '#playerHealthBar'

        let rotation = 1
        if (this.isEnemy) rotation = -2.2

        this.health -= attack.damage
        
        if (this.health < attack.damage ) this.health = 0
        
        switch(attack.name) {
            case 'Fireball':
                const fireballImage = new Image()
                fireballImage.src = './img/fireball.png'
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })

                // insert fireball between with draggle and emby
                renderedSprites.splice(1, 0, fireball)

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: this.health + '%',
                            duration: 0.25
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08,
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        // renderedSprites.pop()
                        // delete fireball
                        renderedSprites.splice(1, 1)

                    }
                })


            break
            case 'Tackle':
                const tl = gsap.timeline()
                let movementDistance = 20
                if (this.isEnemy) movementDistance = -20
            
                tl.to(this.position, {
                    // go to left
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    // go to right
                    x: this.position.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {
                        // Enemy actually gets hit
                        gsap.to(healthBar, {
                            width: this.health + '%',
                            duration: 0.25
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08,
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    // backward to original position
                    x: this.position.x,
                    
                })

            break

        }

    }
}

// collisions
class Boundary {
    static width = 64
    static height = 64
    constructor({position}) {
        this.position = position
        // Regarding to percentage from zoom size in Tiled map
        // Here is using 400% with 16x16 (64)
        // The video was using 12x12 (48)
        this.width = 64
        this.height = 64
    }

    draw() {
        // collisions color
        c.fillStyle = 'rgba(255, 0, 0, 0.2)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}