function drawStats() {
	for (var i = 0; i < stats.length; i++) {
		let stat = stats[i];
		stat.display(i);
	}
}

function drawSpace() {
	let color = "#1d2951";
	if (rocket.crashed || rocket.fuel <= 0 || rocket.oxygen <= 0)
		color = pSBC(0.1, "#1d2951", "#ff0000");
	drawRect(rocket.pos.x, rocket.pos.y, canvas.width, canvas.height, 0, color);
}

function drawRespawn() {
	if (rocket.crashed || rocket.fuel <= 0 || rocket.oxygen <= 0) {
		let text;
		if (rocket.oxygen <= 0)
			text = "You ran out of oxygen!";
		else if (rocket.fuel <= 0)
			text = "You ran out of fuel!";
		else if (rocket.speed >= rocket.landingSpeed)
			text = "You crashed!";
		else if (rocket.goodLanding === false)
			text = "You flipped over!";
		

		drawTitle(text, "Press R to respawn", true);
	}
}