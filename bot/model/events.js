const Event = require('./event');
const EventStorage = require('./eventStorage');
const eventStorage = new EventStorage();


class Events {

	constructor(calendar) {
		if (eventStorage.hasEvents()) {
			this.travelTo(calendar);
		} else {
			let events = calendar.getComingEventDates(5).map((date) => new Event(date, []));
			eventStorage.saveEvents(events);
		}
	}

	toString() {
		return eventStorage.getEvents()
			.map((e, index) => e.toString(index + 1)).join('\n');
	}

	book(dateOrIndex, name) {
		if (this.isNumber(dateOrIndex)) {
			return this.bookByNumber(dateOrIndex, name);
		}
		return this.bookByDate(dateOrIndex, name);
	}

	bookByDate(date, name) {
		let events = eventStorage.getEvents();
		const event = events.find((e) => e.date === date);
		if (event) {
			event.appendHost(name);
			eventStorage.saveEvents(events);
			return true;
		}
		return false;
	}

	bookByNumber(number, name) {
		const index = Number(number);
		let events = eventStorage.getEvents();
		events[index - 1].appendHost(name);
		eventStorage.saveEvents(events);
		return true;
	}

	isNumber(dateOrIndex) {
		const index = Number(dateOrIndex);
		return index >= 1 && index <= 5;
	}

	travelTo(calendar) {
		const eventDates = calendar.getComingEventDates(5);
		let events = eventStorage.getEvents();
		events = this.removeOutdatedEvents(events, eventDates);
		this.addComingEvents(events, eventDates);
		eventStorage.saveEvents(events);
	}

	removeOutdatedEvents(events, eventDates) {
		return events.filter((e) => eventDates.includes(e.date));
	}

	addComingEvents(events, eventDates) {
		eventDates.forEach((date) => {
			if (!events.find((e) => e.date === date))
				events.push(new Event(date, []));
		});
	}
}

module.exports = Events;
