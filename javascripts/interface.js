// Global
var titleText;
var titleId;
var descriptorText;
var onTitle = false;
var advancedToggle = true;

// Use function to call functions (yo dawg)
function drawInterface() {

	// Interface
	drawTitle(); // Draw the display title text
	advancedKey(); // Display advanced rocket stats
	drawClosestPlanetHUD(); // Draw the closest planet scale "?on the interface
	drawClosestPlanetInfo(); // Draw the closest planet scale 
	drawDashboard(); // Bottom-left indicators of vitals
	drawMinimap(); // Draw the space map

}

// Draw the minimap to display surrounding planets
function drawMinimap() {

	// HUD
	let HUDwidth = display.HUDwidth;
	let HUDheight = display.HUDheight;
	let viewPadding = display.viewPadding;
	let textSpacing = display.textSpacing;

	let planetSize = HUDheight * 0.75;
	let HUDpadding = HUDheight * 0.125;
	let labelSpacing = planetSize/4.5;

	// MAP
	let zoom = display.zoom;
	let mapSize = planetSize;
	let mapCordHeight = 10000;
	let mapCordWidth = 10000;
	let mapZoom = mapCordHeight / mapSize;

	// RECT
	let rectOptions = {
		alpha: 0.2,
		right: viewPadding
	}

	// ARC
	let optionsCircle = {
		outline: true,
		outlineWidth: 10,
		outlineColor: rocket.closestPlanet.strokeColor, 
		glow: false,
		glowColor: rocket.closestPlanet.color,
		alpha: 0.5
	}

	// Draw minimap center (player)
	drawRoundedRect(canvas.width - HUDwidth - viewPadding, canvas.height - HUDheight - viewPadding, HUDwidth, HUDheight, 5, "grey", rectOptions);

	// Draw the white map edge
	ctx.beginPath();
	ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
	ctx.arc((canvas.width - HUDwidth - viewPadding + HUDpadding + planetSize/2), 
	(canvas.height - HUDheight - viewPadding + HUDpadding + planetSize/2),
	 planetSize/2, 0, Math.PI*2);
	ctx.stroke();
	ctx.fillStyle = "#1d2951"
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc((canvas.width - HUDwidth - viewPadding + HUDpadding + planetSize/2), 
	(canvas.height - HUDheight - viewPadding + HUDpadding + planetSize/2),
	 planetSize/2, 0, Math.PI*2);
	ctx.fillStyle = "grey"
	ctx.globalAlpha = 0.2;
	ctx.fill();
	ctx.closePath();

	// Draw the planets
	drawCircle((canvas.width - HUDwidth - viewPadding + HUDpadding + planetSize/2), (canvas.height - HUDheight - viewPadding + HUDpadding + planetSize/2), 2, "white");
	for (var i = 0; i < planets.length; i++) {
		if(getDistance(planets[i].pos.x, planets[i].pos.y, rocket.pos.x, rocket.pos.y) < mapCordHeight/2) {
			drawCircle((canvas.width - HUDwidth - viewPadding + HUDpadding + planetSize/2) + ((planets[i].pos.x - rocket.pos.x) / mapZoom),
			(canvas.height - HUDheight - viewPadding + HUDpadding + planetSize/2) + ((planets[i].pos.y - rocket.pos.y) / mapZoom), planets[i].radius/mapZoom, planets[i].color);
		}
	}

	//Sort planet list by distance
	var sortedPlanetList = [];
	var planetList = [].concat(planets);
	for (var i = 0; i < 5; i++) {
		var selectPlanet = undefined;
		var distance = Infinity;
		for (var j = 0; j < planetList.length; j++) {
			if(dist(planetList[j].pos, rocket.pos) - planetList[j].radius - rocket.height/2 < distance) {
				distance = dist(planetList[j].pos, rocket.pos) - planetList[j].radius - rocket.height/2;
				selectPlanet = j;
			}
		}

		sortedPlanetList.push(planetList[selectPlanet]);
		planetList.splice(selectPlanet, 1);
	}

	//Display List
	drawText("1. " + rocket.closestPlanet.name, 
		canvas.width - HUDwidth - viewPadding + planetSize + HUDpadding*2,
		canvas.height - viewPadding - HUDheight + HUDpadding, 
		"16px Arial", "white", "left", "top"
	);

	drawText("2. " + sortedPlanetList[1].name, 
		canvas.width - HUDwidth - viewPadding + planetSize + HUDpadding*2,
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing, 
		"16px Arial", "white", "left", "top"
	);

	drawText("3. " + sortedPlanetList[2].name, 
		canvas.width - HUDwidth - viewPadding + planetSize + HUDpadding*2,
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing * 2, 
		"16px Arial", "white", "left", "top"
	);

	drawText("4. " + sortedPlanetList[3].name, 
		canvas.width - HUDwidth - viewPadding + planetSize + HUDpadding*2,
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing * 3, 
		"16px Arial", "white", "left", "top"
	);

	drawText("5. " + sortedPlanetList[4].name, 
		canvas.width - HUDwidth - viewPadding + planetSize + HUDpadding*2,
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing * 4, 
		"16px Arial", "white", "left", "top"
	);
}

