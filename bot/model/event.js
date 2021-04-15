class Event {
  constructor(date, hosts) {
    this.date = date;
    this.hosts = hosts;
  }

  toString(index) {
    return `${index}. ${this.date}\n${this.hostsString()}`;
  }

  hostsString() {
    return this.hosts.map(h => `  - ${h}`).join("\n");
  }

  appendHost(name) {
    if (this.hosts.includes(name)) {
      this.hosts = this.hosts.filter(h => h !== name);
      return false;
    }

    if (this.hosts.length === 2) {
      return false;
    }

    this.hosts.push(name);
    return true;
  }
}

module.exports = Event;
