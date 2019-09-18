// PLEASE LABEL EACH FUNCTION

//Title 
var titleText;
var descriptorText;
var onTitle = false;
var advancedToggle = true;

function drawInterface() {

	//Interface
	drawTitle();
	advancedKey();
	closestPlanet();

	//Variables
	let zoom = display.zoom;
	let rocketPos = Vector.mult(rocket.pos, zoom);
	var distance;
	var planetPos;

	//Cycle through planets
	for (var i = 0; i < planets.length; i++) {
		if (zoom < 0.8) {

			//Set planet position and distance 
			planetPos = Vector.mult(planets[i].pos, zoom);
			var distance = dist(planets[i].pos, rocket.pos) - planets[i].radius - rocket.height/2;

			//Text align
			let textDir;
			let textAlign;

			// Planet text position
			if(rocket.angleFromPlanet < 90 && rocket.angleFromPlanet >= 0) {
				textDir = new Vector(-1, -1)
				textAlign = "right";
			} else if(rocket.angleFromPlanet >= 90 && rocket.angleFromPlanet <= 180) {
				textDir = new Vector(1, -1)
				textAlign = "left";
			} else if(rocket.angleFromPlanet >= -180 && rocket.angleFromPlanet <= -90) {
				textDir = new Vector(1, 1)
				textAlign = "left";
			} else if(rocket.angleFromPlanet > -90 && rocket.angleFromPlanet <= 0) {
				textDir = new Vector(-1, 1)
				textAlign = "right";
			}

			//Draw pointer circle and lines
			drawCircle(planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius/2)*zoom, planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius/2)*zoom, 15*zoom, "white");
			ctx.beginPath();
			ctx.strokeStyle = "white";
			ctx.lineWidth = 15*zoom;
			ctx.moveTo(planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius/1.6)*zoom, planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius/1.6)*zoom);
			ctx.lineTo(planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom, planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom);
			ctx.lineTo(planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*50*zoom, planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom);
			ctx.stroke();
			ctx.closePath();

			//Draw descriptive text
			ctx.beginPath();
			drawText(
				planets[i].name, 
				planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*60*zoom, 
				planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom - 40*zoom, 
				60*zoom + "px Arial", "white", textAlign, "middle");
			drawText("Mass: " + planets[i].mass + "kg | Escape thrust: " + planets[i].escapeThrust, 
				planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*60*zoom, 
				planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom, 
				30*zoom + "px Arial", "white", textAlign, "middle");
			drawText(Math.round(distance) + "km", 
				planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*60*zoom, 
				planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom + 40*zoom, 
				50*zoom + "px Arial", "white", textAlign, "middle");
			ctx.closePath();

			closestPlanetPos = Vector.mult(rocket.closestPlanet.pos, zoom);

			/*ctx.beginPath();
			ctx.rect(closestPlanetPos.x - rocketPos.x + canvas.width/2 - rocket.closestPlanet.radius*zoom - 20*zoom, closestPlanetPos.y - rocketPos.y + canvas.height/2 - rocket.closestPlanet.radius*zoom - 20*zoom, rocket.closestPlanet.radius*zoom*2 + 40*zoom, rocket.closestPlanet.radius*zoom*2 + 40*zoom);
			ctx.lineWidth = 1*zoom;
			ctx.globalAlpha = 0.05;
			ctx.stroke();
			ctx.closePath();
			ctx.globalAlpha = 1;*/
			
		}
	}
}

function drawStats() {
	for (var i = 0; i < stats.length; i++) {
		let stat = stats[i];
		stat.display(i);
	}
}

function drawDashboard() {
	var pad = 30;
	var XOffset = 50;
	var options = {
		outline: true,
		outlineWidth: 5,
		outlineColor: pSBC(-0.1, "#808080", false, true),
		fill: false
	}
	drawRectangle(pad, canvas.height-25, XOffset, -canvas.height/4, "#808080", options);
	drawRectangle(pad, canvas.height-25, XOffset, -canvas.height/4*Math.abs(rocket.fuel)/rocket.maxFuel, "#808080");
	//drawText("Fuel", pad+10, canvas.height-pad-yOffset+30, "30px Arial", "lime", "left", "middle");

	var pad = 15;
	var yOffset = 120;
	var options = {
		outline: true,
		outlineWidth: 5,
		outlineColor: pSBC(-0.1, "#e0982b", false, true),
		fill: false
	}
	drawRectangle(pad*4 + XOffset, canvas.height-25, XOffset, -canvas.height/4, "#e0982b", options);
	drawRectangle(pad*4 + XOffset, canvas.height-25, XOffset, -canvas.height/4*Math.abs(rocket.thrust)/rocket.maxThrust, "#e0982b");
	//drawText("Thrust", pad+10, canvas.height-pad-XOffset+30, "30px Arial", "lime", "left", "middle");
}

// Draw closest planet on HUD
function closestPlanet() {
	let viewPadding = 100;
	let planetRadius = 65;
	let textSpacing = 23;
	let planetSpacing = 7;
	let distance = dist(rocket.closestPlanet.pos, rocket.pos) - rocket.closestPlanet.radius - rocket.height/2;

	let options = {
		outline: true,
		outlineWidth: 10,
		outlineColor: rocket.closestPlanet.strokeColor, 
		glow: false,
		glowColor: rocket.closestPlanet.color
	}

	ctx.globalAlpha = 0.7;
	drawCircle(viewPadding, viewPadding, planetRadius, rocket.closestPlanet.color, options);
	drawText(rocket.closestPlanet.name, viewPadding, viewPadding + planetRadius + textSpacing + planetSpacing, "25px Arial", "white", "center", "middle");
	drawText(rocket.closestPlanet.resource.type + " " + (rocket.closestPlanet.resource.amount/rocket.closestPlanet.resource.totalAmount)*100 + "%", viewPadding, viewPadding + planetRadius + textSpacing*2 + planetSpacing, "18px Arial", "white", "center", "middle");
	drawText("Mass: " + rocket.closestPlanet.mass + "kg", viewPadding, viewPadding + planetRadius + textSpacing*3 + planetSpacing, "18px Arial", "white", "center", "middle");
	drawText("Escape thrust: " + rocket.closestPlanet.escapeThrust, viewPadding, viewPadding + planetRadius + textSpacing*4 + planetSpacing, "18px Arial", "white", "center", "middle");
	drawText(Math.round(distance) + "km", viewPadding, viewPadding + planetRadius + textSpacing*5 + planetSpacing, "18px Arial", "white", "center", "middle");
	ctx.globalAlpha = 1;

}

function advancedKey() {

	//Advanced view toggle
	if(map[192]) {
		if(advancedToggle === false) {
			advancedToggle = true;
			display.advanced = !display.advanced;
		}
	
	} else {
		if (advancedToggle) {
			advancedToggle = false;
		}
	}
}

function drawTitle() {

		//If drawing title
		if(onTitle) {
			ctx.beginPath();
			drawText(titleText, canvas.width/2, canvas.height/8, "60px Arial", "white", "center", "middle");
			drawText(descriptorText, canvas.width/2, canvas.height/8 + 40, "20px Arial", "white", "center", "middle");
			ctx.closePath();
		}
	}

function animateTitle(time, title, descriptor) {

	//Set title variables
	titleText = title;
	descriptorText = descriptor;

	//Set title timeout
	setTimeout(function() {
	onTitle = false; 
	}, time);
	onTitle = true;
}

