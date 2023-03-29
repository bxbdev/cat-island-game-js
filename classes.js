class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 }, sprites, type }) {
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
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        // c.drawImage(this.image, this.position.x, this.position.y)
        // replace all playerImage to use this.image
        // use canvas to repeat draw every images (backgroundImage and playerImage)
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

        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elasped++
        }

        // make chracter move normally
        if (this.frames.elasped % 10 === 0) {
            if (this.frames.val < this.frames.max -1) this.frames.val++
            else this.frames.val = 0
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