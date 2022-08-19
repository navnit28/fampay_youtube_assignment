const { check, validationResult } = require('express-validator');

class EntityDefinitionValidator {
  static defaultValidations() {
    return [
      check('entity_id').notEmpty().withMessage('"entity_id" is required.').isString()
        .withMessage('"entity_id" should be a string.'),
      check('definition').notEmpty().withMessage('"definition" is required.').isJSON({ allow_primitives: true })
        .withMessage('"definition" should be a json.'),
    ];
  }

  static validate(req) {
    return validationResult(req);
  }
}

module.exports = EntityDefinitionValidator;
