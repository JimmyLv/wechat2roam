class RoomNameMatcher {
  constructor(handlers) {
    this.handlers = handlers;
  }

  async match(message) {
    const room = message.room();
    if (!room) {
      return [];
    }

    const topic = await room.topic();
    return this.handlers.filter((h) => h.roomName === topic);
  }
}

module.exports = RoomNameMatcher;
