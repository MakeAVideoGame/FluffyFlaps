/*
Game Constants. They are tuned so it's somewhat playable, but you can modify them if you want to see what effects they have.
*/
const gravity = 5e-6;
const spawnFrequency = 1; // probability of obstacles spawning for each slot. 0 = no obstacles; 1 = obstacles in every possible slot
const speed = 0.3; //horizontal Speed/Speed of obstacles
const tapBoost = 2e-3; //vertical speed gained by tapping




/*
Game Variables. Do *not* change these unless you know what you're doing!
*/
let ctx, canv;
let oldTime = Date.now();
let eventQueue = [];
let obstacles = [];
let bird = {};
let timeAccumulator = 0;

/*
Subscribe to relevant events
*/
window.onload = init;
window.onresize = resize;
window.onkeydown = handleKey;


/*
Initialization for all game systems
*/
function init(){
	document.body.innerHTML = "";

	canv = document.createElement("canvas");
	resize();
	document.body.appendChild(canv);

	ctx = canv.getContext("2d");

	resetGame();
	gameloop();
}

/*
Resets the game and sets some default values
*/
function resetGame(){
	bird.vSpeed = 0;
	bird.height = 0.5;
}

function resize(){
	canv.width = document.body.clientWidth;
	canv.height = document.body.clientHeight;
}

function gameloop(){
	var now = Date.now();
	var deltaT = now - oldTime;
	oldTime = now;
	update(deltaT);
	render();
	requestAnimationFrame(gameloop);
}

function update(deltaT){
	/*
	Handle Events such as keypresses etc
	*/
	while(eventQueue.length != 0){
		
		var event = eventQueue.shift();

		if(event.type == 'tap'){
			bird.vSpeed = tapBoost;
		} else if(event.type == 'obstacleTest'){
			spawnObstacle(height * 0.3, height * 0.7);
		}

	}

	timeAccumulator += deltaT;

	/*
	Update all active obstacles and remove inactive ones
	*/
	//TODO: add object pooling
	/*var activeObstacles = obstacles.filter(function(elem, i, arr){
		return elem.isActive;
	});
	obstacles = activeObstacles;
	for(var i = 0; i < obstacles.length; i++){

		obstacles[i].xPos -= speed * deltaT;
		
		if(obstacles[i].xPos < 0){
			obstacles[i].isActive = false;
		}
	}*/


	/*
	Update position of bird.
	*/
	//TODO: change gravity = (gravity / 16) and tap speed accordingly
	bird.vSpeed -= gravity * deltaT; //magic number 16 counteracts deltaT multiplier
	bird.height += bird.vSpeed * deltaT;


	/*
	Limit the maximum and minimum height the bird is flying at to the viewport dimensions
	*/
	if(bird.height < 0){
		bird.height = 0;
		bird.vSpeed = 0;
	}

	if(bird.height > 1){
		bird.height = 1;
		bird.vSpeed = 0;
	}


	/*if(timeAccumulator > 100){
		var rnd = Math.random();
		if(rnd < spawnFrequency){
			spawnObstacle(height * 0.3, height * 0.7);
			timeAccumulator = 0;
		}
	}*/
	/*
	Do collision detection
	*/
	//AABB-collisions only. Bird is approximated as AABB to simplify math.
}

function render(){
	/*
	Clear the canvas
	*/
	ctx.clearRect(0, 0, canv.width, canv.height);
	
	/*
	Draw bird
	*/
	drawBird();

	/*
	Draw all obstacles
	*/
	for(var i = 0; i < obstacles.length; i++){
		drawObstacle(obstacles[i]);
	}
}

function drawBird(){
	ctx.beginPath();
	ctx.arc(canv.width * 0.2, canv.height - canv.height * bird.height, 15, 0, 2 * Math.PI);
	ctx.stroke();
}

function drawObstacle(obstacle){

}

function handleKey(e){
	console.log(e);
	
	/*
	Handle Keyboard input
	*/
	if(e.code == 'Space'){
		var eventAction = {};
		eventAction.type = 'tap';
		eventQueue.push(eventAction);
	}
	if(e.code == 'KeyO'){
		var eventAction = {};
		eventAction.type = 'obstacleTest';
		eventQueue.push(eventAction);
	}
}

/*
Spawns an obstacle with an opening between lower and upper on the y-axis.
*/
function spawnObstacle(lower, upper){
	var newObstacle = {};
	newObstacle.lower = lower;
	newObstacle.upper = upper;
	newObstacle.isActive = true;
	newObstacle.xPos = width;
	console.log(newObstacle);
	obstacles.push(newObstacle);
}