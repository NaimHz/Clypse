const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createVape = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    serialNumber: Joi.string().required(),
    model: Joi.string().required(),
    brand: Joi.string().required(),
    batteryLevel: Joi.number().min(0).max(100),
    isActive: Joi.boolean(),
  }),
};

const getVapes = {
  query: Joi.object().keys({
    code: Joi.string(),
    serialNumber: Joi.string(),
    model: Joi.string(),
    brand: Joi.string(),
    isActive: Joi.boolean(),
    userId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getVape = {
  params: Joi.object().keys({
    vapeId: Joi.string().custom(objectId),
  }),
};

const updateVape = {
  params: Joi.object().keys({
    vapeId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      code: Joi.string(),
      serialNumber: Joi.string(),
      model: Joi.string(),
      brand: Joi.string(),
      batteryLevel: Joi.number().min(0).max(100),
      isActive: Joi.boolean(),
      lastSyncDate: Joi.date(),
    })
    .min(1),
};

const deleteVape = {
  params: Joi.object().keys({
    vapeId: Joi.string().custom(objectId),
  }),
};

const linkVape = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const unlinkVape = {
  params: Joi.object().keys({
    vapeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createVape,
  getVapes,
  getVape,
  updateVape,
  deleteVape,
  linkVape,
  unlinkVape,
};
