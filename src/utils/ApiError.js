class ApiError extends Error {
  constructor(
    statusCode,
    messgae = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super(messgae);
    this.statusCode = statusCode;
    this.data = null;
    this.message = messgae;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export {ApiError}