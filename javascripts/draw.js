function drawStats() {
	for (var i = 0; i < stats.length; i++) {
		let stat = stats[i];
		stat.display(i);
	}
}

function drawDashboard() {
	var pad = 15;
	var yOffset = 50;
	var options = {
		outline: true,
		outlineWidth: 5,
		outlineColor: pSBC(-0.1, "#767652", false, true),
		fill: false
	}
	drawRectangle(pad, canvas.height-pad-yOffset, 300, 50, "#767652", options);
	drawRectangle(pad, canvas.height-pad-yOffset, 300*rocket.fuel/rocket.maxFuel, 50, "#767652");
	drawText("Fuel", pad+10, canvas.height-pad-yOffset+30, "30px Arial", "lime", "left", "middle");

	var pad = 15;
	var yOffset = 120;
	var options = {
		outline: true,
		outlineWidth: 5,
		outlineColor: pSBC(-0.1, "#CE2029", false, true),
		fill: false
	}
	drawRectangle(pad, canvas.height-pad-yOffset, 300, 50, "#CE2029", options);
	drawRectangle(pad, canvas.height-pad-yOffset, 300*Math.abs(rocket.thrust)/rocket.maxThrust, 50, "#CE2029");
	drawText("Thrust", pad+10, canvas.height-pad-yOffset+30, "30px Arial", "lime", "left", "middle");
}

function drawSpace() {
	let color = "#1d2951";
	if (rocket.crashed)
		color = pSBC(0.1, "#1d2951", "#ff0000");
	drawRect(rocket.pos.x, rocket.pos.y, canvas.width, canvas.height, 0, color);
}