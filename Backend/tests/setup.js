const mongoose = require('mongoose');
const config = require('../src/config/config');

before(async function () {
  this.timeout(10000); // Augmenter le timeout pour la connexion initiale
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
});

after(async function () {
  await mongoose.connection.close();
});
