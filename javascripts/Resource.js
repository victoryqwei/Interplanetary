class Resource {
	constructor(type) {
		if(type == undefined) {
			switch (randInt(0, 2)) {
			  case 0:
			    this.type = "Iron"
			    break;
			  case 1:
			    this.type = "Copper"
			    break;
			  case 2:
			    this.type = "Kanium"
			    break;
			}
		} else {
			this.type = type;
		}
		this.amount = randInt(100, 1000);
		this.totalAmount = this.amount;
	}
}