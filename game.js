/*
Game Constants. They are tuned so it's somewhat playable, but you can modify them if you want to see what effects they have.
*/
const gravity = 0.8;
const spawnFrequency = 1; // probability of obstacles spawning for each slot. 0 = no obstacles; 1 = obstacles in every possible slot
const speed = 0.3; //horizontal Speed/Speed of obstacles
const speedBoost = 20;//vertical speed gained by tapping

/*
DANGER ZONE!
Game might break if you change these.
*/
const width = 700; //TODO: add explicit support for other dimensions
const height = 600;


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
window.onkeydown = handleKey;


/*
Initialization for all game systems
*/
function init(){
	document.body.innerHTML = "";

	canv = document.createElement("canvas");
	canv.width = width;
	canv.height = height;
	document.body.appendChild(canv);

	ctx = canv.getContext("2d");

	bird.vSpeed = 0;
	bird.height = 200;


	gameloop();
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
			bird.vSpeed = speedBoost;
		} else if(event.type == 'obstacleTest'){
			spawnObstacle(height * 0.3, height * 0.7);
		}

	}

	timeAccumulator += deltaT;

	/*
	Update all active obstacles and remove inactive ones
	*/
	//TODO: add object pooling
	var activeObstacles = obstacles.filter(function(elem, i, arr){
		return elem.isActive;
	});
	obstacles = activeObstacles;
	for(var i = 0; i < obstacles.length; i++){

		obstacles[i].xPos -= speed * deltaT;
		
		if(obstacles[i].xPos < 0){
			obstacles[i].isActive = false;
		}
	}


	/*
	Update position of bird.
	*/
	//TODO: change gravity = (gravity / 16) and tap speed accordingly
	bird.vSpeed -= gravity / 16 * deltaT; //magic number 16 counteracts deltaT multiplier
	bird.height += bird.vSpeed / 16 * deltaT;


	/*
	Limit the maximum and minimum height the bird is flying at to the viewport dimensions
	*/
	if(bird.height < 0){
		bird.height = 0;
		bird.vSpeed = 0;
	}

	if(bird.height > height){
		bird.height = height;
		bird.vSpeed = 0;
	}


	if(timeAccumulator > 100){
		var rnd = Math.random();
		if(rnd < spawnFrequency){
			spawnObstacle(height * 0.3, height * 0.7);
			timeAccumulator = 0;
		}
	}
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
	ctx.beginPath();
	ctx.arc(width / 3, height - bird.height, 15, 0, 2 * Math.PI);
	ctx.stroke();

	/*
	Draw upper and lower parts for all obstacles
	*/
	for(var i = 0; i < obstacles.length; i++){
		ctx.beginPath();
		ctx.moveTo(obstacles[i].xPos - 10, height);
		ctx.lineTo(obstacles[i].xPos - 10, height - obstacles[i].lower);
		ctx.lineTo(obstacles[i].xPos + 10, height - obstacles[i].lower);
		ctx.lineTo(obstacles[i].xPos + 10, height);


		ctx.moveTo(obstacles[i].xPos - 10, 0);
		ctx.lineTo(obstacles[i].xPos - 10, height - obstacles[i].upper);
		ctx.lineTo(obstacles[i].xPos + 10, height - obstacles[i].upper);
		ctx.lineTo(obstacles[i].xPos + 10, 0);
		ctx.stroke();
	}
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