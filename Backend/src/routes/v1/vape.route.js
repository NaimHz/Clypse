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
