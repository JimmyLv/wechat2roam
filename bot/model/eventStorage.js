const Event = require('./event');
const Storage = require('./storage');
const storage = new Storage();
const key = 'events';

class EventStorage {

	getEvents() {
		let events = storage.get(key);
		return events ? events.map((e) => parse(e.date, e.hosts)) : null;
	}

	saveEvents(events) {
		storage.set(key, events.map((e) => new Event(e.date, e.hosts)));
	}

	hasEvents() {
		return this.getEvents();
	}
}

function parse(date, hosts) {
	return new Event(date, hosts);
}

module.exports = EventStorage;
