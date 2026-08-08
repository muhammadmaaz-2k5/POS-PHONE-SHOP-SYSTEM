const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Validates express-validator results.
 * Place this middleware AFTER your validation chain.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    return next(new ApiError(message, 422));
  }
  next();
};

module.exports = validate;
