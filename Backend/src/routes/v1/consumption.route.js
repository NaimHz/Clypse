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

/**
 * @swagger
 * tags:
 *   name: Consumption
 *   description: Consumption management
 */
/**
 * @swagger
 * /consumption:
 *   get:
 *     summary: Get user consumptions
 *     tags: [Consumption]
 *     responses:
 *       '200':
 *         description: User consumptions retrieved successfully
 */
/**
 * @swagger
 * /consumption/vape/{vapeId}:
 *   get:
 *     summary: Get consumption for a specific vape
 *     tags: [Consumption]
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vape
 *     responses:
 *       '200':
 *         description: Consumption data retrieved successfully
 */
/**
 * @swagger
 * /consumption/vape/{vapeId}/puff:
 *   post:
 *     summary: Record a puff for a specific vape
 *     tags: [Consumption]
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vape
 *     responses:
 *       '201':
 *         description: Puff recorded successfully
 */
/**
 * @swagger
 * /consumption/vape/{vapeId}/stats/daily:
 *   get:
 *     summary: Get daily stats for a specific vape
 *     tags: [Consumption]
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vape
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The date for which to retrieve stats (defaults to today)
 *     responses:
 *       '200':
 *         description: Daily stats retrieved successfully
 */
//         - in: query
//         name: password
//         required: true
//         schema:
//           type: string
//         description: The new password                
