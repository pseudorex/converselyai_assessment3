'use strict';

/**
 * Factory — returns a middleware that validates `req.body` against a Joi schema.
 * Returns 400 with a descriptive message if validation fails.
 *
 * @param {import('joi').Schema} schema
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,     // collect all errors
      stripUnknown: true,    // remove unknown fields
    });

    if (error) {
      const messages = error.details.map((d) => d.message).join('; ');
      const err = new Error(messages);
      err.statusCode = 400;
      return next(err);
    }

    req.body = value; // use the sanitized value
    next();
  };
}

module.exports = { validate };
