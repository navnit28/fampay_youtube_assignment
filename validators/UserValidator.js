const { check, validationResult } = require('express-validator');

class UserValidator {
  static defaultValidations() {
    return [
      check('name').notEmpty().withMessage('"name" is required').isString()
        .withMessage('"name" should be a string.'),
      check('email').notEmpty().withMessage('"email" is required').isString()
        .withMessage('"emaiil" should be a string.'),
      check('last_name').notEmpty().withMessage('"last_name" is required').isString()
        .withMessage('"last_name" should be a string.'),
      check('first_name').notEmpty().withMessage('"first_name" is required').isString()
        .withMessage('"first_name" should be a string.'),
      check('account_type').notEmpty().withMessage('"account_type" is required').isString()
        .withMessage('"account_type" should be a string.'),
      check('emailverificationcode').notEmpty().withMessage('"emailverificationcode" is required').isString()
        .withMessage('"emailverificationcode" should be a string.'),
    ];
  }

  static phoneValidation() {
    return [
      check('phone_number').notEmpty().withMessage('"phone_number" is required').isMobilePhone()
        .withMessage('enter a valid phone number with the country code followed by a +'),
    ];
  }

  static validate(req) {
    return validationResult(req);
  }
}

module.exports = UserValidator;
