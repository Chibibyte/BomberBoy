import { GameSlide } from './gameDevLib/GameSlides/GameSlide.js';
import { StartScreenSlide } from './gameDevLib/GameSlides/StartScreenSlide.js';

// touch info
let touchInfoButton = document.getElementById('touchInfoButton');
let infoModal = document.getElementById('infoModal');
touchInfoButton.onclick = () => {
    infoModal.classList.remove('hidden');
}
let touchConfirm = document.getElementById('touchConfirm');
touchConfirm.onclick = () => {
    infoModal.classList.add('hidden');
}

// about info
let aboutInfoButton = document.getElementById('aboutInfoButton');
let aboutModal = document.getElementById('aboutModal');
aboutInfoButton.onclick = () => {
    aboutModal.classList.remove('hidden');
}
let aboutConfirm = document.getElementById('aboutConfirm');
aboutConfirm.onclick = () => {
    aboutModal.classList.add('hidden');
}

// canvas
let canvasWrapper = document.getElementById('canvasWrapper');
let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const RATIO_H = 4;
const RATIO_V = 3;

/**
 * Resizes the game screen
 */
function resize() {
    let w = canvasWrapper.offsetWidth;
    let h = canvasWrapper.offsetHeight;

    let newH = h;
    let newW = h * RATIO_H / RATIO_V;
    if (w < h) {
        newW = w;
        newH = w * RATIO_V / RATIO_V;
    }

    let diff = 0;
    if (newW > w) diff = w - newW;
    else if (newH > h) diff = h - newH;

    canvas.width = newW - diff;
    canvas.height = newH - diff;

    if (GameSlide.length() > 0) {
        let slide = GameSlide.peak();
        slide.screen.width = slide.ctx.canvas.width;
        slide.screen.height = slide.ctx.canvas.height;
    }
}

resize();

window.onresize = () => {
    resize();
}

// GAME
let buttonKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyN', 'KeyM', 'Space'];
let buttonNames = ['UP', 'LEFT', 'DOWN', 'RIGHT', 'B', 'A', 'START'];


// load ALL resources first
fetch('/resources')
    .then(res => res.json())
    .then(fileNames => {
        let images = [];
        let count = fileNames.length;
        fileNames.forEach(name => {
            let img = new Image(10, 10);
            images.push(img)
            img.onload = () => {
                count--;
                if (count == 0) {
                    // everything is loaded
                    let startScreenSlide = new StartScreenSlide(ctx, canvas.width, canvas.height, buttonNames, buttonKeys);
                    GameSlide.push(startScreenSlide);
                }
            }
            img.src = `res/${name}`;
        });



    })
    .catch(err => console.error(err))


