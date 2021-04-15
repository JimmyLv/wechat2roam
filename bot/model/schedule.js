const Events = require('./events');

class Schedule {
	constructor(calendar) {
		this.events = new Events(calendar);
	}

	toString() {
		return this.title() + this.events.toString();
	}

	title() {
		return '#排期接龙\n';
	}

	book(dateOrIndex, name) {
		return this.events.book(dateOrIndex, name);
	}

	travelTo(calendar) {
		this.events.travelTo(calendar);
	}

}

module.exports = Schedule;
