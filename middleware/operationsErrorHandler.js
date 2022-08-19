const Redis = require('ioredis');

const redis_bus = new Redis(process.env.REDIS_URI);
const operationsErrorHandler = async (err, req, res, next) => {
  try {
    if (res.headersSent) {
      console.log(err);
      // console.log( err.code )
      return next(err);
    }
    if (!err) return;
    const operation_errors = JSON.parse(await redis_bus.get('operation_errors_map_scholarship'));
    // console.log( operation_errors )
    console.log(err);
    console.log(err.message);
    console.log(err.code);
    if (Object.prototype.hasOwnProperty.call(operation_errors, err.code)) {
      const response = operation_errors[err.code];
      res.status(response.status).json({
        code: err.code,
        message: response.message,
      });
      return;
    }
    if (Object.prototype.hasOwnProperty.call(operation_errors, err.message)) {
      const response = operation_errors[err.message];
      console.log({
        code: err.message,
        message: response.message,
      });
      res.status(response.status).json({
        code: err.message,
        message: response.message,
      });
      return;
    }

    const err_keys = Object.keys(operation_errors);
    const err_index = err_keys.findIndex((v) => err.message.includes(v));
    if (err_index === -1) {
      next(err);
    } else {
      const key = err_keys[err_index];
      const response = operation_errors[key];
      console.log({
        code: key,
        message: response.message,
      });
      res.status(response.status).json({
        code: err.message,
        message: response.message,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = operationsErrorHandler;