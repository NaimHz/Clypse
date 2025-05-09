const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const consumptionValidation = require('../../validations/consumption.validation');
const consumptionController = require('../../controllers/consumption.controller');

const router = express.Router();

router.use(auth());

router.route('/').get(consumptionController.getUserConsumptions);

router.route('/vape/:vapeId').get(consumptionController.getVapeConsumption);

router
  .route('/vape/:vapeId/puff')
  .post(validate(consumptionValidation.recordPuff), consumptionController.recordPuff);

router
  .route('/vape/:vapeId/stats/daily')
  .get(consumptionController.getDailyStats);

module.exports = router;