// Draw the advanced stats
function drawStats() {
	for (var i = 0; i < stats.length; i++) {
		let stat = stats[i];
		stat.display(i);
	}
}

// Draw the rocket dashboard (fuel, oxygen, thrust)
function drawDashboard() {

	// HUD
	let HUDwidth = display.HUDwidth;
	let HUDheight = display.HUDheight;
	let viewPadding = display.viewPadding;
	let textSpacing = display.textSpacing

	// BAR
	let planetSize = HUDheight * 0.75;
	let HUDpadding = HUDheight * 0.06;
	let labelSpacing = planetSize/4;
	let barSize = (HUDwidth/2 - HUDpadding*4)/3;

	let rectOptions = {
	alpha: 0.2,
	right: viewPadding
	}
	
	// Background HUD
	drawRoundedRect(viewPadding*1.5 + HUDwidth, canvas.height - viewPadding - HUDheight, HUDwidth/2, HUDheight, 5, "grey", rectOptions);

	// Fuel
	var XOffset = 50;
	var options = {
		outline: true,
		outlineWidth: 2,
		outlineColor: pSBC(-0.1, "#808080", false, true),
		fill: false,
		alpha: 0.5
	}

	// Draw fuel bar
	drawRectangle(viewPadding*1.5 + HUDwidth + HUDpadding, 
	canvas.height - viewPadding - HUDpadding, 
	barSize, -HUDheight + HUDpadding*2, "#808080", options);
	drawRectangle(viewPadding*1.5 + HUDwidth + HUDpadding, 
	canvas.height - viewPadding - HUDpadding, 
	barSize, (-HUDheight + HUDpadding*2)*Math.abs(rocket.fuel)/rocket.maxFuel, "#808080");

	// Draw fuel text
	ctx.save();
	ctx.beginPath();
	ctx.translate(viewPadding*1.5 + HUDwidth + HUDpadding, canvas.height - viewPadding - HUDpadding);
	ctx.rotate(270 * Math.PI / 180);
	drawText("FUEL", 30, barSize/2, "15px Arial", "#292929", "center", "middle");
	ctx.closePath();
	ctx.restore();

	// Oxygen
	var yOffset = 120;
	var options = {
		outline: true,
		outlineWidth: 2,
		outlineColor: pSBC(-0.1, "#F6F5F2", false, true),
		fill: false,
		alpha: 0.5
	}

	// Draw oxygen bar
	drawRectangle(viewPadding*1.5 + HUDwidth + HUDpadding*2 + barSize, 
	canvas.height - viewPadding - HUDpadding, 
	barSize, -HUDheight + HUDpadding*2, "#F6F5F2", options);
	drawRectangle(viewPadding*1.5 + HUDwidth + HUDpadding*2 + barSize, 
	canvas.height - viewPadding - HUDpadding, 
	barSize, (-HUDheight + HUDpadding*2)*Math.abs(rocket.oxygen)/rocket.maxOxygen, "#F6F5F2");

	// Draw oxygen text
	ctx.save();
	ctx.beginPath();
	ctx.translate(viewPadding*1.5 + HUDwidth + HUDpadding*2 + barSize, canvas.height - viewPadding - HUDpadding);
	ctx.rotate(270 * Math.PI / 180);
	drawText("OXYGEN", 40, barSize/2, "15px Arial", "#292929", "center", "middle");
	ctx.closePath();
	ctx.restore();

	// Thrust
	var yOffset = 190;
	var options = {
		outline: true,
		outlineWidth: 2,
		outlineColor: pSBC(-0.1, "#e0982b", false, true),
		fill: false,
		alpha: 0.5
	}

	// Draw thrust bar
	drawRectangle(viewPadding*1.5 + HUDwidth + HUDpadding*3 + barSize*2, 
	canvas.height - viewPadding - HUDpadding, 
	barSize, -HUDheight + HUDpadding*2, "#e0982b", options);
	drawRectangle(viewPadding*1.5 + HUDwidth + HUDpadding*3 + barSize*2, 
	canvas.height - viewPadding - HUDpadding, 
	barSize, (-HUDheight + HUDpadding*2)*Math.abs(rocket.thrust)/rocket.maxThrust, "#e0982b");

	// Draw thrust text
	ctx.save();
	ctx.beginPath();
	ctx.translate(viewPadding*1.5 + HUDwidth + HUDpadding*3 + barSize*2, canvas.height - viewPadding - HUDpadding);
	ctx.rotate(270 * Math.PI / 180);
	drawText("THRUST", 40, barSize/2, "15px Arial", "#292929", "center", "middle");
	ctx.closePath();
	ctx.restore();
}

