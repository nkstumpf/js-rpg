/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// why? Boundary & Sprite are defined in classes.js
// why? context is used by classes.js which is being imported into this file

/***** canvas setup *****/

// Get the canvas element
const canvas = document.querySelector("canvas");

// Get the canvas context
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
const context = canvas.getContext("2d");

// set the canvas size (this size creates an apsect ratio of 16:9)
canvas.width = 1024;
canvas.height = 576;

// map collisions data
const collisionsMap = [];
for (let i = 0; i < collisionsData.length; i += 70) {
  // width of map (tiles) is 70
  collisionsMap.push(collisionsData.slice(i, i + 70)); // grab the first 70 elements, then the next 70, etc.
}

// init boundaries
const boundaries = [];

// init offset (this is where we want the camera positioned on the map by default)
const offset = {
  x: -735,
  y: -650,
};

collisionsMap.forEach((row, i) => {
  row.forEach((tile, j) => {
    if (tile === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x, // from static values set inside Boundary class
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

// map battle zone data
const battleZoneMap = [];
for (let i = 0; i < battleZoneData.length; i += 70) {
  battleZoneMap.push(battleZoneData.slice(i, i + 70));
}

console.log("battle zone data: ", battleZoneMap);

// init battle zones
const battleZones = [];

battleZoneMap.forEach((row, i) => {
  row.forEach((tile, j) => {
    if (tile === 1025) {
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x, // from static values set inside Boundary class
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

/***** init images & place on canvas *****/

// create html image element with js api
const backgroundImg = new Image();
const playerUpImg = new Image();
const playerDownImg = new Image();
const playerLeftImg = new Image();
const playerRightImg = new Image();
const foregroundImg = new Image();

// set image sources
backgroundImg.src = "./assets/map-background-placeholder.png";
playerUpImg.src = "./assets/playerUp.png";
playerDownImg.src = "./assets/playerDown.png";
playerLeftImg.src = "./assets/playerLeft.png";
playerRightImg.src = "./assets/playerRight.png";
foregroundImg.src = "./assets/map-foreground-placeholder.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2, // center the player on the map image x axis
    y: canvas.height / 2 - 68 / 2, // center the player on the map image y axis
  },
  image: playerDownImg,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImg,
    down: playerDownImg,
    left: playerLeftImg,
    right: playerRightImg,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: backgroundImg,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImg,
});

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
};

// create an array to store sprite objects that should be able to move position
const moveables = [background, foreground, ...boundaries, ...battleZones];

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
  );
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
    boundary.draw();
  });

  // battle zones
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });

  // player
  player.draw(); // render player image

  // foreground
  foreground.draw(); // render foreground image (needs to be last so that it renders on top of player images)

  /***** user input logic: player movement *****/
  // this code is a little counterintuitive because we are moving all the elements EXCEPT the player sprite.
  // this creates the illusion of movement while keeping the player sprite centered on the screen

  /***** detecting battle zones *****/
  if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: battleZone,
        })
      ) {
        console.log("entering battle zone!");
        break;
      }
    }
  }

  let moving = true; // for each animation frame moving should be true (see below for collision exception)
  player.moving = false;
  if (keys.w.pressed && lastKey === "w") {
    player.moving = true;
    player.image = player.sprites.up;
    /***** detecting collisions *****/
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary, // makes a copy of the boundary object without modifying the original
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3, // project into the future (is there a collision 3 pixels ahead?)
            },
          },
        })
      ) {
        moving = false;
        break; // exit the loop as soon as a collision is detected
      }
    }

    if (moving) {
      moveables.forEach((moveable) => (moveable.position.y += 3)); // up
    }
  } else if (keys.s.pressed && lastKey === "s") {
    player.moving = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) {
      moveables.forEach((moveable) => (moveable.position.y -= 3)); // down
    }
  } else if (keys.a.pressed && lastKey === "a") {
    player.moving = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) {
      moveables.forEach((moveable) => (moveable.position.x += 3)); // left
    }
  } else if (keys.d.pressed && lastKey === "d") {
    player.moving = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: boundary,
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) {
      moveables.forEach((moveable) => (moveable.position.x -= 3)); // right
    }
  }
}

// call the animate function
animate();

/***** user input *****/

// add event listener for keydown events
let lastKey = ""; // allows us to track the last key pressed making user input smoother
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

// add event listener for keydown events
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
