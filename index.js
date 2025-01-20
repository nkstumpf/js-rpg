console.log('js init');

/***** canvas setup *****/

// Get the canvas element
const canvas = document.querySelector('canvas');

// Get the canvas context 
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
const context = canvas.getContext('2d');

// set the canvas size (this size creates an apsect ratio of 16:9)
canvas.width = 1024;
canvas.height = 576;

// Set the background color
context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);

/***** init place images (map / player) on canvas *****/

// create html image element with js api
const mapImage = new Image();
const playerImage = new Image();

// set the image source
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
        velocity,
        image,
    }) {
        this.position = position;
        this.image = image;
        this.velocity = velocity;
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y);
    }
};


const background = new Sprite({
    position: {
        x: -785,
        y: -650,
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

// loop over this function to animate the player sprite
// in this case it's ok to create an infinite loop?
function animate() {
    window.requestAnimationFrame(animate);
    // args are: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

    // map
    background.draw(); // render map image

    // player
    context.drawImage(
        playerImage,
        0, // crop the player image 
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2 - playerImage.width / 4 / 2, // center the player on the map image x axis
        canvas.height / 2 - playerImage.height / 2, // center the player on the map image y axis
        playerImage.width / 4, // render width
        playerImage.height, // render height
    )

    /***** control player movement *****/

    if (keys.w.pressed && lastKey === 'w') background.position.y = background.position.y += 3;      // up
    else if (keys.s.pressed && lastKey === 's') background.position.y = background.position.y -= 3; // down
    else if (keys.a.pressed && lastKey === 'a') background.position.x = background.position.x += 3; // left
    else if (keys.d.pressed && lastKey === 'd') background.position.x = background.position.x -= 3; // right 
};

// call the animate function
animate();

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
});

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
});