// Inform the player about the closest planet
function drawClosestPlanetInfo() {
	let zoom = display.zoom;
	let rocketPos = Vector.mult(rocket.pos, zoom);
	var distance;
	var planetPos;

	// Cycle through planets
	for (var i = 0; i < planets.length; i++) {
		if (zoom < 0.8) { // Make sure the rocket is in space

			// Set planet position and distance 
			planetPos = Vector.mult(planets[i].pos, zoom);
			var distance = dist(planets[i].pos, rocket.pos) - planets[i].radius - rocket.height/2;

			// Text align
			let textDir;
			let textAlign;
			let angleFromPlanet = Math.atan2(planets[i].pos.y-rocket.pos.y, planets[i].pos.x-rocket.pos.x)/Math.PI*180;

			// Planet text position
			if(angleFromPlanet < 90 && angleFromPlanet >= 0) {
				textDir = new Vector(-1, -1)
				textAlign = "right";
			} else if(angleFromPlanet >= 90 && angleFromPlanet <= 180) {
				textDir = new Vector(1, -1)
				textAlign = "left";
			} else if(angleFromPlanet >= -180 && angleFromPlanet <= -90) {
				textDir = new Vector(1, 1)
				textAlign = "left";
			} else if(angleFromPlanet > -90 && angleFromPlanet <= 0) {
				textDir = new Vector(-1, 1)
				textAlign = "right";
			}

			// Draw pointer circle and lines
			drawCircle(planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius/2)*zoom, planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius/2)*zoom, 15*zoom, "white");
			ctx.beginPath();
			ctx.strokeStyle = "white";
			ctx.lineWidth = 15*zoom;
			ctx.moveTo(planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius/1.6)*zoom, planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius/1.6)*zoom);
			ctx.lineTo(planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom, planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom);
			ctx.lineTo(planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*50*zoom, planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom);
			ctx.stroke();
			ctx.closePath();

			// Draw descriptive text
			ctx.beginPath();
			drawText(
				planets[i].name, 
				planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*60*zoom, 
				planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom - 40*zoom, 
				60*zoom + "px Arial", "white", textAlign, "middle");
			if(planets[i].name == "Black Hole") {
				drawText("Mass: UNKNOWN", 
					planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*60*zoom, 
					planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom, 
					30*zoom + "px Arial", "white", textAlign, "middle");
			} else {
				drawText("Mass: " + round(planets[i].mass, 0) + "kg | Escape thrust: " + planets[i].escapeThrust, 
				planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*60*zoom, 
				planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom, 
				30*zoom + "px Arial", "white", textAlign, "middle")
			}
			if(distance/1000 > 1) {
				drawText(round(distance/1000, 2) + "km", 
					planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*60*zoom, 
					planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom + 40*zoom, 
					50*zoom + "px Arial", "white", textAlign, "middle");
				ctx.closePath();	
			} else {
				drawText(round(Math.max(distance, 0)) + "m", 
					planetPos.x - rocketPos.x + canvas.width/2 + textDir.x*(planets[i].radius)*zoom + textDir.x*60*zoom, 
					planetPos.y - rocketPos.y + canvas.height/2 + textDir.y*(planets[i].radius)*zoom + 40*zoom, 
					50*zoom + "px Arial", "white", textAlign, "middle");
				ctx.closePath();	
			}	
		}
	}
}

