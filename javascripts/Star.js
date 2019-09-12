class Star {
	constructor (x, y, exact, starDistance) {
		this.pos = new Vector(randInt(-x, x), randInt(-y, y));
		if (exact)
			this.pos = new Vector(x, y);
		this.starDistance = starDistance || 20;
	}

	display() {
		let starDistance = this.starDistance;
		let zoom = display.zoom;

		if (inScreen(this.pos, starDistance)) {
			drawCircle(
				this.pos.x*zoom - rocket.pos.x*zoom / starDistance + canvas.width/2, 
				this.pos.y*zoom - rocket.pos.y*zoom / starDistance + canvas.height/2, 
				2, 
				"white"
			);
		}
	}
}