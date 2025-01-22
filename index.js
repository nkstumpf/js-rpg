console.log('js init');
// eslint-disable-next-line no-undef
console.log(collisions ? 'collisions loaded' : 'error loading collisions');

/***** canvas setup *****/

// Get the canvas element
const canvas = document.querySelector('canvas');

// Get the canvas context 
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
const context = canvas.getContext('2d');

// set the canvas size (this size creates an apsect ratio of 16:9)
canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
// eslint-disable-next-line no-undef
for (let i = 0; i < collisions.length; i+=70) { // width of map (tiles) is 70
// eslint-disable-next-line no-undef
    collisionsMap.push(collisions.slice(i, i + 70)); // grab the first 70 elements, then the next 70, etc.
}

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
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// init boundaries
const boundaries = [];

// init offset
const offset = {
    x: -735,
    y: -650,
}

collisionsMap.forEach((row, i) => {
    row.forEach((tile, j) => {
        if (tile === 1025) {
            boundaries.push(new Boundary({
                position: { 
                    x: j * Boundary.width + offset.x, // from static values set inside Boundary class
                    y: i * Boundary.height + offset.y
                } 
            }))
        }
    })
})

/***** init images & place on canvas *****/

// create html image element with js api
const mapImage = new Image();
const playerImage = new Image();

// set image sources
mapImage.src = './assets/placeholder-map.png';
playerImage.src = './assets/playerDown.png';

// when the image is loaded, draw it on the canvas
// args are: image, x, y coordinates

// context.drawImage(image, 0, 0,);

// but this won't work as is because the image is not loaded yet
// to fix this, we need to use the image.onload event

// additionally- we need to make sure we load the map image first, then the player image because the map image is larger and takes longer to load
// if we don't do this in order, the map image will be drawn over the player image and we won't see the player

// Note: we then moved this draw image functionality to the animate function in order to animate the player sprite

/***** player movement  *****/

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

const player = new Sprite({
    position: {
        x: (canvas.width / 2) - 192 / 4 / 2, // center the player on the map image x axis
        y: (canvas.height / 2) - 68 / 2, // center the player on the map image y axis
    },
    image: playerImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: mapImage
})

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

// create an array to store sprite objects that should be able to move position
const moveables = [background, ...boundaries]

// utility function for evaluating collisions
// evalutaes position (pixel position value) of 2 rectangles...
// adds the width / height of rect1 to the x/y position of rect1
// then compares with position of rect2 to see the two objects in the same place (colliding)
// or vice versa

function rectangularCollision({ rect1, rect2 }) {
    return (
        rect1.position.x + rect1.width >= rect2.position.x && 
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )
}

// loop over this function to animate the player sprite
// in this case it's ok to create an infinite loop?
function animate() {
    window.requestAnimationFrame(animate);
    // args are: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

    // map
    background.draw(); // render map image

    // boundaries
    boundaries.forEach((boundary) => {
        boundary.draw()
        
        /***** detecting collisions *****/
        if (rectangularCollision({
            rect1: player,
            rect2: boundary
        })) {
            console.log('Collision detected')
        }
    });

    // player
    player.draw(); // render player image

    /***** user input logic: player movement *****/
    // this code is a little counterintuitive because we are moving all the elements EXCEPT the player sprite.
    // this creates the illusion of movement while keeping the player sprite centered on the screen

    if (keys.w.pressed && lastKey === 'w') {
        moveables.forEach(moveable => moveable.position.y += 3) // up
    } else if (keys.s.pressed && lastKey === 's') {
        moveables.forEach(moveable => moveable.position.y -= 3) // down
    } else if (keys.a.pressed && lastKey === 'a') {
        moveables.forEach(moveable => moveable.position.x += 3) // left
    } else if (keys.d.pressed && lastKey === 'd') {
        moveables.forEach(moveable => moveable.position.x -= 3) // right 
    }
}

// call the animate function
animate();

/***** user input *****/

// add event listener for keydown events 
let lastKey = ''; // allows us to track the last key pressed making user input smoother
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's'
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a'
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd'
            break;
    }
})

// add event listener for keydown events 
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
})