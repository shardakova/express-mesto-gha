class ValidationError extends Error {
  constructor(message) {
    super();
    this.status = 400;
    this.message = Object.values(message.errors).map((error) => ({
      field: error.path,
      value: error.value,
      reason: error.kind,
    }));
  }
}

module.exports = ValidationError;