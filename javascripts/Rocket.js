class Rocket {
	constructor(x, y, mass, width, height) {
		// Positional data
		this.pos = new Vector(x, y);
		this.prevPos = new Vector();
		this.vel = new Vector();
		this.acc = new Vector();

		this.speed = 0;

		// Orientation data
		this.heading = new Vector(1, 0);
		this.angle = 0;

		// Forces
		this.thrust = 0;

		this.steer = 0;

		this.gForce = 0; // Gravitational pull

		// Fuel
		this.fuel = 0;

		this.crashed = false;

		// Extra data
		this.closestPlanetDistance = 0;

		let config = {
			width: width,
			height: height
		}

		this.setConfig(config);

		this.particlesMax = 200;
		this.particles = [];
	}

	setConfig(cfg) {
		if (!cfg) cfg = {};

		this.height = cfg.height || 60;
		this.width = cfg.width || 20;

		this.maxSpeed = cfg.maxSpeed || Infinity;

		this.mass = cfg.mass || 100;
		this.maxThrust = cfg.maxThrust || 500;
		this.thrustSpeed = cfg.thrustSpeed || this.maxThrust/100;

		this.steerSpeed = cfg.steerSpeed || 3;

		this.maxFuel = cfg.maxFuel || 100000;
		this.fuel = this.maxFuel;

		this.fuelConsumption = cfg.fuelConsumption || 5;
	}

	input() {
		if (this.fuel > 0) {
			if (map[37] || map[65]) {
				this.steer = -1;
			} else if (map[39] || map[68]) {
				this.steer = 1;
			} else {
				this.steer = 0;
			}

			if (map[38] || map[87]) {
				this.thrust = Math.min(this.maxThrust, this.thrust + this.thrustSpeed * delta / 16);
			} else if (map[40] || map[83] && this.thrust <= 0) {
				//this.thrust = Math.max(-this.maxThrust/3, this.thrust - this.thrustSpeed * delta / 16)
			} else {
				/*this.thrust -= Math.sign(this.thrust) * this.thrustSpeed * 2 * delta / 16;
				if (Math.abs(this.thrust) < 100) {
					this.thrust = 0;
				}*/
				this.thrust = 0;
			}
		} else {
			this.thrust = 0;
			this.steer = 0;
		}
	}

	attract(planet) {
    	var force = planet.pos.copy();
    	force.sub(this.pos);
	    var distance = force.getMag();

	    force.normalize();
	 
	    var strength = (1 * this.mass * planet.mass) / (distance * distance);
	    force.mult(strength);

	    return force;
    }

    closestPlanet(planets) {
    	let closestDistance = Infinity;
    	for (let p of planets) {
    		if (dist(p.pos, this.pos) < closestDistance)
    			closestDistance = dist(p.pos, this.pos) - p.radius - this.height/2;
    	}
    	return closestDistance;
    }

	move() {
		this.prevPos = this.pos.copy();

		if (!this.onPlanet)
			this.angle += this.steer * this.steerSpeed / Math.PI * delta / 200;

		this.heading = Vector.rotate(new Vector(0, -1), this.angle);

		// Thrust from rocket
		let thrustForce = this.heading.copy();
		thrustForce.mult(this.thrust);

		// Gravitational force
		let gravForce = new Vector();
		for (let p of planets) {
			gravForce.add(this.attract(p));
		}
		this.gForce = gravForce.getMag();

		let netForce = thrustForce.copy();
		netForce.add(gravForce);

		this.acc = netForce.copy();
		this.acc.div(this.mass);

		this.vel.add(this.acc);

		this.speed = this.vel.getMag(); // Get speed in pixels per second
		if (this.speed > this.maxSpeed) { // Constrain to max speed
			this.vel.normalize();
			this.vel.mult(this.maxSpeed);
		}

		// Calculate fuel
		let newFuel = this.fuel - (Math.abs(this.thrust) + Math.abs(this.steer)*200 + 100) * delta / 1000 * this.fuelConsumption;
		this.fuel = constrain(newFuel, 0, this.maxFuel);

		// New position
		this.pos.add(Vector.mult(this.vel, delta/1000));

		// Extra data
		this.closestPlanetDistance = this.closestPlanet(planets);

		// Particles

		if (this.thrust > 0) {
			let thrusterPos = this.pos.copy();
			let rocketHeading = this.heading.copy();
			rocketHeading.mult(-this.height/2);
			thrusterPos.add(rocketHeading);

			for (var i = 0; i < 5; i++) {
				let smokeOffset = this.width;
				let smokeParticle = new Vector(
					thrusterPos.x+random(smokeOffset, -smokeOffset), 
					thrusterPos.y+random(smokeOffset, -smokeOffset)
				);

				smokeParticle.time = Date.now();
				this.particles.push(smokeParticle);
			}
		}
	}

	collision() {
		this.onPlanet = false;
		for (let p of planets) {
			if (circleCollidesRect(p, this)) {
				// Crash detection

				let displacement = Vector.sub(this.pos, p.pos);
				let angle = Math.atan2(displacement.y, displacement.x);
				let angleDiff = (angle - (this.angle-Math.PI/2))%(Math.PI*2);
				let goodLanding = Math.abs(angleDiff) < 0.5 || Math.abs(2*Math.PI-angleDiff) < 0.5;

				// Set position as one from previous frame
				this.pos.x = this.prevPos.x;
				this.pos.y = this.prevPos.y;

				// Velocity becomes 0
				this.vel.x = 0;
				this.vel.y = 0;
				this.onPlanet = true;

				// Check if rocket is still in planet
				if (circleCollidesRect(p, this)) {
					// Perform rocket repel
					displacement.normalize();
					displacement.mult(delta/20);
					this.pos.x += displacement.x;
					this.pos.y += displacement.y;
				}

				if (this.speed > 300 || !goodLanding) { // High velocity or wrong landing
					this.crashed = true;
				} else { // Start refueling the rocket
					this.fuel = constrain(this.fuel + delta * 10, 0, this.maxFuel);
				}
			}
		}
	}

	update() {
		if (!this.crashed) {
			this.input();
			this.move();
			this.collision();
		}
	}

	drawParticles() {
		let zoom = display.zoom;
		let size = this.width*2;
		let smokeDuration = 1000;
		for (let i = 0; i < this.particles.length; i++) {
			let p = this.particles[i];

	        if(smoke){
	        	ctx.globalAlpha = constrain(1-(Date.now()-p.time)/smokeDuration, 0, 1);
	            ctx.drawImage(smoke, p.x*zoom-this.pos.x*zoom+canvas.width/2-size/2*zoom, p.y*zoom-this.pos.y*zoom+canvas.height/2-size/2*zoom, size*zoom, size*zoom);    
	            ctx.globalAlpha = 1;
	            continue;
	        }
		}

		for (let i = 0; i < this.particles.length; i++) {
			if (Date.now()-this.particles[i].time > smokeDuration) {
	        	this.particles.splice(i, 1);
	        }
		}
	}

	display() {
		let width = this.width * display.zoom;
		let height = this.height * display.zoom;

		// Draw particles
		this.drawParticles();

		// Draw body
		ctx.save();
		drawRect(canvas.width/2, canvas.height/2, width, height, this.angle, "#d3d3d3")
		ctx.restore();

		// Draw thrusters
		ctx.save();
		ctx.translate(canvas.width/2, canvas.height/2);
		ctx.rotate(this.angle);
		drawRect(-width/2, height/2, width/2, width, 0, "red")
		ctx.restore();

		ctx.save();
		ctx.translate(canvas.width/2, canvas.height/2);
		ctx.rotate(this.angle);
		drawRect(width/2, height/2, width/2, width, 0, "red")
		ctx.restore();

		// Draw velocity
		let velocityDir = this.vel.copy();
		velocityDir.normalize();
		velocityDir.mult(20);
		drawArrow(canvas.width/2, canvas.height/2, canvas.width/2 + velocityDir.x, canvas.height/2 + velocityDir.y, 2, "lime");
	}
}