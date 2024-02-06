class createError extends Error {
  constructor() {
    super();
  }
createError(statusCode, statusText, message) {
  return { statusCode, statusText, message };
}
}

export default new createError();
