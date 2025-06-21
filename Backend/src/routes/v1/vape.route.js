const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const vapeValidation = require('../../validations/vape.validation');
const vapeController = require('../../controllers/vape.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageVapes'), validate(vapeValidation.createVape), vapeController.createVape)
  .get(auth('getVapes'), validate(vapeValidation.getVapes), vapeController.getVapes);

router
  .route('/:vapeId')
  .get(auth('getVapes'), validate(vapeValidation.getVape), vapeController.getVape)
  .patch(auth('manageVapes'), validate(vapeValidation.updateVape), vapeController.updateVape)
  .delete(auth('manageVapes'), validate(vapeValidation.deleteVape), vapeController.deleteVape);

// Routes accessibles aux utilisateurs standards
router.route('/user/link').post(auth('linkUnlinkVape'), validate(vapeValidation.linkVape), vapeController.linkVape);
router.route('/user/vapes').get(auth('getOwnVapes'), vapeController.getUserVapes);
router
  .route('/user/:vapeId/unlink')
  .post(auth('linkUnlinkVape'), validate(vapeValidation.unlinkVape), vapeController.unlinkVape);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Vapes
 *   description: Gestion et récupération des vapes
 */
/**
 * @swagger
 * /vapes:
 *   post:
 *     summary: Créer une vape
 *     description: Seuls les administrateurs peuvent créer des vapes.
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - model
 *             properties:
 *               name:
 *                 type: string
 *               model:
 *                 type: string
 *             example:
 *               name: Nom de la Vape
 *               model: Modèle de la Vape
 *   get:
 *     summary: Récupérer toutes les vapes
 *     tags: [Vapes]
 */
/**
 * @swagger
 * /vapes/{vapeId}:
 *   get:
 *     summary: Récupérer une vape par ID
 *     tags: [Vapes]
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de la vape
 *   patch:
 *     summary: Mettre à jour une vape par ID
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de la vape à mettre à jour
 *   delete:
 *     summary: Supprimer une vape par ID
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /vapes/user/link:
 *   post:
 *     summary: Lier une vape à l'utilisateur
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vapeId
 *             properties:
 *               vapeId:
 *                 type: string
 *             example:
 *               vapeId: 60c72b2f9b1e8c001c8e4d3a
 */
/**
 * @swagger
 * /vapes/user/vapes:
 *   get:
 *     summary: Récupérer toutes les vapes liées à l'utilisateur
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /vapes/user/{vapeId}/unlink:
 *   post:
 *     summary: Délier une vape de l'utilisateur
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant de la vape à délier
 */
