const passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
  .is()
  .min(4) // Minimum length 8
  .is()
  .max(12) // Maximum length 100// Must have lowercase letters// Must have at least 2 digits
  .has()
  .not()
  .spaces(); // Should not have spaces

module.exports = {
  schema,
};
