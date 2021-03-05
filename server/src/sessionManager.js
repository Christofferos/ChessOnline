const SessionManager = (() => {
  const context = {
    sessions: new Map(),
  };

  const api = {
    has(sessionID) {
      return context.sessions.has(sessionID);
    },
    get(sessionID) {
      return context.sessions.get(sessionID);
    },
    new() {
      const sessionID = Math.random();
      context.sessions.set(sessionID, {
        id: sessionID,
      });

      return context.sessions.get(sessionID);
    },
  };

  return api;
})();

module.exports = {
  SessionManager,
};
