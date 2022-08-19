const mongoose = require('mongoose');
const fs = require('fs');

const url = process.env.MONGODB_URI || 'mongodb://mongo:27017/fampay-test';

if (process.env.MONGO_CONFIG === 'aws') {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    ssl: true,
    sslValidate: false,
    sslCA: fs.readFileSync('./rds-combined-ca-bundle.pem'),
  });
} else if (process.env.MONGO_CONFIG === 'atlas') {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,

  });
} else {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,

  });
}