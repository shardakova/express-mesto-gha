class ConflictError extends Error {
  constructor(message = 'Conflict') {
    super(message);
    this.status = 409;
  }
}

module.exports = ConflictError;
