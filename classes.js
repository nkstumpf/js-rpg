// create a class for the player
// by passing arguments to the constructor via an object, we don't have to remember the specific order in which we need to pass arguments
class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1 },
    }) {
        this.position = position;
        this.image = image;
        this.frames = frames;

        // need to wait until image is fully loaded
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            console.log('sprite image width: ', this.width)
            console.log('sprite image height: ', this.height)
        }
    }

    draw() {
        context.drawImage(
            this.image,
            0, // crop the player image into 4 sections, each section is 48x48
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max, // render width
            this.image.height, // render height
        )
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