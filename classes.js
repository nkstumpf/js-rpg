/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// create a class for the player
// by passing arguments to the constructor via an object, we don't have to remember the specific order in which we need to pass arguments
class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1 },
        sprites,
    }) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0}; // allow to still pass frames as an object or customize
        this.sprites = sprites;

        // need to wait until image is fully loaded
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            console.log('sprite image width: ', this.width)
            console.log('sprite image height: ', this.height)
        }

        this.moving = false;
    }

    draw() {
        context.drawImage(
            this.image,
            // crop the player image into 4 sections, each section is 48x48
            this.frames.val * this.width, // x position to start clipping
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max, // render width
            this.image.height, // render height
        )

        // ignore the following code if moving = false
        if(!this.moving) return

        if(this.frames.max > 1 ){
            // increment the elapsed time
            this.frames.elapsed++
        }

        // player movement animation
        // how this code works:
        // if the remainder of the current frame divided by 10 is 0 continue
        if(this.frames.elapsed % 10 === 0) {
            // if the current frame is less than the max frame, increment the frame
            if(this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
};

class Boundary {
    static width = 48;
    static height = 48;
    constructor({
        position,
    }) {
        this.position = position;
        this.width = 48
        this.height = 48
    }

    draw() {
        context.fillStyle = 'rgb(255, 0, 0, 0.2)';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}