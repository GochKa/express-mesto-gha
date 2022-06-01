class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.Code = 401;
  }
}

module.exports = UnauthorizedError;
