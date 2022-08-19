require('dotenv').config();
require('module-alias/register');
//require('@initializer/elasticsearch/elasticsearch-indexes.js');
require('@initializer/definition/definitionSeed.js');
require('./config/database');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const cors = require('cors');

const app = express();
const http = require('http');
const useragent = require('express-useragent');

const morgan = require('morgan');
app.set('trust proxy', true);

app.use(compression());

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200 // For legacy browser support
}));

app.use(useragent.express());

app.get('/Ping', async (req, res) => {
  res.status(200).send('ok');
});

app.use(
  morgan('dev', {
    skip(req, res) {
      // eslint-disable-next-line no-empty
      if (res) {}
      if (req.originalUrl.indexOf('path') >= 0) {
        return true;
      }
      return false;
    },
  }),
);

app.get('/', async (req, res) => {
  res.redirect('/console');
});

const server = http.createServer(app);
// const io = socketio(server);

const router = express.Router();

router.use(
  express.urlencoded({
    limit: '100mb',
    extended: true,
  }),
);
router.use(
  express.json({
    limit: '100mb',
    extended: false,
  }),
);

const api = express.Router();

api.use(
  express.urlencoded({
    limit: '100mb',
    extended: true,
  }),
);
api.use(
  express.json({
    limit: '100mb',
    extended: true,
  }),
);

const logger = require('./middleware/logger');
const universalParams = require('./middleware/universalParams');

api.use(logger);
api.use(universalParams);
app.use('/api', api);

const apiParams = {
  // io,
  api,
};
require('./api/api')(apiParams);

const cron=require('node-cron');
const YoutubeController=require('@controller/client/youtube');
// YoutubeController.deleteSearchResults();
// YoutubeController.postSearchResults();
cron.schedule('*/1 * * * *', () => {
  YoutubeController.deleteSearchResults();
  YoutubeController.postSearchResults();
  console.log('running a task every one minutes', new Date());
  
});
app.use('/', router);

router.all('/*', (req, res) => {
  res.status(404).send('Not Found');
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});