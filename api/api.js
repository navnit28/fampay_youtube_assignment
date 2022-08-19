const express = require('express');
const operationsErrorMiddleware = require('@middleware/operationsErrorHandler');
module.exports = function (apiParams) {
  const {
    api,
  } = apiParams;


  const AppendParams = async (req, res, next) => {
    try {
      req.modules = apiParams;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'An Error occured',
      });
    }
  };

  api.use(AppendParams);

  api.get('/', async (req, res) => {
    res.send('OK');
  });


  const youtube_router = express.Router();
  api.use('/youtube',youtube_router);
  require('./youtube')(youtube_router)



  api.use(operationsErrorMiddleware);
};