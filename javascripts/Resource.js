class Resource {
	constructor(type, amount, totalAmount) {
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
		this.amount = amount || randInt(100, 1000);
		if (type == "None")
			this.amount = 100;
		this.totalAmount = totalAmount || this.amount;
	}
}