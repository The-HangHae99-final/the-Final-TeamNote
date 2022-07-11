const passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
  .is()
  .min(4) // Minimum length 8
  .is()
  .max(12) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123']);
module.exports = {
  schema,
};
