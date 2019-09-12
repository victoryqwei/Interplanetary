class Planet {
	constructor(x, y, mass, radius, name = "Planet", color = "#c1440e", strokeColor) {
		this.pos = new Vector(x, y);
		this.mass = mass;
		this.radius = radius;
		this.name = name;
		
		this.color = color;
		this.strokeColor = strokeColor || pSBC(-0.2, this.color, false, true);
	}

	display() {
		let zoom = display.zoom;
		ctx.save();
		ctx.translate(-rocket.pos.x*zoom + canvas.width/2 , -rocket.pos.y*zoom + canvas.height/2);
		let options = {
			outline: true,
			outlineWidth: 10,
			outlineColor: this.strokeColor, 
			glow: true,
			glowColor: this.color
		}
		drawCircle(this.pos.x*zoom, this.pos.y*zoom , this.radius*zoom, this.color, options);
		ctx.restore();
	}

	drawMarker() {
		let markerRadius = 10;

		let zoom = display.zoom;
		let rocketPos = Vector.mult(rocket.pos, zoom);
		let pos = Vector.mult(this.pos, zoom);

		let distance = dist(this.pos, rocket.pos) - this.radius - rocket.height/2;
		if (inScreen(this.pos)) {
			drawText(Math.round(distance) + "km", pos.x - rocketPos.x + canvas.width/2, pos.y - rocketPos.y + canvas.height/2, "40px Arial", "white", "center", "middle");
		} else {
			let xPos, yPos;

			let screenX, screenY;

			let xDiff, yDiff;

			let xRatio, yRatio;

			let textOffset = "center";
			let vOffset = "middle";
			let offX = 0;
			let offY = 0;

			if (rocketPos.y - pos.y > 0) {
				xDiff = (pos.x - rocketPos.x);
				yPos = markerRadius + 5;
				vOffset = "top";
				offY = 15;
			} else {
				xDiff = -(pos.x - rocketPos.x);
				yPos = canvas.height - (markerRadius + 5);
				vOffset = "bottom";
				offY = -15;
			}

			yRatio = (canvas.height/2 / (rocketPos.y - pos.y));
			screenX = canvas.width/2 + xDiff * yRatio;

			xPos = constrain(screenX, markerRadius + 5, canvas.width - markerRadius - 5);

			if (screenX > canvas.width || screenX < 0) {
				if (rocketPos.x - pos.x < 0) {
    				yDiff = (pos.y - rocketPos.y);
    				xPos = canvas.width - (markerRadius + 5);
    				textOffset = "right";
    				offX = -15;
    				offY = 0;
    				vOffset = "middle";
    			} else {
    				yDiff = -(pos.y - rocketPos.y);
    				xPos = markerRadius + 5;
    				textOffset = "left";
    				offX = 15;
    				offY = 0;
    				vOffset = "middle";
    			}

    			xRatio = canvas.width/2 / (pos.x - rocketPos.x);
    			screenY = canvas.height/2 + yDiff * xRatio;
    			yPos = constrain(screenY, markerRadius + 5, canvas.height - markerRadius - 5);
			}
			let options = {
				outline: true, 
				outlineColor: this.strokeColor,
				outlineWidth: 3
			}
			drawCircle(xPos, yPos, markerRadius, this.color, options)
			if (distance < 8000)
				drawText(Math.round(distance) + "km", xPos + offX, yPos + offY, "20px Arial", "white", textOffset, vOffset);
		}
	}
}