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
 *   name: Consommation
 *   description: Gestion de la consommation
 */
/**
 * @swagger
 * /consumption:
 *   get:
 *     summary: Obtenir les consommations de l'utilisateur
 *     tags: [Consommation]
 *     responses:
 *       '200':
 *         description: Consommations de l'utilisateur récupérées avec succès
 */
/**
 * @swagger
 * /consumption/vape/{vapeId}:
 *   get:
 *     summary: Obtenir la consommation pour une vape spécifique
 *     tags: [Consommation]
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de la vape
 *     responses:
 *       '200':
 *         description: Données de consommation récupérées avec succès
 */
/**
 * @swagger
 * /consumption/vape/{vapeId}/puff:
 *   post:
 *     summary: Enregistrer une bouffée pour une vape spécifique
 *     tags: [Consommation]
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de la vape
 *     responses:
 *       '201':
 *         description: Bouffée enregistrée avec succès
 */
/**
 * @swagger
 * /consumption/vape/{vapeId}/stats/daily:
 *   get:
 *     summary: Obtenir les statistiques journalières pour une vape spécifique
 *     tags: [Consommation]
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de la vape
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: La date pour laquelle récupérer les statistiques (par défaut aujourd'hui)
 *     responses:
 *       '200':
 *         description: Statistiques journalières récupérées avec succès
 */
