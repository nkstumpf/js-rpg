console.log('js init');

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

mapImage.onload = () => {
    context.drawImage(mapImage, -785, -650); // adjust starting map view coordinates

    // args are: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
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

}