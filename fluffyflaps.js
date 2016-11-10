/*
These are game constants. They are tuned so the game is playable, but you can change them to see what effect they have.
*/
const gravity = 5e-6;
const tapBoost = 2e-3;
const speed = 0.3; // the bird moves 0.3 screen widths every second


/*
These are internal Game Variables. Do *not* modify them unless you know what you do.
*/
let ctx, canv;
let oldTime = Date.now();
let eventQueue = [];
let obstacles = [];
let bird = {};
let images = {};
let timeAccumulator = 0;


/*
Subscribe to the window load event, so we can start when everything has loaded.
*/
window.onload = load;

/*
Subscribe to events required for handling user input
*/
window.onkeydown = handleKey;

/*
Subscribe to the resize event to resize the window and gamespace properly.
*/
window.onresize = resize;

/*
Load all required resources such as sprites.
*/
function load(){
	document.body.innerHTML = "";

	var sources = {
		bird: 'sprites/bird.svg',
		birdFlap: 'sprites/bird_flap.svg',
		particleFeathers: 'sprites/particle_feathers.svg'
	};

	loadImages(sources, init);
}

/*
Loads the given images and then calls the given callback function.
*/
function loadImages(sources, callback) {
	console.log("load images");
	var loadedImages = 0;
	var numImages = 0;

	for(var src in sources){
		numImages++;
	}
	for(var src in sources) {
		images[src] = new Image();
		images[src].onload = function() {
			if(++loadedImages >= numImages) {
				console.log("before cb");
				callback();
			}
		};
		images[src].src = sources[src];
	}
}

/*
Initializes all game systems such as the canvas, obstacle system and others.
*/
function init(){
	console.log("after cb");
	canv = document.createElement("canvas");
	resize();
	document.body.appendChild(canv);

	ctx = canv.getContext("2d");
	ctx.drawImage(images.bird, 0, 0, 5 * 97, 5 * 150);

	gameloop();
}

/*
The basic gameloop. Updates all subsystems then renders everything.
*/
function gameloop(){
	let deltaT = oldTime - Date.now();
	update(deltaT);
	draw();
	requestAnimationFrame(gameloop);
}

/*
Updates all of the game's subsystems.
*/
function update(deltaT){
	
}

/*
Resizes the canvas to fit the window.
*/
function resize(){
	canv.width = document.body.clientWidth;
	canv.height = document.body.clientHeight;
}

/*
Handles keyboard input.
*/
function handleKey(e){

}