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
 *   description: Vape management and retrieval
 */
/**
 * @swagger
 * /vapes:
 *   post:
 *     summary: Create a vape
 *     description: Only admins can create vapes.
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
 *               name: Vape Name
 *               model: Vape Model
 *   get:
 *     summary: Get all vapes
 *     tags: [Vapes]
 */
/**
 * @swagger
 * /vapes/{vapeId}:
 *   get:
 *     summary: Get a vape by ID
 *     tags: [Vapes]
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vape
 *   patch:
 *     summary: Update a vape by ID
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vape to update
 *   delete:
 *     summary: Delete a vape by ID
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /vapes/user/link:
 *   post:
 *     summary: Link a vape to the user
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
 *     summary: Get all vapes linked to the user
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /vapes/user/{vapeId}/unlink:
 *   post:
 *     summary: Unlink a vape from the user
 *     tags: [Vapes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vapeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vape to unlink
 */