// Draw closest planet on HUD
function drawClosestPlanetHUD() {

	// HUD
	let HUDwidth = display.HUDwidth;
	let HUDheight = display.HUDheight;
	let viewPadding = display.viewPadding;
	let textSpacing = display.textSpacing;

	// LABEL
	let planetSize = HUDheight * 0.75;
	let HUDpadding = HUDheight * 0.125;
	let labelSpacing = planetSize/4;

	// Draw background HUD
	let options = {
		alpha: 0.2,
		right: viewPadding
	}
	
	drawRoundedRect(viewPadding, canvas.height - viewPadding - HUDheight, HUDwidth, HUDheight, 5, "grey", options);

	// Draw planet
	let optionsCircle = {
		outline: true,
		outlineWidth: 10,
		outlineColor: rocket.closestPlanet.strokeColor, 
		glow: false,
		glowColor: rocket.closestPlanet.color,
		alpha: 0.5
	}

	drawCircle(viewPadding + planetSize/2 + HUDpadding, canvas.height - viewPadding - HUDheight/2, planetSize/2, rocket.closestPlanet.color, optionsCircle); // Draw planet on HUD

	// Draw descriptive text
	drawText("NAME:", 
		viewPadding + planetSize + HUDpadding*2,
		canvas.height - viewPadding - HUDheight + HUDpadding, 
		"10px Arial", "grey", "left", "top"
	);
	drawText(rocket.closestPlanet.name, 
		viewPadding + planetSize + HUDpadding*2, 
		canvas.height - viewPadding - HUDheight + HUDpadding + textSpacing,
		"22px Arial", "white", "left", "top"
	);
	drawText("RESOURCE:", 
		viewPadding + planetSize + HUDpadding*2, 
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing,
		"10px Arial", "grey", "left", "top"
	);
	if (rocket.closestPlanet.resource.type == "None") {
		drawText("None", 
		viewPadding + planetSize + HUDpadding*2, 
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing + textSpacing,
			"18px Arial", "white", "left", "top"
		);
	} else {
		drawText(rocket.closestPlanet.resource.type + ": " + round((rocket.closestPlanet.resource.amount/rocket.closestPlanet.resource.totalAmount)*100, 1) + "%", 
		viewPadding + planetSize + HUDpadding*2, 
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing + textSpacing,
			"18px Arial", "white", "left", "top"
		);
	}
	drawText("MASS:", 
		viewPadding + planetSize + HUDpadding*2, 
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing*2,
		"10px Arial", "grey", "left", "top"
	);
	if(rocket.closestPlanet.name == "Black Hole") {
		drawText("UNKNOWN", 
		viewPadding + planetSize + HUDpadding*2, 
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing*2 + textSpacing,
			"18px Arial", "white", "left", "top"
		);
	} else {
		drawText(round(rocket.closestPlanet.mass, 0) + "kg", 
		viewPadding + planetSize + HUDpadding*2, 
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing*2 + textSpacing,
			"18px Arial", "white", "left", "top"
		);
	}
	drawText("DISTANCE:", 
		viewPadding + planetSize + HUDpadding*2, 
		canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing*3,
		"10px Arial", "grey", "left", "top"
	);

	if(rocket.closestPlanetDistance/1000 > 1) {
		drawText(round(rocket.closestPlanetDistance/1000, 2) + "km", 
			viewPadding + planetSize + HUDpadding*2, 
			canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing*3 + textSpacing,
			"18px Arial", "white", "left", "top"
		);
	} else {
		drawText(round(rocket.closestPlanetDistance, 0) + "m", 
			viewPadding + planetSize + HUDpadding*2, 
			canvas.height - viewPadding - HUDheight + HUDpadding + labelSpacing*3 + textSpacing,
			"18px Arial", "white", "left", "top"
		);
	}
}

// Key to toggle advanced stats
function advancedKey() {

	// Advanced view toggle
	if(keys[192]) {
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

// Draw the center title 
function drawTitle(title, descriptor, ignoreTimeout) {

		// TITLE
		let titleOptions = {
			font: "80px Arial",
			color: "white",
			align: "center",
			baseline: "middle"
		}

		// SUBTITLE
		let options = {
			font: "20px Arial",
			color: "white",
			align: "center",
			baseline: "middle"
		}

		// If drawing title
		if(onTitle) {
			ctx.beginPath();
			drawText(titleText, canvas.width/2, canvas.height/5, titleOptions);
			drawText(descriptorText, canvas.width/2, canvas.height/5 + 50, options);
			ctx.closePath();
		}

		// Overwrite the time out title
		if (ignoreTimeout) {			
			onTitle = false;
			ctx.beginPath();
			drawText(title, canvas.width/2, canvas.height/5, titleOptions);
			drawText(descriptor, canvas.width/2, canvas.height/5 + 50, options);
			ctx.closePath();
		}
	}

// Animated title timer
function animateTitle(title, descriptor, time) {

	// Set title variables
	titleText = title;
	descriptorText = descriptor;

	// Set title timeout
	if (time > 0) {
		titleId = setTimeout(function() {
			onTitle = false;
		}, time);
	}
	onTitle = true;
}